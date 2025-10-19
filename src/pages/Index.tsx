import Hero from "@/components/Hero";
import ClassicNovels from "@/components/ClassicNovels";
import PoetrySection from "@/components/PoetrySection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ClassicNovels />
      <PoetrySection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
