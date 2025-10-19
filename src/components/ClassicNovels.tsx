import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";

const novels = [
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    description: "Kisah epik tentang Kapten Ahab dan obsesinya mengejar paus putih legendaris.",
    year: "1851",
    quote: "Call me Ishmael."
  },
  {
    title: "Twenty Thousand Leagues Under the Sea",
    author: "Jules Verne",
    description: "Petualangan luar biasa di bawah laut bersama Kapten Nemo dan Nautilus.",
    year: "1870",
    quote: "The sea is everything."
  },
  {
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    description: "Perjuangan seorang nelayan tua melawan ikan marlin raksasa di laut Kuba.",
    year: "1952",
    quote: "A man can be destroyed but not defeated."
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    description: "Petualangan bajak laut klasik mencari harta karun yang terkubur.",
    year: "1883",
    quote: "Fifteen men on the dead man's chest."
  }
];

const ClassicNovels = () => {
  return (
    <section className="py-24 px-4 bg-gradient-paper">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Book className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Novel Klasik Maritim
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Karya-karya sastra abadi yang mengeksplorasi misteri dan keagungan lautan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {novels.map((novel, index) => (
            <Card 
              key={index}
              className="hover:scale-105 transition-smooth shadow-soft hover:shadow-elegant bg-card border-border"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2 text-card-foreground">
                      {novel.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {novel.author} • {novel.year}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {novel.description}
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80">
                  "{novel.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassicNovels;
