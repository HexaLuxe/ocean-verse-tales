import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Poem {
  id: string;
  title: string;
  author: string;
  lines: string[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
  } | null;
}

const PoemDetail = () => {
  const { id: poemId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadPoem();
    loadComments();
    if (user) {
      checkFavorite();
    }
  }, [poemId, user]);

  const loadPoem = async () => {
    try {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .eq("id", poemId)
        .single();

      if (error) throw error;
      setPoem(data);
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

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles!comments_user_id_fkey (username)
        `)
        .eq("poem_id", poemId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data as any || []);
    } catch (error: any) {
      console.error("Error loading comments:", error);
    }
  };

  const checkFavorite = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("poem_id", poemId)
        .maybeSingle();

      setIsFavorite(!!data);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan masuk untuk menyimpan favorit",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("poem_id", poemId);
        setIsFavorite(false);
        toast({ title: "Dihapus dari favorit" });
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, poem_id: poemId });
        setIsFavorite(true);
        toast({ title: "Ditambahkan ke favorit" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan masuk untuk berkomentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        poem_id: poemId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      loadComments();
      toast({
        title: "Komentar berhasil ditambahkan",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-ocean">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-ocean">
        <p className="text-primary-foreground">Puisi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-ocean py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card className="bg-card/95 backdrop-blur-sm p-8 mb-8 shadow-elegant">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-card-foreground">
                {poem.title}
              </h1>
              <p className="text-muted-foreground italic">— {poem.author}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleFavorite}>
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
              />
            </Button>
          </div>
          <div className="space-y-3">
            {poem.lines.map((line, index) => (
              <p
                key={index}
                className="text-lg text-card-foreground/90 leading-relaxed font-display"
              >
                {line}
              </p>
            ))}
          </div>
        </Card>

        <Card className="bg-card/95 backdrop-blur-sm p-8 shadow-elegant">
          <h2 className="text-2xl font-bold mb-6 text-card-foreground">
            Komentar ({comments.length})
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                user
                  ? "Tulis komentar Anda..."
                  : "Silakan masuk untuk berkomentar"
              }
              disabled={!user || submitting}
              className="mb-4"
              rows={4}
            />
            <Button type="submit" disabled={!user || submitting || !newComment.trim()}>
              {submitting ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada komentar. Jadilah yang pertama!
              </p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-4 bg-background/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-card-foreground">
                      {comment.profiles?.username || "Pengguna"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                  <p className="text-card-foreground/90">{comment.content}</p>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PoemDetail;
