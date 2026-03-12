import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, User, Eye, UserPlus, X, Image as ImageIcon, FileText, Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NetworkPost {
  id: number;
  author: string;
  avatar: string;
  authorType: "company" | "professional";
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  isFollowing?: boolean;
}

const initialPosts: NetworkPost[] = [
  {
    id: 1,
    author: "ElectroPower Guinée",
    avatar: "⚡",
    authorType: "company",
    timeAgo: "Il y a 3 heures",
    content: "🔌 Nous venons de compléter une installation électrique haute tension pour un nouveau site industriel en Conakry. Projet passionnant! #Installation #ÉlectricitéIndustrielle",
    likes: 245,
    comments: 18,
    shares: 52,
    category: "Expertise",
  },
  {
    id: 2,
    author: "Mamadou Diallo",
    avatar: "👨‍💼",
    authorType: "professional",
    timeAgo: "Il y a 5 heures",
    content: "Disponible pour des missions en gestion de projet et audit technique. Expérience 10 ans dans le secteur minier. N'hésitez pas à me contacter! 🎯 #Consulting #Audit",
    likes: 167,
    comments: 24,
    shares: 41,
    category: "Offre de service",
  },
  {
    id: 3,
    author: "SOGEBA Construction",
    avatar: "🏢",
    authorType: "company",
    timeAgo: "Il y a 8 heures",
    content: "📰 Fiers d'annoncer que SOGEBA Construction a remporté le prix d'excellence en construction durable 2026! Merci à notre excellent équipe et à nos partenaires. #Durabilité #Construction",
    likes: 512,
    comments: 67,
    shares: 198,
    category: "Actualité",
  },
  {
    id: 4,
    author: "Aissatou Bah",
    avatar: "👩‍💼",
    authorType: "professional",
    timeAgo: "Il y a 12 heures",
    content: "Je m'intéresse à des opportunités de partenariat dans le secteur logistique. Parlons business! 💼 #Partenariat #Logistique",
    likes: 89,
    comments: 12,
    shares: 23,
    category: "Opportunité",
  },
  {
    id: 5,
    author: "Trans-Guinea SARL",
    avatar: "🚚",
    authorType: "company",
    timeAgo: "Il y a 1 jour",
    content: "🚚 Nouveaux véhicules dans notre flotte! 4 camions de transport premium pour améliorer nos services de logistique minière. Capacité augmentée de 30%! #Transport #Logistique #Expansion",
    likes: 334,
    comments: 45,
    shares: 89,
    category: "Développement",
  },
];

interface PostCardProps {
  post: NetworkPost;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
  onShare: (id: number) => void;
  onFollow: (id: number) => void;
}

