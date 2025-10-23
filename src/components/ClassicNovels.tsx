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
  },
  {
    title: "The Odyssey",
    author: "Homer",
    description: "Epik kuno tentang perjalanan Odysseus pulang ke rumah melintasi laut berbahaya.",
    year: "~800 SM",
    quote: "The wine-dark sea."
  },
  {
    title: "Lord Jim",
    author: "Joseph Conrad",
    description: "Kisah tentang kehormatan, pengkhianatan, dan penebusan seorang pelaut muda.",
    year: "1900",
    quote: "He was one of us."
  },
  {
    title: "The Sea-Wolf",
    author: "Jack London",
    description: "Petualangan brutal di atas kapal anjing laut dengan kapten yang kejam.",
    year: "1904",
    quote: "The sailor is frankness, the landsman is finesse."
  },
  {
    title: "Captains Courageous",
    author: "Rudyard Kipling",
    description: "Kisah transformasi seorang anak kaya yang jatuh dari kapal mewah.",
    year: "1897",
    quote: "We're all bound to be here together."
  },
  {
    title: "Two Years Before the Mast",
    author: "Richard Henry Dana Jr.",
    description: "Memoar otentik kehidupan keras seorang pelaut di abad ke-19.",
    year: "1840",
    quote: "Nothing will do in seafaring but to carry everything with a high hand."
  },
  {
    title: "The Riddle of the Sands",
    author: "Erskine Childers",
    description: "Novel spionase maritim yang menegangkan di perairan Jerman.",
    year: "1903",
    quote: "The sea was mother-naked."
  }
];

const ClassicNovels = () => {
  return (
    <section id="classic-novels" className="py-24 px-4 bg-gradient-paper">
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
