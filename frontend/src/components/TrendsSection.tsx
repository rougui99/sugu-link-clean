import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, TrendingUp, User, Eye, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Trend {
  id: number;
  company: string;
  avatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isTrending: boolean;
  category: string;
}

const trends: Trend[] = [
  {
    id: 1,
    company: "TechGUI Solutions",
    avatar: "🏢",
    timeAgo: "Il y a 2 heures",
    content:
      "🚀 Nouvelle solution de gestion d'appels d'offres lancée! Notre plateforme digitale révolutionne la façon dont les PME interagissent avec les donneurs d'ordres. Rejoignez-nous dans cette transformation! #Innovation #Guinée",
    likes: 2847,
    comments: 156,
    shares: 423,
    isTrending: true,
    category: "Entreprise",
  },
  {
    id: 2,
    company: "Conakry Logistics",
    avatar: "🚚",
    timeAgo: "Il y a 5 heures",
    content:
      "✅ Certification CNSS obtenue & vérifiée sur Sugu-Link! Nous sommes fiers d'avoir renforcé notre conformité. Merci à la communauté pour le soutien! #Conformité #LogistiqueCertifiée",
    likes: 1923,
    comments: 89,
    shares: 267,
    isTrending: true,
    category: "Certification",
  },
  {
    id: 3,
    company: "Guinée Manufacturing Corp",
    avatar: "🏭",
    timeAgo: "Il y a 8 heures",
    content:
      "Nous avons remporté un appel d'offres majeur grâce à Sugu-Link! 🎯 Notre score de réputation et nos certifications ont fait la différence. Continuons à excellentes! #Succès #PMEsGuinéenne",
    likes: 3204,
    comments: 203,
    shares: 512,
    isTrending: true,
    category: "Succès",
  },
  {
    id: 4,
    company: "Entreprise Services Plus",
    avatar: "💼",
    timeAgo: "Il y a 12 heures",
    content:
      "Notre équipe s'agrandit! Nous recrutons 15 nouveaux talents pour notre département commercial. Si vous êtes passionné par les services aux entreprises, rejoignez-nous! 💪 #Recrutement #Opportunités",
    likes: 1456,
    comments: 67,
    shares: 189,
    isTrending: false,
    category: "Carrière",
  },
];

const TrendsSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewAllTrends = () => {
    navigate("/tendances");
  };

  return (
    <section className="bg-background py-20" id="tendances">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Tendances sur Sugu-Link
          </h2>
          <p className="text-muted-foreground">
            Découvrez les publications les plus populaires et les success stories des entreprises inscrites.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={handleViewAllTrends}
            className="rounded-lg px-8 py-6 text-base font-medium hover:shadow-elevated transition-all duration-200"
          >
            Voir toutes les tendances
          </Button>
        </div>
      </div>
    </section>
  );
};

interface TrendCardProps {
  trend: Trend;
}

