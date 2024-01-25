import Hero from "./components/Hero.tsx";
import Team from "./components/Team.tsx";
import Footer from "./components/Footer.tsx";
import About from "./components/About.tsx";


function LandingPage() {
  return (
    <div className="bg-purple-sh-1 ">
      <Hero />
      <About />
      <Team />
      <Footer />
    </div>
  );
}

export default LandingPage;
