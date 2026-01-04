import Layout from "@/components/mobile/layout/index";

export default async function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Layout showHeader={true} showNavBar={true}>
        {children}
        {modal}
      </Layout>
    </>
  );
}
