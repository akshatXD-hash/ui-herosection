import gsap from "gsap";

/** Called inside the hero's matchMedia context, so pause/unmount reverts everything. */
export function animateStory(scope: HTMLElement) {
  const select = gsap.utils.selector(scope);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: select(".story-grid")[0],
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      defaults: { duration: 0.9, ease: "power3.out" },
    })
    .from(select(".story-title-line"), {
      yPercent: 110,
      rotate: 2,
      stagger: 0.14,
    })
    .from(select(".story-copy > *"), { opacity: 0, y: 24, stagger: 0.12 }, 0.2);

  gsap.to(select(".story-star"), {
    rotation: 240,
    ease: "none",
    scrollTrigger: {
      trigger: select(".story-section")[0],
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: select(".motion-ribbon")[0],
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
    .fromTo(select(".ribbon-forward"), { xPercent: 0 }, { xPercent: -22 }, 0)
    .fromTo(select(".ribbon-reverse"), { xPercent: -22 }, { xPercent: 0 }, 0);

  // Each card owns a trigger so stacked phone layouts reveal at the right time.
  select(".principle-card").forEach((card) => {
    gsap.from(card, {
      y: 36,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        toggleActions: "play none none reverse",
      },
    });
    const graphic = card.querySelector(".principle-graphic");
    const motion = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom 15%",
        scrub: 0.8,
      },
    });
    if (card.dataset.motion === "orbit") {
      motion.to(graphic?.querySelector(".orbit-arm") ?? [], { rotation: 270 });
    } else if (card.dataset.motion === "flow") {
      motion.fromTo(
        graphic?.querySelectorAll(".flow-arrow") ?? [],
        { x: -18, opacity: 0.3 },
        { x: 18, opacity: 1, stagger: 0.12 },
      );
    } else {
      motion.fromTo(
        graphic?.querySelectorAll(".balance-bar") ?? [],
        { scaleX: 0.25 },
        { scaleX: 1, stagger: 0.15 },
      );
    }
  });

  gsap.from(select(".principles-rule"), {
    scaleX: 0,
    transformOrigin: "left",
    ease: "none",
    scrollTrigger: {
      trigger: select(".principles")[0],
      start: "top 95%",
      end: "top 55%",
      scrub: 0.6,
    },
  });
}
