import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterSocial from "./FooterSocial";

export default function Footer() {
  return (
    <footer className="bg-muted dark:bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterBrand />
          <FooterLinks />
          <FooterSocial />
        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 pt-8 border-t border-border text-center text-body-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Los Inmaduros Roller Madrid. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
