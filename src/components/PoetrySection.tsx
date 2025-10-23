import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PoemCard } from "./PoemCard";

interface Poem {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  lines: string[];
}

const PoetrySection = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    loadPoems();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  const loadPoems = async () => {
    try {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setPoems(data || []);
    } catch (error) {
      console.error("Error loading poems:", error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("poem_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(new Set(data?.map((f) => f.poem_id) || []));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  return (
    <section id="poetry-section" className="py-24 px-4 gradient-ocean">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Puisi Samudra
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Kata-kata yang mengalir seperti ombak, membawa kedalaman emosi dan keindahan alam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {poems.map((poem) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              isFavorite={favorites.has(poem.id)}
              onFavoriteToggle={loadFavorites}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoetrySection;