const TrendCard = ({ trend }: TrendCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [likeCount, setLikeCount] = useState(trend.likes);
  const [commentCount, setCommentCount] = useState(trend.comments);
  const [shareCount, setShareCount] = useState(trend.shares);

  const checkAuth = () => {
    if (!user) {
      toast({
        description: "⚠️ Vous devez être connecté pour réaliser cette action",
        duration: 2000,
      });
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleLike = () => {
    if (!checkAuth()) return;
    if (isLiked) {
      setLikeCount(likeCount - 1);
      toast({
        description: "❤️ J'aime retiré",
        duration: 2000,
      });
    } else {
      setLikeCount(likeCount + 1);
      toast({
        description: "❤️ Vous aimez cette publication!",
        duration: 2000,
      });
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    if (!checkAuth()) return;

    if (!isCommented) {
      setCommentCount(commentCount + 1);
      toast({
        description: "💬 Commentaire ajouté!",
        duration: 2000,
      });
    } else {
      setCommentCount(commentCount - 1);
      toast({
        description: "💬 Commentaire supprimé",
        duration: 2000,
      });
    }
    setIsCommented(!isCommented);
  };

  const handleShare = () => {
    if (!checkAuth()) return;

    if (!isShared) {
      setShareCount(shareCount + 1);
      toast({
        description: "🔄 Publication partagée!",
        duration: 2000,
      });
    } else {
      setShareCount(shareCount - 1);
      toast({
        description: "🔄 Partage annulé",
        duration: 2000,
      });
    }
    setIsShared(!isShared);
  };

  const handleFollow = () => {
    if (!checkAuth()) return;

    setIsFollowing(!isFollowing);
    toast({
      description: isFollowing
        ? `Vous ne suivez plus ${trend.company}`
        : `✅ Vous suivez maintenant ${trend.company}!`,
      duration: 2000,
    });
  };

  const handleVisitProfile = () => {
    if (!checkAuth()) return;

    toast({
      description: `Redirection vers le profil de ${trend.company}...`,
      duration: 2000,
    });
    // window.location.href = `/company/${trend.company.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleViewMore = () => {
    if (!checkAuth()) return;

    toast({
      description: "Voir la publication complète...",
      duration: 2000,
    });
    // window.location.href = `/publication/${trend.id}`;
  };

  const shareOptions = [
    { label: "Partager sur LinkedIn", icon: "🔗" },
    { label: "Partager sur Facebook", icon: "f" },
    { label: "Copier le lien", icon: "📋" },
    { label: "Envoyer par message", icon: "✉️" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      {/* Header avec avatar et infos entreprise */}
      <div className="flex items-start justify-between border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold">
            {trend.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{trend.company}</h3>
            <p className="text-xs text-muted-foreground">{trend.timeAgo}</p>
          </div>
        </div>
        {trend.isTrending && (
          <Badge variant="default" className="animate-pulse bg-gradient-to-r from-orange-500 to-red-500 text-white">
            🔥 Tendance
          </Badge>
        )}
      </div>

      {/* Contenu de la publication */}
      <div className="border-b border-border p-6">
        <p className="text-sm leading-relaxed text-foreground">{trend.content}</p>
        {trend.image && (
          <div className="mt-4 h-40 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"></div>
        )}
      </div>

      {/* Badge de catégorie */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <Badge 
          variant="outline" 
          className="text-xs font-medium bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
        >
          {trend.category}
        </Badge>
      </div>

      {/* Engagement stats avec boutons interactifs */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4 font-medium text-muted-foreground">
            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              ❤️ <span className="text-foreground">{likeCount}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              💬 <span className="text-foreground">{commentCount}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              🔄 <span className="text-foreground">{shareCount}</span>
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="grid grid-cols-4 gap-2">
          {/* Bouton J'aime */}
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 px-1 transition-all duration-200 ${
              isLiked
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            }`}
          >
            <Heart className={`h-5 w-5 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
            <span className="hidden text-xs font-medium sm:block">J'aime</span>
          </button>

          {/* Bouton Commenter */}
          <button
            onClick={handleComment}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 px-1 transition-all duration-200 ${
              isCommented
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-muted text-muted-foreground hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
            }`}
          >
            <MessageCircle className={`h-5 w-5 transition-transform ${isCommented ? "fill-current scale-110" : ""}`} />
            <span className="hidden text-xs font-medium sm:block">Réagir</span>
          </button>

          {/* Bouton Partager */}
          <button
            onClick={handleShare}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 px-1 transition-all duration-200 relative ${
              isShared
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
            }`}
          >
            <Share2 className={`h-5 w-5 transition-transform ${isShared ? "fill-current scale-110" : ""}`} />
            <span className="hidden text-xs font-medium sm:block">Partager</span>
          </button>

          {/* Bouton Plus - Menu d'options */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex flex-col items-center gap-1 rounded-lg bg-muted py-2 px-1 text-muted-foreground transition-all hover:bg-gray-200 dark:hover:bg-gray-700 duration-200 w-full h-full"
            >
              <span className="text-xl font-bold">⋯</span>
              <span className="hidden text-xs font-medium sm:block">Plus</span>
            </button>

            {/* Menu déroulant */}
            {showMoreMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-border bg-card shadow-lg z-10 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-xs font-semibold">Options</span>
                  <button onClick={() => setShowMoreMenu(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      toast({
                        description: `${option.label}...`,
                        duration: 2000,
                      });
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons supplémentaires */}
      <div className="border-t border-border grid grid-cols-3 gap-2 p-4">
        <Button 
          onClick={handleVisitProfile}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Profil</span>
        </Button>

        <Button 
          onClick={handleViewMore}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-xs h-8 hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Voir plus</span>
        </Button>

        <button
          onClick={handleFollow}
          className={`flex items-center justify-center gap-2 rounded-md transition-all duration-200 text-xs font-medium h-8 ${
            isFollowing
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isFollowing ? "Suivi" : "Suivre"}</span>
        </button>
      </div>
    </div>
  );
};

export default TrendsSection;
