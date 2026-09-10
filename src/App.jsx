import Navbar from "./components/Navbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import TrueFocus from "./components/TrueFocus";
import GlowCursor from "./components/GlowCursor";

function App() {
  return (
    <GlowCursor
      color="#ff4fa3"
      secondaryColor="#ff78b8"
      trailLength={36}
      trailWidth={7}
      trailTaper={0.8}
      followSpeed={0.18}
      glowIntensity={1.7}
      glowSpread={1.1}
      hotspot={0.65}
      brightness={1.2}
      opacity={0.9}
      pulseSpeed={1}
      noiseStrength={0.025}
      idleFade
      idleTimeout={700}
      fadeDuration={900}
      blendMode="screen"
    >
      <Navbar />

      <section id="home">
        <div className="home-content">
          <p className="small-title">HELLO, I'M</p>

          <TrueFocus
            sentence="Sophia Gail Santos"
            manualMode={false}
            blurAmount={3}
            borderColor="#ff4fa3"
            glowColor="rgba(255, 79, 163, 0.6)"
            animationDuration={0.6}
            pauseBetweenAnimations={1}
          />

          <h2>UI/UX Designer & Front-End Developer</h2>

          <p className="description">
            I create clean, user-friendly websites and digital experiences that
            are simple, functional, and enjoyable to use.
          </p>

          <a href="#projects" className="project-button">
            View My Projects
          </a>
        </div>
      </section>

      <About />
      <Skills />
      <Projects />
      <Contact />
    </GlowCursor>
  );
}

export default App;
