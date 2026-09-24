import { PortfolioModeProvider } from "./context/PortfolioModeProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WorkspaceShell from "./components/workspace/WorkspaceShell";

function App() {
  return (
    <PortfolioModeProvider>
      <div className="min-h-dvh bg-bg-primary">
        <Navbar />
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
        <Footer />
        <WorkspaceShell />
      </div>
    </PortfolioModeProvider>
  );
}

export default App;
