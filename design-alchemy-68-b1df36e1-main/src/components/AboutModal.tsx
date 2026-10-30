import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function useIsMobileSheet() {
  const [isSheet, setIsSheet] = useState(window.innerWidth <= 440);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 440px)");
    const onChange = () => setIsSheet(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isSheet;
}

function ModalContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-foreground hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <X className="w-6 h-6" strokeWidth={1.5} />
      </button>

      <div className="px-[clamp(1.5rem,6vw,5rem)] py-[clamp(2rem,6vw,5rem)]">
        <motion.p
          className="font-serif text-[clamp(1rem,1.5vw,1.25rem)] text-muted-foreground mb-[clamp(1.5rem,4vw,4rem)]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          About
        </motion.p>

        <motion.div
          className="font-serif font-normal leading-[1.2] text-[clamp(1.5rem,4vw,3.25rem)] text-foreground mb-[clamp(2rem,5vw,4rem)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <p>
            I'm Sining Zhou — a design leader and researcher passionate about
            working at the intersection of healthcare and technology. I bring
            together user research, systems thinking, and visual craft to
            create meaningful, human-centered experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(2rem,4vw,4rem)] gap-y-[clamp(1.5rem,3vw,3rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <h3 className="font-serif text-[clamp(0.875rem,1.2vw,1rem)] text-muted-foreground mb-3 uppercase tracking-wider">
              Background
            </h3>
            <p className="font-serif text-[clamp(1rem,1.8vw,1.5rem)] leading-relaxed text-foreground">
              With years of experience leading design across healthcare
              products, I've shaped strategy and execution for teams building
              tools that improve patient outcomes and clinician workflows.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <h3 className="font-serif text-[clamp(0.875rem,1.2vw,1rem)] text-muted-foreground mb-3 uppercase tracking-wider">
              Interests
            </h3>
            <p className="font-serif text-[clamp(1rem,1.8vw,1.5rem)] leading-relaxed text-foreground">
              Outside of work, you can find me tinkering on a new hobby,
              hanging out with my rescue pup, and writing unfiltered
              vignettes about life and creativity.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-[clamp(2rem,5vw,4rem)] pt-[clamp(1rem,3vw,2rem)] border-t border-border flex flex-wrap gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <a
            href="https://www.linkedin.com/in/siningzhou"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-[clamp(1rem,1.5vw,1.25rem)] text-foreground hover:opacity-60 transition-opacity"
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:hello@siningzhou.com"
            className="font-serif text-[clamp(1rem,1.5vw,1.25rem)] text-foreground hover:opacity-60 transition-opacity"
          >
            Email ↗
          </a>
        </motion.div>
      </div>
    </>
  );
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const isSheet = useIsMobileSheet();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {isSheet ? (
            /* Mobile: slide-up action sheet */
            <motion.div
              className="relative bg-background w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-[24px]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <ModalContent onClose={onClose} />
            </motion.div>
          ) : (
            /* Desktop: centered modal */
            <motion.div
              className="relative bg-background w-full max-w-[1100px] max-h-[90vh] overflow-y-auto shadow-2xl mx-4 md:mx-8"
              style={{ borderRadius: 48 }}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ModalContent onClose={onClose} />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
