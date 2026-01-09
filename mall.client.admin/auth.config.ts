import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { passwordSignin } from "@/actions/passwordSignin";
import type { User } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { DecodedJWT } from "@/types/next-auth";

class InvalidUsernameOrPassword extends CredentialsSignin {
  code = "invalid_username_or_password";
}

class InvalidCaptcha extends CredentialsSignin {
  code = "invalid_captcha";
}

class InvalidGrant extends CredentialsSignin {
  code = "invalid_grant";
}

const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/account/login" },
  providers: [
    Credentials({
      id: "credentials",
      name: "用户名密码登录",
      credentials: {
        username: {},
        password: {},
        captchaid: {},
        captchacode: {},
      },
      authorize: async (credentials) => {
        const signinResponse = await passwordSignin({
          username: credentials.username as string,
          password: credentials.password as string,
          captchaid: credentials.captchaid as string,
          captchacode: credentials.captchacode as string,
        });

        const signinRes = await signinResponse.json();
        if (signinRes && signinResponse.status === 200) {
          const decodedJWT = jwtDecode<DecodedJWT>(signinRes.access_token);
          return {
            id: decodedJWT.sub,
            name: decodedJWT.preferred_username,
            username: decodedJWT.preferred_username,
            email: decodedJWT.email,
            image: "/images/avatar.jpg",
            accessToken: signinRes.access_token,
            refreshToken: signinRes.refresh_token,
            idToken: signinRes.id_token,
            expiresAt: decodedJWT.exp,
            roles: decodedJWT.role,
            // 组织单位信息
            organization_unit_code: decodedJWT.organization_unit_code,
            organization_unit_id: decodedJWT.organization_unit_id,
            supplier_id: decodedJWT.supplier_id,
          };
        } else {
          const errorDesc = signinRes.error_description?.toLowerCase() || "";
          if (
            errorDesc.includes("username") ||
            errorDesc.includes("用户名") ||
            errorDesc.includes("password") ||
            errorDesc.includes("密码")
          ) {
            throw new InvalidUsernameOrPassword(signinRes.error_description);
          } else if (
            errorDesc.includes("captcha") ||
            errorDesc.includes("验证码")
          ) {
            throw new InvalidCaptcha(signinRes.error_description);
          } else {
            throw new InvalidGrant(signinRes.error_description);
          }
        }
      },
    }),
    {
      id: "openiddict",
      name: "内置",
      type: "oidc",
      issuer: process.env.OPENIDDICT_INTERNAL_ISSUER,
      clientId: process.env.NEXTAUTH_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_CLIENT_SECRET,
      authorization: {
        url: `${process.env.OPENIDDICT_EXTERNAL_ISSUER}/connect/authorize`,
        params: {
          scope: process.env.NEXTAUTH_SCOPE,
          response_type: "code",
        },
      },
      wellKnown: process.env.OPENIDDICT_WELL_KNOWN,
      profile: (profile) => {
        return {
          id: profile.sub as string,
          name: profile.unique_name || profile.name,
          email: profile.email,
          image: "/images/avatar.jpg",
          roles: profile.role,
          organization_unit_code: profile.organization_unit_code,
          organization_unit_id: profile.organization_unit_id,
          supplier_id: profile.supplier_id,
        } as User;
      },
    },
  ],
  callbacks: {
    authorized() {
      return true;
    },
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update") {
        token.name = session.user.name;
        return token;
      }

      if (trigger === "signIn") {
        if (account?.provider === "openiddict") {
          return {
            ...token,
            id: (user as any)?.id,
            accessToken: account?.access_token,
            refreshToken: account.refresh_token,
            idToken: account.id_token,
            expiresAt: account.expires_at,
            roles: user.roles,
            organization_unit_code: user.organization_unit_code,
            organization_unit_id: user.organization_unit_id,
            supplier_id: user.supplier_id,
          };
        }
        if (account?.provider === "credentials") {
          return {
            ...token,
            id: (user as any)?.id,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            idToken: user.idToken,
            expiresAt: user.expiresAt,
            roles: user.roles,
            organization_unit_code: user.organization_unit_code,
            organization_unit_id: user.organization_unit_id,
            supplier_id: user.supplier_id,
          };
        }
      }

      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        return null;
      }

      return token;
    },
    async signIn() {
      return true;
    },
    async session({ session, token }) {
      if (!token) {
        return null as any;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles,
          organization_unit_code: token.organization_unit_code,
          organization_unit_id: token.organization_unit_id,
          supplier_id: token.supplier_id,
        },
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        idToken: token.idToken as string,
        expiresAt: token.expiresAt as number,
      };
    },
  },
};

export default authConfig;
