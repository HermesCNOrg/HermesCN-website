"use client";

import { useEffect, useState } from "react";

type ScrollToTopProps = {
  threshold?: number;
};

export function ScrollToTop({ threshold = 400 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > threshold);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return (
    <button
      aria-label="返回顶部"
      className={[
        "fixed right-5 bottom-5 z-20 grid size-11 place-items-center border-2 border-white bg-[#0000f2] text-xl text-white transition hover:scale-105 sm:right-6 sm:bottom-6",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={isVisible ? 0 : -1}
      type="button"
    >
      <i aria-hidden="true" className="ri-arrow-up-line leading-none" />
    </button>
  );
}
