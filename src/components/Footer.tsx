import { BookOpen, Waves } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-ocean py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-primary-foreground">
              Oceanic Literature
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 Oceanic Literature. Semua hak cipta dilindungi.
            </p>
            <p className="text-primary-foreground/60 text-xs mt-1">
              Merayakan keindahan sastra dan samudra
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
