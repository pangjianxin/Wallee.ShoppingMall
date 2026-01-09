import PublicLayout from "@/components/layout/public-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <PublicLayout>{children}</PublicLayout>;
};

Layout.displayName = "PublicRootLayout";

export default Layout;
