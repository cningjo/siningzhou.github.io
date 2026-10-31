import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import svgPaths from "@/imports/svg-paths";
import imgLogo from "@/assets/logo.png";
import AboutModal from "@/components/AboutModal";

function LoadingSpinner() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={imgLogo}
        alt="Loading"
        className="w-[clamp(4rem,10vw,8rem)] h-[clamp(4rem,10vw,8rem)]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

function Content() {
  return (
    <div className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[714px] mx-auto">
      <motion.p
        className="font-serif font-normal leading-normal text-[clamp(2rem,5vw,3.5rem)] text-foreground mb-[clamp(1.5rem,3vw,3rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Hi there, I'm Sining.
      </motion.p>

      <motion.div
        className="font-serif font-normal leading-normal text-[clamp(2rem,5vw,3.5rem)] text-foreground mb-[clamp(2rem,4vw,4rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <span>I'm a </span>
        <span className="relative inline-block">
          <span className="font-serif italic">design leader</span>
          <svg
            className="absolute left-0 -bottom-2 w-full h-[clamp(8px,1.5vw,13px)]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 308 20"
          >
            <motion.path
              d={svgPaths.p29357100}
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
            />
          </svg>
        </span>
        <span> and </span>
        <span className="relative inline-block whitespace-nowrap">
          <span className="font-serif italic">researcher</span>
          <svg
            className="absolute left-0 -bottom-2 w-full h-[clamp(7px,1.3vw,11px)]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 241 11"
          >
            <motion.path
              d={svgPaths.p7f5af00}
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 2.5, ease: "easeInOut" }}
            />
          </svg>
          <span>,</span>
        </span>
        <span>
          {" "}
          passionate about working at the intersection of healthcare and
          technology.{" "}
        </span>
      </motion.div>

      <motion.p
        className="font-serif font-normal leading-normal text-[clamp(1.125rem,2.5vw,2.25rem)] text-foreground whitespace-pre-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <span>
          You can also find me tinkering on a new hobby, hanging out with my{" "}
        </span>
        <span className="relative inline-block whitespace-nowrap">
          <span className="font-serif italic">rescue pup</span>
          <svg
            className="absolute left-0 -bottom-2 w-full h-[clamp(4px,0.8vw,6px)] scale-y-[-100%]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 158 6"
          >
            <motion.path
              d={svgPaths.p1cc2b00}
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 4.2, ease: "easeInOut" }}
            />
          </svg>
          <span>,</span>
        </span>
        <span> and writing </span>
        <span className="relative inline-block">
          <span className="font-serif italic">unfiltered vignettes</span>
          <svg
            className="absolute left-0 -bottom-2 w-full h-[clamp(4px,0.9vw,7px)]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 266 7"
          >
            <motion.path
              d={svgPaths.p14d35f00}
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 5.9, ease: "easeInOut" }}
            />
          </svg>
        </span>
        <span>. </span>
      </motion.p>
    </div>
  );
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background min-h-screen w-full overflow-x-hidden relative font-serif">
      <AnimatePresence>{isLoading && <LoadingSpinner />}</AnimatePresence>
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {!isLoading && (
        <>
          {/* Top Left - Logo */}
          <motion.a
            href="#home"
            className="fixed top-[clamp(1.5rem,3vw,2rem)] left-[clamp(1.5rem,4vw,3.688rem)] z-10 hover:opacity-60 transition-opacity"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              alt="Sining Zhou Logo"
              className="w-[clamp(2.5rem,5vw,3.625rem)] h-[clamp(2.5rem,5vw,3.938rem)] object-contain"
              src={imgLogo}
            />
          </motion.a>

          {/* Top Right - About */}
          <motion.button
            onClick={() => setAboutOpen(true)}
            className="fixed top-[clamp(1.5rem,3vw,2.25rem)] right-[clamp(1.5rem,4vw,3.688rem)] font-serif font-normal leading-normal text-[clamp(1.25rem,2vw,2rem)] text-foreground hover:opacity-60 transition-opacity z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            [ About ]
          </motion.button>

          {/* Bottom Left - Work */}
          <motion.a
            href="#work"
            className="fixed bottom-[clamp(1.5rem,3vw,2.313rem)] left-[clamp(1.5rem,4vw,3.688rem)] font-serif font-normal leading-normal text-[clamp(1.25rem,2vw,2rem)] text-foreground hover:opacity-60 transition-opacity z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            [ Work ]
          </motion.a>

          {/* Bottom Right - Contact */}
          <motion.a
            href="#contact"
            className="fixed bottom-[clamp(1.5rem,3vw,2.313rem)] right-[clamp(1.5rem,4vw,3.688rem)] font-serif font-normal leading-normal text-[clamp(1.25rem,2vw,2rem)] text-foreground hover:opacity-60 transition-opacity z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            [ Contact ]
          </motion.a>

          {/* Main Content - Centered */}
          <div className="flex items-center justify-center min-h-screen py-[clamp(6rem,12vw,12rem)] px-4">
            <Content />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
