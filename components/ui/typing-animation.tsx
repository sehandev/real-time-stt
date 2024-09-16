"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type TypingAnimationProps = {
  text: string;
  className?: string;
  duration?: number;
};

export const TypingAnimation = ({
  text,
  className = "",
  duration = 200,
}: TypingAnimationProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    text.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * (duration / 1000),
      ease: "easeInOut",
    });
    return controls.stop;
  }, [text]);

  return <motion.span className={className}>{displayText}</motion.span>;
};