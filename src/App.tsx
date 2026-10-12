import { lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Controls } from './components/Controls';
import { Icon } from './components/Icon';
import { SceneBoundary } from './components/SceneBoundary';
import { SceneFallback } from './components/SceneFallback';
import { useMediaQuery } from './hooks/useMediaQuery';
import { usePageVisibility } from './hooks/usePageVisibility';
import { experienceReducer, initialState, specimens } from './lib/experience';
import type { SceneSignals } from './scene/Sculpture';

const Scene = lazy(() => import('./scene/Scene'));
gsap.registerPlugin(ScrollTrigger);
const repository = 'https://github.com/RafayelKaramyan/rafyntra';

function Brand() {
  return (
    <a href="#top" className="brand" aria-label="Rafyntra home">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <path d="m4 26 13-20 13 20h-8l-5-8-5 8Z" fill="currentColor" />
        <path d="M8 28h18" stroke="currentColor" />
      </svg>
      <span>
        RAFYNTRA<span className="brand-second">FORM / MOTION</span>
      </span>
    </a>
  );
}

export function App() {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [activeSection, setActiveSection] = useState('experience');
  const [inView, setInView] = useState(true);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 760px)');
  const pageVisible = usePageVisibility();
  const root = useRef<HTMLDivElement>(null);
  const experience = useRef<HTMLDivElement>(null);
  const signals = useRef<SceneSignals>({ scroll: 0, pointerX: 0, pointerY: 0 });
  const specimen = specimens.find((item) => item.id === state.specimen) ?? specimens[0];
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) return;
      gsap.from('[data-intro]', {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.to(signals.current, {
        scroll: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience-flow',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-25% 0px -45% 0px' },
    );
    document.querySelectorAll('[data-section]').forEach((section) => observer.observe(section));
    const visibility = new IntersectionObserver(([entry]) =>
      setInView(entry?.isIntersecting ?? false),
    );
    if (experience.current) visibility.observe(experience.current);
    return () => {
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    signals.current.pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    signals.current.pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };

  // Keep one active WebGL canvas. On mobile, move the interactive view beside its controls.
  const sceneView = failed ? (
    <SceneFallback state={state} />
  ) : (
    <SceneBoundary key={retryKey} onError={onError} fallback={<SceneFallback state={state} />}>
      <Suspense fallback={<SceneFallback state={state} loading />}>
        <Scene
          state={state}
          compact={compact}
          reducedMotion={reducedMotion}
          signals={signals}
          visible={pageVisible && inView}
          onReady={onReady}
          onContextLost={onError}
        />
      </Suspense>
    </SceneBoundary>
  );

  return (
    <div ref={root} id="top" className="app" data-motion={reducedMotion ? 'reduced' : 'full'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <Brand />
        <nav className="navigation" aria-label="Main navigation">
          {[
            ['experience', 'Experience'],
            ['laboratory', 'Laboratory'],
            ['engineering', 'Engineering'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {label}
              <span />
            </a>
          ))}
        </nav>
        <a className="header-source" href={repository} target="_blank" rel="noreferrer">
          View source <Icon name="diagonal" />
        </a>
      </header>

      <main id="main">
        <div id="experience-flow" ref={experience} className="experience-flow">
          <div
            className={`visual-stage ${inView ? '' : 'stage-hidden'}`}
            onPointerMove={handlePointer}
            onPointerLeave={() => {
              signals.current.pointerX = 0;
              signals.current.pointerY = 0;
            }}
          >
            <div className="stage-glow" />
            <div className="stage-trace" />
            <span className="stage-cross cross-top">+</span>
            <span className="stage-cross cross-bottom">+</span>
            <div
              className="scene-container"
              data-testid="scene-container"
              data-renderer={failed ? 'fallback' : ready ? 'webgl' : 'loading'}
            >
              {compact && activeSection === 'laboratory' ? (
                <SceneFallback state={state} />
              ) : (
                sceneView
              )}
            </div>
            <div className="specimen-caption">
              <span className="caption-rule" />
              <span>
                SPECIMEN {specimen.number}
                <strong>{specimen.name.toUpperCase()}</strong>
              </span>
              <span className="formula">{specimen.formula}</span>
            </div>
            <span className="pointer-hint">
              {failed
                ? 'STATIC MATERIAL PREVIEW'
                : compact
                  ? 'EXPLORE THE CONTROLS BELOW'
                  : 'MOVE YOUR POINTER TO EXPLORE'}
              <span className="hint-mark">↗</span>
            </span>
          </div>

          <section
            id="experience"
            data-section
            className="hero section-shell"
            aria-labelledby="hero-title"
          >
            <div className="hero-copy">
              <div className="eyebrow" data-intro>
                <span className="status-dot" />
                AN INTERACTIVE MATERIAL STUDY<span className="edition">VOL. 001</span>
              </div>
              <h1 id="hero-title" data-intro>
                Matter.
                <br />
                <span className="serif-word">Reimagined.</span>
                <span className="heading-asterisk">✳</span>
              </h1>
              <p className="hero-description" data-intro>
                A small experiment in possibility.
                <br />
                Explore the space between form,
                <br className="desktop-break" /> light, and a little curiosity.
              </p>
              <a href="#laboratory" className="primary-link" data-intro>
                <span>Enter the laboratory</span>
                <span className="arrow-circle">
                  <Icon name="arrow" />
                </span>
              </a>
              <div className="hero-bottom" data-intro>
                <span className="scroll-glyph">
                  <span />
                </span>
                <span>SCROLL TO DISCOVER</span>
                <span className="hero-coordinate">40.18° N / 44.51° E</span>
              </div>
            </div>
            <div className="hero-footer">
              <span>
                DESIGNED & ENGINEERED BY <a href="#engineering">RAFAYEL KARAMYAN</a>
              </span>
              <span className="availability">
                <span className="status-dot" />
                {failed ? 'STATIC PREVIEW' : ready ? 'REAL-TIME WEBGL' : 'PREPARING 3D'}
              </span>
            </div>
          </section>

          <section
            id="laboratory"
            data-section
            className="laboratory section-shell"
            aria-labelledby="lab-title"
          >
            <div className="laboratory-copy">
              <div className="section-number" data-reveal>
                <span>01 — THE LABORATORY</span>
                <span>YOUR INPUT. A NEW PERSPECTIVE.</span>
              </div>
              <h2 id="lab-title" data-reveal>
                Same matter.
                <br />
                <span className="muted">Different feeling.</span>
              </h2>
              <p className="section-description" data-reveal>
                Change the form. Shift the finish. Give it room to breathe. There is no right
                configuration — just the one that catches your eye.
              </p>
              {compact && (
                <div className="mobile-preview" aria-label="Interactive sculpture preview">
                  {activeSection === 'laboratory' ? sceneView : <SceneFallback state={state} />}
                </div>
              )}
              <Controls state={state} dispatch={dispatch} reducedMotion={reducedMotion} />
              <p className="live-description" aria-live="polite">
                <span className="status-dot" />
                {specimen.name} — {specimen.detail}
              </p>
              {failed && (
                <div className="recovery" role="status">
                  <p>
                    3D rendering is unavailable. The material preview and controls remain
                    accessible.
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setFailed(false);
                      setReady(false);
                      setRetryKey((key) => key + 1);
                    }}
                  >
                    Retry 3D <Icon name="reset" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <section
          id="engineering"
          data-section
          className="engineering section-shell"
          aria-labelledby="engineering-title"
        >
          <div className="section-number" data-reveal>
            <span>02 — UNDER THE SURFACE</span>
            <span>THE CRAFT BEHIND THE CANVAS</span>
          </div>
          <div className="engineering-heading" data-reveal>
            <h2 id="engineering-title">
              Built to be felt.
              <br />
              <span>Engineered to work.</span>
            </h2>
            <p>
              A creative study with a practical foundation. The visual layer is an invitation; the
              engineering makes it usable.
            </p>
          </div>
          <div className="engineering-grid">
            <article data-reveal>
              <span className="article-number">01 / GEOMETRY</span>
              <svg
                className="engineering-drawing"
                viewBox="0 0 260 90"
                fill="none"
                aria-hidden="true"
              >
                <ellipse cx="130" cy="45" rx="85" ry="22" />
                <ellipse cx="130" cy="45" rx="85" ry="22" transform="rotate(20 130 45)" />
                <ellipse cx="130" cy="45" rx="85" ry="22" transform="rotate(-20 130 45)" />
              </svg>
              <h3>Procedural by design.</h3>
              <p>
                Three mathematical forms, generated in code. No downloaded models. No texture
                requests. Just geometry, materials, and light.
              </p>
              <span className="article-tag">THREE.JS + REACT THREE FIBER</span>
            </article>
            <article data-reveal>
              <span className="article-number">02 / INTERACTION</span>
              <svg
                className="engineering-drawing"
                viewBox="0 0 260 90"
                fill="none"
                aria-hidden="true"
              >
                <path d="M20 45h48c24 0 14-28 42-28s16 55 42 55 18-27 40-27h48" />
                <circle cx="130" cy="45" r="4" />
              </svg>
              <h3>Motion with intention.</h3>
              <p>
                Pointer movement, scroll, and controls share one scene. Time-based damping keeps
                transitions consistent across refresh rates.
              </p>
              <span className="article-tag">GSAP + FRAME-BASED MOTION</span>
            </article>
            <article data-reveal>
              <span className="article-number">03 / RESILIENCE</span>
              <svg
                className="engineering-drawing"
                viewBox="0 0 260 90"
                fill="none"
                aria-hidden="true"
              >
                <rect x="70" y="12" width="120" height="65" rx="3" />
                <path d="M86 60V45m16 15V32m16 28V22m16 38V38m16 22V28m16 32V45" />
              </svg>
              <h3>More than the spectacle.</h3>
              <p>
                Keyboard controls, reduced motion, a bounded pixel ratio, and a recoverable graphics
                fallback. The experience adapts to its visitor.
              </p>
              <span className="article-tag">STRICT TYPESCRIPT + ACCESSIBILITY</span>
            </article>
          </div>
          <div className="engineering-footer">
            <span>CURIOUS ABOUT THE DECISIONS?</span>
            <a href={`${repository}#engineering-decisions`} target="_blank" rel="noreferrer">
              Read the engineering notes <Icon name="diagonal" />
            </a>
          </div>
        </section>

        <footer className="footer section-shell">
          <div className="footer-top">
            <span className="eyebrow">AN INDEPENDENT EXPLORATION</span>
            <a href="#top" className="back-top">
              BACK TO TOP <Icon name="diagonal" />
            </a>
          </div>
          <div className="footer-heading">
            <p>
              Curiosity is
              <br />
              <span>a good beginning.</span>
            </p>
            <a
              className="footer-source"
              href={repository}
              target="_blank"
              rel="noreferrer"
              aria-label="Explore the Rafyntra source on GitHub"
            >
              <Icon name="diagonal" />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} RAFAYEL KARAMYAN</span>
            <span>REACT / TYPESCRIPT / WEBGL</span>
            <a href={repository} target="_blank" rel="noreferrer">
              GITHUB <Icon name="diagonal" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
