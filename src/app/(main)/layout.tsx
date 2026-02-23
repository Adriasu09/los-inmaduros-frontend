import Navbar from "@/components/layout/app-navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