const PostCard = ({ post, onLike, onComment, onShare, onFollow }: PostCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing || false);

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
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike(post.id);
  };

  const handleCommentClick = () => {
    if (!checkAuth()) return;
    onComment(post.id);
    toast({
      description: "💬 Ajouter un commentaire...",
      duration: 2000,
    });
  };

  const handleShareClick = () => {
    if (!checkAuth()) return;
    onShare(post.id);
    toast({
      description: "🔄 Publication partagée!",
      duration: 2000,
    });
  };

  const handleFollowClick = () => {
    if (!checkAuth()) return;
    setIsFollowing(!isFollowing);
    onFollow(post.id);
    toast({
      description: isFollowing
        ? `Vous ne suivez plus ${post.author}`
        : `✅ Vous suivez maintenant ${post.author}!`,
      duration: 2000,
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-lg">
            {post.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{post.author}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
              <Badge variant="outline" className="text-xs h-5">
                {post.authorType === "company" ? "🏢 Entreprise" : "👤 Professionnel"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
        {post.image && (
          <div className="h-40 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"></div>
        )}
        <Badge className="inline-block">{post.category}</Badge>
      </div>

      {/* Stats */}
      <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground flex items-center gap-4">
        <span>❤️ {likeCount}</span>
        <span>💬 {post.comments}</span>
        <span>🔄 {post.shares}</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-1 p-2">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-1 rounded-lg py-2 px-1 transition-all duration-200 text-sm ${
            isLiked
              ? "bg-red-100 text-red-600"
              : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">J'aime</span>
        </button>
        <button
          onClick={handleCommentClick}
          className="flex items-center justify-center gap-1 rounded-lg bg-muted py-2 px-1 text-muted-foreground transition-all hover:bg-blue-50 hover:text-blue-600 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Réagir</span>
        </button>
        <button
          onClick={handleShareClick}
          className="flex items-center justify-center gap-1 rounded-lg bg-muted py-2 px-1 text-muted-foreground transition-all hover:bg-green-50 hover:text-green-600 text-sm"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Partager</span>
        </button>
        <button
          onClick={handleFollowClick}
          className={`flex items-center justify-center gap-1 rounded-lg py-2 px-1 transition-all text-sm font-medium ${
            isFollowing
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">{isFollowing ? "Suivi" : "Suivre"}</span>
        </button>
      </div>
    </div>
  );
};

const NetworkPro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<NetworkPost[]>(initialPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Expertise");
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "my-posts">("feed");

  const categories = ["Expertise", "Offre de service", "Actualité", "Opportunité", "Développement", "Recrutement"];

  const handleCreatePost = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!postContent.trim()) {
      toast({
        description: "⚠️ Veuillez écrire quelque chose",
        duration: 2000,
      });
      return;
    }

    setIsPosting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    const newPost: NetworkPost = {
      id: posts.length + 1,
      author: user.company || user.email?.split('@')[0] || "Utilisateur",
      avatar: "👤",
      authorType: user.company ? "company" : "professional",
      timeAgo: "À l'instant",
      content: postContent,
      likes: 0,
      comments: 0,
      shares: 0,
      category: selectedCategory,
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
    setShowCreatePost(false);
    setIsPosting(false);

    toast({
      description: "✅ Publication créée avec succès!",
      duration: 2000,
    });
  };

  const handleLike = (id: number) => {
    // API call would happen here
  };

  const handleComment = (id: number) => {
    // API call would happen here
  };

  const handleShare = (id: number) => {
    // API call would happen here
  };

  const handleFollow = (id: number) => {
    // API call would happen here
  };

  const myPosts = posts.filter(p => p.author === (user?.company || user?.email?.split('@')[0]));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 border-b border-border">
        <div className="container">
          <h1 className="mb-2 font-display text-4xl font-bold text-foreground">Réseau Pro Sugu-Link</h1>
          <p className="text-lg text-muted-foreground">
            Connectez-vous, partagez vos expertises et découvrez les opportunités du marché guinéen
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create post card */}
            {user ? (
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.company || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.company ? "Entreprise" : "Professionnel"}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full gap-2 justify-center"
                >
                  <FileText className="h-4 w-4" />
                  Créer une publication
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">Connectez-vous pour publier</p>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Se connecter
                </Button>
              </div>
            )}

            {/* Stats card */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <h3 className="font-semibold">Statistiques</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publications totales</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utilisateurs actifs</span>
                  <span className="font-semibold">2,547</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interactions/jour</span>
                  <span className="font-semibold">12,890</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <h3 className="font-semibold">Catégories populaires</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    #{cat.toLowerCase().replace(" ", "-")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              <button
                onClick={() => setActiveTab("feed")}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === "feed"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fil d'actualité
              </button>
              {user && (
                <button
                  onClick={() => setActiveTab("my-posts")}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === "my-posts"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mes publications ({myPosts.length})
                </button>
              )}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {activeTab === "feed"
                ? posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onFollow={handleFollow}
                    />
                  ))
                : myPosts.length > 0
                ? myPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onFollow={handleFollow}
                    />
                  ))
                : (
                  <div className="rounded-lg border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">Aucune publication pour le moment</p>
                    <Button onClick={() => setShowCreatePost(true)} variant="outline" className="mt-4">
                      Créer une publication
                    </Button>
                  </div>
                )}
            </div>

            {/* Load more */}
            <div className="text-center">
              <Button variant="outline">Charger plus</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
          <div className="w-full md:w-full md:max-w-2xl rounded-t-xl md:rounded-xl border border-border bg-background p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Créer une publication</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                👤
              </div>
              <div>
                <p className="font-semibold">{user?.company || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.company ? "Entreprise" : "Professionnel"}</p>
              </div>
            </div>

            {/* Content input */}
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Partagez vos expertises, opportunités, actualités et mises à jour..."
              className="w-full min-h-40 rounded-lg border border-border bg-muted p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Category selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" size="sm" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Image
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                📎 Fichier
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                onClick={() => setShowCreatePost(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={isPosting}
                className="gap-2"
              >
                {isPosting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>📤 Publier</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NetworkPro;
