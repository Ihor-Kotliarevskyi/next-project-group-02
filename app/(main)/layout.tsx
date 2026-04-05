import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
    return (
        <div className="mainLayout">
            <Header />
            <div className="mainContent">
                {children}
                {modal}
            </div>
            <Footer />
        </div>
    );
}
