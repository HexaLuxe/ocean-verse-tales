import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Loader2, MessageCircle } from "lucide-react";

interface Poem {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  lines: string[];
}

interface Favorite {
  id: string;
  poem_id: string;
  poems: Poem;
}

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          poem_id,
          poems (
            id,
            title,
            author,
            excerpt,
            lines
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data as any || []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, poemTitle: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;
      
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-ocean">
        <Loader2 className="w-8 h-8 animate-spin text-primary-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-ocean py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Puisi Favorit Saya
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Koleksi puisi yang telah Anda simpan
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card className="bg-card/95 backdrop-blur-sm p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki puisi favorit.
            </p>
            <Button onClick={() => navigate("/#poetry-section")}>
              Jelajahi Puisi
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="bg-card/95 backdrop-blur-sm p-6 hover:shadow-elegant transition-smooth"
              >
                <h3 className="text-xl font-bold mb-2 text-card-foreground">
                  {favorite.poems.title}
                </h3>
                <p className="text-sm text-muted-foreground italic mb-4">
                  — {favorite.poems.author}
                </p>
                <p className="text-card-foreground/80 mb-6 line-clamp-3">
                  {favorite.poems.excerpt}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/poem/${favorite.poems.id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Baca
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFavorite(favorite.id, favorite.poems.title)}
                    className="min-h-[44px] min-w-[44px]"
                  >
                    <Heart className="w-5 h-5 fill-current text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
