import { useEffect, useRef, useState } from "react";

/**
 * Whether content should skip the reveal animation entirely.
 * Evaluated once, up front, so the effect never has to set state synchronously.
 */
function shouldRevealImmediately() {
  if (typeof window === "undefined") return true;
  if (!window.IntersectionObserver) return true;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

/**
 * Fades content in the first time it scrolls into view.
 *
 * Deliberately dependency-free: IntersectionObserver plus a CSS class, so it
 * costs nothing in bundle size. Content is never permanently hidden - if
 * IntersectionObserver is unavailable, or the visitor prefers reduced motion,
 * the children render visible straight away.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(shouldRevealImmediately);

  useEffect(() => {
    if (visible) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
