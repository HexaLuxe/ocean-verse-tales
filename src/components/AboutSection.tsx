import { Anchor } from "lucide-react";
import booksVintage from "@/assets/books-vintage.jpg";

const AboutSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-paper">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="flex items-center mb-6">
              <Anchor className="w-10 h-10 text-primary mr-3" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Tentang Kami
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Oceanic Literature adalah ruang di mana kedalaman samudra bertemu dengan 
                kedalaman kata-kata. Kami percaya bahwa laut dan sastra memiliki kesamaan 
                yang mendalam—keduanya luas, misterius, dan penuh dengan kisah yang menunggu 
                untuk ditemukan.
              </p>
              
              <p>
                Seperti ombak yang terus bergerak, sastra klasik terus hidup dan relevan 
                di setiap generasi. Dari Moby-Dick karya Melville hingga puisi-puisi Neruda, 
                setiap karya adalah pelayaran menuju pemahaman yang lebih dalam tentang 
                kondisi manusia.
              </p>
              
              <p>
                Di sini, Anda akan menemukan kumpulan novel klasik maritim dan puisi 
                yang terinspirasi dari laut—sebuah perpustakaan digital yang merayakan 
                keindahan bahasa dan kekuatan narasi.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-6 italic text-foreground/80 text-lg">
                "Books are the ships of the mind, sailing through the ocean of knowledge."
              </blockquote>
            </div>
          </div>

          <div className="animate-fade-in">
            <div className="relative rounded-lg overflow-hidden shadow-elegant">
              <img 
                src={booksVintage} 
                alt="Vintage classic books collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
