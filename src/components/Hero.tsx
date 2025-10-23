import { Button } from "@/components/ui/button";
import { BookOpen, Waves, LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroOcean from "@/assets/hero-ocean.jpg";

const Hero = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Auth buttons in top right */}
      <div className="absolute top-4 right-4 z-30">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-primary-foreground bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
          >
            <LogIn className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Masuk</span>
          </Button>
        )}
      </div>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroOcean})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background/90" />
      </div>

      {/* Animated Waves Decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Waves className="w-full h-24 text-background/20 wave-animation" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-16 h-16 text-accent" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground">
            Oceanic Literature
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90 italic font-display">
            "The sea, once it casts its spell, holds one in its net of wonder forever."
          </p>
          
          <p className="text-lg mb-8 text-primary-foreground/80">
            — Jacques Cousteau
          </p>
          
          <p className="text-lg md:text-xl mb-12 text-primary-foreground/90 max-w-2xl mx-auto">
            Jelajahi kedalaman sastra klasik dan puisi yang terinspirasi dari keagungan samudra. 
            Temukan kisah-kisah abadi yang mengalir seperti ombak di pantai.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant transition-smooth"
            >
              Mulai Membaca
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 transition-smooth"
            >
              Koleksi Puisi
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
