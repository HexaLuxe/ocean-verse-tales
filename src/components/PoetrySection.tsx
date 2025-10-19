import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const poems = [
  {
    title: "The Sea",
    author: "Pablo Neruda",
    excerpt: "I need the sea because it teaches me...",
    lines: [
      "I need the sea because it teaches me.",
      "I don't know if I learn music or awareness,",
      "if it's a single wave or its vast existence,",
      "or only its harsh voice or its shining",
      "suggestion of fishes and ships."
    ]
  },
  {
    title: "Sea Fever",
    author: "John Masefield",
    excerpt: "I must go down to the seas again...",
    lines: [
      "I must go down to the seas again,",
      "to the lonely sea and the sky,",
      "And all I ask is a tall ship",
      "and a star to steer her by."
    ]
  },
  {
    title: "The Ocean",
    author: "Nathaniel Hawthorne",
    excerpt: "The ocean has its silent caves...",
    lines: [
      "The ocean has its silent caves,",
      "Deep, quiet, and alone;",
      "Though there be fury on the waves,",
      "Beneath them there is none."
    ]
  }
];

const PoetrySection = () => {
  return (
    <section className="py-24 px-4 gradient-ocean">
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

        <div className="grid md:grid-cols-3 gap-8">
          {poems.map((poem, index) => (
            <Card 
              key={index}
              className="bg-card/95 backdrop-blur-sm border-border/50 hover:scale-105 transition-smooth shadow-soft hover:shadow-elegant"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                  {poem.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 italic">
                  — {poem.author}
                </p>
                <div className="space-y-2">
                  {poem.lines.map((line, lineIndex) => (
                    <p 
                      key={lineIndex}
                      className="text-card-foreground/90 leading-relaxed font-display"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoetrySection;
