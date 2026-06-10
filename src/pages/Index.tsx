import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Courses from "@/components/Courses";
import Categories from "@/components/Categories";
import SocialProof from "@/components/SocialProof";
import BlogSection from "@/components/BlogSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PopupDisplay from "@/components/PopupDisplay";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />
      <main>
        <Hero />
        <Courses />
        <Benefits />
        <Categories />
        <SocialProof />
        <BlogSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <PopupDisplay />
    </div>
  );
};

export default Index;
