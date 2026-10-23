"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const metrics = [
  {
    value: "58",
    label: "More pick-up point use",
    note: "A better way to arrive",
  },
  {
    value: "23",
    label: "Fewer customer calls",
    note: "Less friction. More freedom.",
  },
  {
    value: "27",
    label: "Growth in pick-up adoption",
    note: "Forward, together",
  },
  {
    value: "40",
    label: "Fewer support enquiries",
    note: "An effortless experience",
  },
];
const chapters = ["Ignition", "Momentum", "Beyond"];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DriveExperience() {
  const root = useRef<HTMLElement>(null);
  const runway = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const progressText = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [night, setNight] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const reduced = motionPaused || systemReduced;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        if (motionPaused) return;
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".intro-eyebrow", { y: 12, opacity: 0, duration: 0.7 })
          .from(
            ".headline-letter",
            {
              yPercent: 105,
              rotate: 4,
              opacity: 0,
              stagger: 0.035,
              duration: 0.9,
            },
            0.12,
          )
          .from(
            ".metric",
            { y: 22, opacity: 0, stagger: 0.11, duration: 0.8 },
            0.5,
          )
          .from(".car-entrance", { x: -70, opacity: 0, duration: 1.25 }, 0.45)
          .from(".scene-decoration", { opacity: 0, duration: 1 }, 0.6);

        let lastChapter = -1;
        let lastPercent = -1;
        const drive = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: runway.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            const progress = this.progress();
            const percent = Math.round(progress * 100);
            const chapter = progress < 0.3 ? 0 : progress < 0.72 ? 1 : 2;
            // No React render or layout reads in the animation loop.
            if (percent !== lastPercent && progressText.current) {
              progressText.current.textContent = String(percent).padStart(
                2,
                "0",
              );
              lastPercent = percent;
            }
            if (chapter !== lastChapter) {
              chapterRefs.current.forEach((button, index) =>
                button?.setAttribute(
                  "aria-current",
                  index === chapter ? "step" : "false",
                ),
              );
              lastChapter = chapter;
            }
          },
        });
        // Function-based distances are measured on refresh, not on every scroll.
        const distance = () => scene.current?.clientWidth || window.innerWidth;
        drive
          .to(
            ".car-travel",
            { x: () => distance() * 0.17, scale: 0.93, duration: 0.55 },
            0,
          )
          .to(
            ".car-travel",
            {
              x: () => distance() * 0.87,
              scale: 0.82,
              duration: 0.45,
              ease: "power1.in",
            },
            0.55,
          )
          .to(
            ".scene-sun",
            { x: () => -distance() * 0.24, scale: 0.7, duration: 1 },
            0,
          )
          .to(
            ".backdrop-type",
            { xPercent: -24, opacity: 0, duration: 0.65 },
            0,
          )
          .to(".road-markings", { x: () => -distance() * 0.5, duration: 1 }, 0)
          .to(".drive-button", { autoAlpha: 0, duration: 0.12 }, 0.06)
          .to(".car-caption", { opacity: 0, y: -12, duration: 0.18 }, 0)
          .fromTo(
            ".destination",
            { opacity: 0, y: 38 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.55,
          )
          .to(".progress-fill", { scaleX: 1, duration: 1 }, 0);
        return () => {
          if (progressText.current) progressText.current.textContent = "00";
          chapterRefs.current.forEach((button, index) =>
            button?.setAttribute(
              "aria-current",
              index === 0 ? "step" : "false",
            ),
          );
        };
      },
      root,
    );
    return () => media.revert();
  }, [motionPaused]);

  function goToChapter(index: number) {
    if (!runway.current) return;
    const top = runway.current.getBoundingClientRect().top + window.scrollY;
    const distance = runway.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + Math.max(0, distance) * [0, 0.5, 0.99][index],
      behavior: reduced ? "instant" : "smooth",
    });
  }

  return (
    <main
      ref={root}
      className={`experience ${night ? "night" : ""} ${reduced ? "motion-reduced" : ""}`}
    >
      <a href="#story" className="skip-link">
        Skip the animation
      </a>
      <section
        ref={runway}
        id="experience"
        className="runway"
        aria-label="Scroll-driven driving experience"
      >
        <div className="hero-sticky">
          <header className="site-header flex items-center justify-between">
            <a
              href="#experience"
              className="wordmark"
              aria-label="Itzfizz home"
            >
              itzfizz
              <span className="brand-star" aria-hidden="true">
                ✳
              </span>
            </a>
            <nav
              className="desktop-nav flex items-center gap-8"
              aria-label="Main navigation"
            >
              <a className="nav-active" href="#experience">
                The experience
              </a>
              <a href="#story">
                Behind the motion <span aria-hidden="true">↗</span>
              </a>
            </nav>
            <a
              className="header-cta inline-flex items-center gap-4"
              href="https://github.com/akshatXD-hash/ui-herosection"
              target="_blank"
              rel="noopener noreferrer"
            >
              Under the hood <Arrow diagonal />
            </a>
          </header>
          <div className="hero-heading">
            <div className="intro-eyebrow flex items-center justify-between">
              <p className="eyebrow flex items-center gap-2">
                <span className="status-dot" /> A DIGITAL EXPERIENCE. BUILT TO
                MOVE.
              </p>
              <span className="edition eyebrow">MOTION STUDY — 001 / 2026</span>
            </div>
            <h1 aria-label="Welcome Itzfizz" className="hero-title">
              <span aria-hidden="true" className="headline-word">
                {"WELCOME".split("").map((letter, index) => (
                  <span className="headline-letter" key={index}>
                    {letter}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="headline-word title-outline">
                {"ITZFIZZ".split("").map((letter, index) => (
                  <span className="headline-letter" key={index}>
                    {letter}
                  </span>
                ))}
              </span>
              <span className="title-spark" aria-hidden="true">
                ✳
              </span>
            </h1>
          </div>
          <div
            className="metrics-grid grid grid-cols-2 md:grid-cols-4"
            aria-label="Illustrative impact metrics from the assignment reference"
          >
            {metrics.map((metric, index) => (
              <div className="metric" key={metric.value}>
                <span className="metric-index">0{index + 1}</span>
                <div className="metric-number">
                  {metric.value}
                  <span>%</span>
                  <span className="metric-arrow" aria-hidden="true">
                    {index % 2 === 0 ? "↗" : "↘"}
                  </span>
                </div>
                <p className="metric-label">{metric.label}</p>
                <p className="metric-note">{metric.note}</p>
              </div>
            ))}
          </div>
          <div className="scene" ref={scene}>
            <div className="scene-topline scene-decoration">
              <span>TIMELESS FORM. FORWARD MOTION.</span>
              <span>EST. IN THE PURSUIT OF BETTER</span>
            </div>
            <div className="scene-sun scene-decoration" aria-hidden="true" />
            <div className="backdrop-type scene-decoration" aria-hidden="true">
              DRIVEN.
            </div>
            <div className="destination" aria-hidden="true">
              <span className="eyebrow">
                A LITTLE FURTHER. A LITTLE BOLDER.
              </span>
              <p>
                Made to
                <br />
                <em>move you.</em>
              </p>
            </div>
            <div className="car-travel">
              <div className="car-entrance">
                <div className="car-shadow" />
                <Image
                  src={`${basePath}/car.webp`}
                  alt="Silver vintage racing coupe with black wheels, a lime accent, and number 07, facing right"
                  width={1991}
                  height={790}
                  preload
                  className="car-image"
                  sizes="(max-width: 600px) 100vw, 65vw"
                />
              </div>
            </div>
            <div className="car-caption scene-decoration">
              <span className="caption-line" />
              <span>
                THE 07 CONCEPT
                <br />
                <strong>Old soul. New energy.</strong>
              </span>
            </div>
            <button
              type="button"
              className="drive-button scene-decoration"
              onClick={() =>
                reduced
                  ? document
                      .getElementById("story")
                      ?.scrollIntoView({ behavior: "instant" })
                  : goToChapter(1)
              }
              aria-label={
                reduced
                  ? "Explore behind the motion"
                  : "Start the drive, scroll to the second chapter"
              }
            >
              <span>
                {reduced ? "EXPLORE" : "SCROLL TO"}
                <br />
                {reduced ? "THE STORY" : "FEEL IT"}
              </span>
              <Arrow />
            </button>
            <div className="road" aria-hidden="true">
              <div className="road-markings" />
            </div>
            <div className="scene-bottomline scene-decoration">
              <span>
                <span className="live-dot" />{" "}
                {reduced ? "TAKE IT AT YOUR PACE" : "YOUR SCROLL. YOUR PACE."}
              </span>
              <div className="theme-control" aria-label="Scene appearance">
                <button
                  type="button"
                  aria-label="Day scene"
                  aria-pressed={!night}
                  onClick={() => setNight(false)}
                >
                  DAY
                </button>
                <span>/</span>
                <button
                  type="button"
                  aria-label="Night scene"
                  aria-pressed={night}
                  onClick={() => setNight(true)}
                >
                  NIGHT
                </button>
              </div>
            </div>
          </div>
          <div className="journey-bar">
            <div className="chapter-controls" aria-label="Animation chapters">
              {chapters.map((chapter, index) => (
                <button
                  type="button"
                  key={chapter}
                  ref={(element) => {
                    chapterRefs.current[index] = element;
                  }}
                  aria-current={index === 0 ? "step" : "false"}
                  disabled={reduced}
                  onClick={() => goToChapter(index)}
                >
                  <span>0{index + 1}</span>
                  {chapter}
                </button>
              ))}
            </div>
            <div className="journey-progress" aria-hidden="true">
              <div className="progress-track">
                <div className="progress-fill" />
              </div>
              <span>
                <span ref={progressText}>00</span> / 100
              </span>
            </div>
            <button
              className="motion-toggle"
              type="button"
              aria-pressed={reduced}
              disabled={systemReduced}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "instant" });
                setMotionPaused(!motionPaused);
              }}
            >
              <span aria-hidden="true">{reduced ? "▷" : "Ⅱ"}</span>{" "}
              {reduced ? "Motion off" : "Pause motion"}
            </button>
          </div>
        </div>
      </section>
      <section id="story" className="story-section">
        <div className="story-top flex items-center justify-between">
          <p className="eyebrow">02 / BEHIND THE MOTION</p>
          <span className="story-star" aria-hidden="true">
            ✳
          </span>
        </div>
        <div className="story-grid">
          <h2>
            Good design
            <br />
            doesn’t <span>stand still.</span>
          </h2>
          <div className="story-copy">
            <p>
              A familiar silhouette. An unexpected journey. A small exploration
              of what happens when thoughtful design meets a little momentum.
            </p>
            <p>
              Every movement follows your lead. Scroll forward, drift back, or
              stop for a moment. You’re in the driver’s seat.
            </p>
            <button
              type="button"
              className="replay-button"
              onClick={() => goToChapter(0)}
            >
              Take it for another spin <Arrow diagonal />
            </button>
          </div>
        </div>
        <div className="principles grid grid-cols-1 md:grid-cols-3">
          <div>
            <span className="eyebrow">01 — INTENTION</span>
            <h3>Nothing moves by accident.</h3>
            <p>
              A quiet entrance. A measured pace. Each detail gives the next one
              room to breathe.
            </p>
          </div>
          <div>
            <span className="eyebrow">02 — CONNECTION</span>
            <h3>You set the rhythm.</h3>
            <p>
              One continuous journey, connected to your scroll. Always fluid.
              Always reversible.
            </p>
          </div>
          <div>
            <span className="eyebrow">03 — CONSIDERATION</span>
            <h3>A good ride, for everyone.</h3>
            <p>
              Made for small screens, keyboard explorers, and those who prefer a
              little less motion.
            </p>
          </div>
        </div>
        <div className="project-note">
          <span className="status-dot" />
          <p>
            An independent frontend motion study. Statistics are illustrative
            values from the assignment reference, not measured business results.
          </p>
        </div>
      </section>
      <footer className="site-footer flex items-center justify-between">
        <a
          href="#experience"
          className="wordmark"
          aria-label="Itzfizz, back to top"
        >
          itzfizz
          <span className="brand-star" aria-hidden="true">
            ✳
          </span>
        </a>
        <p>DESIGN IN MOTION. © 2026</p>
        <a
          href="https://github.com/akshatXD-hash/ui-herosection"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the source <Arrow diagonal />
        </a>
      </footer>
    </main>
  );
}
