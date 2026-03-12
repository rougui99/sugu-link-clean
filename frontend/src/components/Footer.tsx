import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Sugu<span className="text-gradient-gold">-Link</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              La plateforme digitale B2B pour le contenu local en Guinée.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Plateforme</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/annuaire" className="hover:text-primary">Annuaire</Link></li>
              <li><Link to="/appels-offres" className="hover:text-primary">Appels d'offres</Link></li>
              <li><Link to="/#tarifs" className="hover:text-primary">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Pré-qualification</a></li>
              <li><a href="#" className="hover:text-primary">Audit conformité</a></li>
              <li><a href="#" className="hover:text-primary">Formation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Conakry, Guinée</li>
              <li>contact@sugu-link.com</li>
              <li>+224 XXX XXX XXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Sugu-Link. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
