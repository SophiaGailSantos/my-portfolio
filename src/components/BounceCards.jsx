import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./BounceCards.css";

export default function BounceCards({
  className = "",
  items = [],
  renderCard,
  containerWidth = "100%",
  containerHeight = 430,
  animationDelay = 0.25,
  animationStagger = 0.12,
  easeType = "elastic.out(1, 0.75)",
  transformStyles = [
    "rotate(-7deg) translate(-330px)",
    "rotate(0deg)",
    "rotate(7deg) translate(330px)",
  ],
  enableHover = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bounce-card",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType]);

  const getNoRotationTransform = (transformStr) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);

    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    }

    if (transformStr === "none") {
      return "rotate(0deg)";
    }

    return `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);

    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    }

    return baseTransform === "none"
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    items.forEach((_, index) => {
      const target = q(`.bounce-card-${index}`);
      const baseTransform = transformStyles[index] || "none";

      gsap.killTweensOf(target);

      if (index === hoveredIdx) {
        gsap.to(target, {
          transform: getNoRotationTransform(baseTransform),
          zIndex: items.length + 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = index < hoveredIdx ? -85 : 85;

        gsap.to(target, {
          transform: getPushedTransform(baseTransform, offsetX),
          zIndex: index + 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay: Math.abs(hoveredIdx - index) * 0.05,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    items.forEach((_, index) => {
      const target = q(`.bounce-card-${index}`);
      const baseTransform = transformStyles[index] || "none";

      gsap.killTweensOf(target);
      gsap.to(target, {
        transform: baseTransform,
        zIndex: index + 1,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      className={`bounce-cards-container ${className}`}
      ref={containerRef}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.title ?? index}
          className={`bounce-card bounce-card-${index}`}
          style={{
            transform: transformStyles[index] ?? "none",
            zIndex: index + 1,
          }}
          onMouseEnter={() => pushSiblings(index)}
          onMouseLeave={resetSiblings}
          onFocus={() => pushSiblings(index)}
          onBlur={resetSiblings}
        >
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
}
