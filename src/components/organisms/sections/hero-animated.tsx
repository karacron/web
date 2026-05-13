"use client";

import { motion } from "framer-motion";
import { FaApple, FaDocker, FaLinux, FaWindows } from "react-icons/fa";

const PLATFORM_ICONS = [
  { name: "Windows", Icon: FaWindows },
  { name: "iOS", Icon: FaApple },
  { name: "Linux", Icon: FaLinux },
  { name: "Docker", Icon: FaDocker },
] as const;

const WAITLIST_MAILTO = "mailto:sgonzalez@authuser.org?subject=Kara%20waitlist";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface HeroAnimatedProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  availableLabel: string;
}

export function HeroAnimated({
  badge,
  title,
  subtitle,
  primaryLabel,
  availableLabel,
}: HeroAnimatedProps) {
  return (
    <motion.div
      className="text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Badge */}
      <motion.div
        variants={fadeIn}
        className="hidden sm:mb-8 sm:flex sm:justify-center"
      >
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
          {badge}
        </div>
      </motion.div>

      {/* Título — letra a letra */}
      <motion.h1
        variants={fadeUp}
        className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
      >
        {title}
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        variants={fadeUp}
        className="mt-8 text-base font-medium text-pretty text-gray-400 sm:text-xl/8"
      >
        {subtitle}
      </motion.p>

      {/* Plataformas */}
      <motion.div
        variants={fadeUp}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
      >
        <span className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
          {availableLabel}
        </span>
        <div className="flex items-center gap-3">
          {PLATFORM_ICONS.map((platform, i) => (
            <motion.span
              key={platform.name}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6 + i * 0.08,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
              title={platform.name}
              aria-label={platform.name}
            >
              <platform.Icon className="h-4 w-4 text-white" />
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex items-center justify-center gap-x-6"
      >
        <a
          href={WAITLIST_MAILTO}
          className="rounded-md bg-indigo-500 px-8 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {primaryLabel}
        </a>
      </motion.div>
    </motion.div>
  );
}
