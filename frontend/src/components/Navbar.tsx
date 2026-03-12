import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";  // ← Search supprimé
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from './NotificationBell';
import { MessageButton } from './MessageButton';

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Réseau Pro", path: "/reseau-pro" },
  { label: "Annuaire", path: "/annuaire" },
  { label: "Appels d'offres", path: "/appels-offres" },
  { label: "Offres d'emploi", path: "/offres-emploi" },
  { label: "Tarifs", path: "/tarifs" },
];

interface NavbarUserActionsProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavbarUserActions = ({ isMobile = false, onItemClick }: NavbarUserActionsProps) => {
  const auth = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (auth?.user) {
    if (!isMobile) {
      return (
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="max-w-[150px] truncate">{auth.user.email}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 z-50">
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => { setDropdownOpen(false); onItemClick?.(); }}
              >
                📊 Tableau de bord
              </Link>
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => { setDropdownOpen(false); onItemClick?.(); }}
              >
                👤 Mon profil
              </Link>
              <div className="border-t my-1"></div>
              <button 
                onClick={() => { auth.logout(); setDropdownOpen(false); onItemClick?.(); }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors"
              >
                🚪 Déconnexion
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Link 
          to="/dashboard" 
          className="text-sm text-muted-foreground hover:text-foreground py-2"
          onClick={onItemClick}
        >
          📊 Tableau de bord
        </Link>
        <Link 
          to="/profile" 
          className="text-sm text-muted-foreground hover:text-foreground py-2"
          onClick={onItemClick}
        >
          👤 Mon profil
        </Link>
        <span className="text-sm text-muted-foreground py-2 border-t pt-2">{auth.user.email}</span>
        <Button variant="outline" size="sm" onClick={() => { auth.logout(); onItemClick?.(); }}>
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <div className={isMobile ? "flex flex-col gap-2" : "flex items-center gap-3"}>
      <Link to="/login" onClick={onItemClick}>
        <Button variant="outline" size="sm">Connexion</Button>
      </Link>
      <Link to="/signup" onClick={onItemClick}>
        <Button size="sm">Créer un compte</Button>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Sugu<span className="text-gradient-gold">-Link</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === item.path
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop user actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* 🔍 Recherche avec emoji */}
          <Link to="/offres-emploi" title="Rechercher des offres">
            <Button variant="ghost" size="icon" className="hover:bg-blue-100 hover:text-blue-600 text-xl">
              🔍
            </Button>
          </Link>
          
          {/* 💬 Messages et 🔔 Notifications - seulement si connecté */}
          {user && (
            <>
              <MessageButton />
              <NotificationBell />
            </>
          )}
          
          <NavbarUserActions isMobile={false} />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  location.pathname === item.path
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border">
              <NavbarUserActions isMobile={true} onItemClick={handleLinkClick} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;