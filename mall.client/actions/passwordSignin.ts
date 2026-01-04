"use server";
import { headers } from "next/headers";
type LoginProps = {
  username: string;
  password: string;
  captchaid: string;
  captchacode: string;
};
export async function passwordSignin({
  username,
  password,
  captchaid,
  captchacode,
}: LoginProps) {
  const h = await headers();
  const response = await fetch(
    `${process.env.OPENIDDICT_INTERNAL_ISSUER}/connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Forwarded-Host": h.get("host") || "",
        "X-Forwarded-Proto": h.get("x-forwarded-proto") || "https",
        "X-Forwarded-Port": h.get("x-forwarded-port") || "",
        "X-Forwarded-For": h.get("x-forwarded-for") || "",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: process.env.NEXTAUTH_CLIENT_ID || "",
        client_secret: process.env.NEXTAUTH_CLIENT_SECRET || "",
        username: username,
        password: password,
        captchaid: captchaid,
        captchacode: captchacode,
        scope: process.env.NEXTAUTH_SCOPE || "",
      }),
    }
  );

  return response;
}
