"use client";
import React, { ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const borderOpacity = 5 + i * 5;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";

        return (
          <motion.div
            key={i}
            className="absolute rounded-full border bg-white/20"
            initial={{
              width: size,
              height: size,
              opacity: 0,
              x: "-50%",
              y: "-50%",
              scale: 0.8,
            }}
            animate={{
              opacity: opacity,
              scale: 1.1,
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              opacity: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeOut",
                delay: i * 0.2,
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                type: "spring",
                stiffness: 20,
                damping: 10,
                delay: i * 0.2,
              },
            }}
            style={{
              borderStyle,
              borderWidth: "1px",
              borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
              top: "50%",
              left: "50%",
              boxShadow: `0 0 ${i * 4}px rgba(255, 255, 255, 0.1)`,
            }}
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
