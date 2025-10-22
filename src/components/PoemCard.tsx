import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PoemCardProps {
  poem: {
    id: string;
    title: string;
    author: string;
    lines: string[];
  };
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const PoemCard = ({ poem, isFavorite = false, onFavoriteToggle }: PoemCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan masuk untuk menyimpan favorit",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("poem_id", poem.id);
        toast({
          title: "Dihapus dari favorit",
        });
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, poem_id: poem.id });
        toast({
          title: "Ditambahkan ke favorit",
        });
      }
      onFavoriteToggle?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border/50 hover:scale-105 transition-smooth shadow-soft hover:shadow-elegant">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2 text-card-foreground">
          {poem.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 italic">
          — {poem.author}
        </p>
        <div className="space-y-2 mb-6">
          {poem.lines.map((line, lineIndex) => (
            <p
              key={lineIndex}
              className="text-card-foreground/90 leading-relaxed font-display"
            >
              {line}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            disabled={loading}
            className="flex-1"
          >
            <Heart
              className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current text-red-500" : ""}`}
            />
            {isFavorite ? "Favorit" : "Tambah Favorit"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/poem/${poem.id}`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Komentar
          </Button>
        </div>
      </div>
    </Card>
  );
};
