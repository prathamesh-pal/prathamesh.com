import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom"; // Needed for React + View Transitions
import heroImg from "./assets/portfolio1.jpg";
import flowerImg from "./assets/flower.png";
import flowerImg2 from "./assets/flower2.png";



import "./App.css";

function App() {
  // 1. STATE & REFS
  const [theme, setTheme] = useState("light");

  const imgRef = useRef<HTMLImageElement>(null);

  const STORAGE_KEY = "theme";

  // 2. INITIAL LOAD & SYSTEM PREFERENCES
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(mediaQuery.matches ? "dark" : "light");
    }

    // Follow system theme if the user hasn't chosen manually
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // 3. APPLY THEME TO DOM
  // Whenever the 'theme' state changes, we update the HTML tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 4. TOGGLE HANDLER (WITH VIEW TRANSITIONS)
  const toggleTheme = async () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      // flushSync forces React to synchronously update the DOM. 
      // This is required so the View Transition API can capture the before/after states correctly!
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    document.documentElement.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 350,
        easing: "ease",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  // 5. IMAGE ROTATION
  useEffect(() => {
    let animationFrameId: number;
    let angle = 0;

    const rotate = () => {
      angle += 0.25;

      // Safely access the DOM node via the ref
      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${angle}deg)`;
      }

      animationFrameId = requestAnimationFrame(rotate);
    };

    animationFrameId = requestAnimationFrame(rotate);

    // Cleanup animation frame on unmount to prevent memory leaks
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div>
      <div className="toggle-container">
        {/* Replaced addEventListener with React's onClick */}
        <button
          id="modeButton"
          aria-label="Toggle Dark Mode"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
        </button>
      </div>

      <div className="container">
        {/* HEADER */}
        <header>
          <div>
            <h1 className="uppercase">Prathamesh Pal</h1>
            <span style={{ fontSize: "0.9rem" }}>
              FULL-STACK DEVELOPER & STUDENT
            </span>
          </div>
          <div className="bold">[ 2026 ]</div>
        </header>

        {/* NAVIGATION */}
        <nav>
          <a href="#about">ABOUT</a> <span>//</span>
          <a href="#skills">SKILLS</a> <span>//</span>
          <a href="#projects">PROJECTS</a> <span>//</span>
          <a href="#contact">CONTACT</a>
        </nav>

        {/* ABOUT */}
        <div id="about" className="grid-row">
          <div className="grid-image-col">
            {/* Attached the ref here instead of using id="myImage" */}
            <img
              ref={imgRef}
              className="about-icon"
              src={heroImg}
              alt="Prathamesh Pal"
            />
          </div>

          <div className="grid-content">
            <p>
              I'm Prathamesh Pal - a curious learner who loves exploring how
              things work in code, math, and life.
            </p>
            <p>
              I enjoy building with <b>Python</b> and <b>JavaScript</b>, and I'm
              driven by a constant desire to understand, create, and improve.
            </p>
          </div>
        </div>

        {/* SKILLS */}
        <div id="skills">
          <div className="section-header">01. TECHNICAL SKILLS</div>
          <div className="split-row">
            <div className="split-col">
              <b className="uppercase">Languages</b>
              <hr className="divider" />
              <ul>
                <li>Python</li>
                <li>JavaScript</li>
                <li>HTML & CSS</li>
                <li>SQL & NoSQL</li>
              </ul>
            </div>
            <div className="split-col">
              <b className="uppercase">Frameworks</b>
              <hr className="divider" />
              <ul>
                <li>FastAPI & Django</li>
                <li>Node.js</li>
                <li>React,Tailwind CSS</li>
                <li>Git</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div id="projects">
          <div className="section-header">02. SELECTED WORK</div>

          <div className="project-item">
            <div>
              <span className="project-title uppercase">WorkNest</span>{" "}
              <span className="project-sub">JOB PORTAL</span>
            </div>
            <div>
              A recruiter and job-finder system built with <b>Flask & SQLite</b>.
            </div>
          </div>

          <div className="project-item">
            <div>
              <span className="project-title uppercase">Finance Sim</span>{" "}
              <span className="project-sub">STOCK TRADING</span>
            </div>
            <div>
              Real-time stock trading simulator with portfolio tracking.
            </div>
          </div>

          <div className="project-item">
            <div>
              <span className="project-title uppercase">Auction Hub</span>{" "}
              <span className="project-sub">
                ECOMMERCE{" "}
                <a
                  href="https://github.com/prathamesh-pal/Django-BOOKStop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐
                </a>
              </span>
            </div>
            <div>
              <b>Django-based</b> auction system with bidding, comments, and categories.
            </div>
          </div>
        </div>

        <br />

        {/* EXPERIENCE & EDUCATION */}
        <div className="split-row">
          <div className="split-col">
            <b className="uppercase">Experience</b>
            <hr className="divider" />
            <p>• Peer Tutor (Math & Code)</p>
            <br />
            <p>• Freelance Full-Stack Developer</p>
            <br />
            <p>• API Architect</p>
          </div>
          <div className="split-col">
            <b className="uppercase">Education</b>
            <hr className="divider" />
            <p>
              • <b>CS50 & Self-Taught Developer</b>
              <br />
              &nbsp;&nbsp;Learning by building & exploring
            </p>
            <br />
            <p>
              • <b>M.Sc. Mathematics</b> (In Progress)
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div id="contact" className="contact-box">
          <h2 className="uppercase" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Let's Work Together
          </h2>
          <div className="contact-links">
            <a href="mailto:prathameshpal.tech@gmail.com">[ SEND EMAIL ]</a>
            <a href="https://github.com/prathamesh-pal" target="_blank" rel="noopener noreferrer">[ GITHUB ]</a>
            <a href="https://www.linkedin.com/in/prathamesh-pal-10227a240/" target="_blank" rel="noopener noreferrer">[ LINKEDIN ]</a>
            <a href="https://x.com/PrathEffect" target="_blank" rel="noopener noreferrer">[ TWITTER ]</a>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <div>© 2026 PRATHAMESH PAL</div>
          <div>Designed by PRATHAMESH</div>
        </footer>
      </div>
      <div className="flower">
        <img src={flowerImg} alt="flowers" draggable={false} />
      </div>
      <div className="flower2">
        <img src={flowerImg2} alt="flowers" draggable={false} />
      </div>
    </div>
  );
}

export default App;