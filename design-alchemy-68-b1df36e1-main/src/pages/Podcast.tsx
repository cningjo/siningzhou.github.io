import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import svgPaths from "@/imports/svg-paths";

// Media is committed in the repo at podcast/media/ and served by GitHub Pages.
const videoUrl = "/podcast/media/sining-podcast.mp4";
const previewUrl = "/podcast/media/podcast-opening.jpg";

const episodeTitle = "Are you ReDI to dive Deep with Sining?";

export default function Podcast() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "The Portfolio of Sining Zhou — Podcast";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <main className="podcast-page bg-background text-foreground">
      <div className="podcast-layout">
        <header className="podcast-identity">
          <div className="podcast-logo-frame">
            <img src={logo} alt="Sining Zhou" className="podcast-logo" />
          </div>
          <h1 className="podcast-name">The Portfolio<br />of Sining Zhou</h1>
        </header>

        <article className="podcast-episode">
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <Button variant="ghost" className="podcast-episode-trigger" aria-label={`Play ${episodeTitle}`}>
                <span className="podcast-preview">
                  <img src={previewUrl} alt="Blue preview of the podcast video" />
                  <span className="podcast-play"><Play aria-hidden="true" /></span>
                </span>
                <span className="podcast-headline">Are you <em>ReDI</em> to dive <em>Deep</em> with Sining?</span>
              </Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="podcast-video-overlay" />
              <DialogPrimitive.Content className="podcast-video-modal" aria-describedby={undefined}>
                <div className="podcast-video-header">
                  <DialogPrimitive.Title className="podcast-video-title">{episodeTitle}</DialogPrimitive.Title>
                  <DialogPrimitive.Close asChild>
                    <Button variant="ghost" size="icon" className="podcast-video-close" aria-label="Close video" title="Close video">
                      <X aria-hidden="true" />
                    </Button>
                  </DialogPrimitive.Close>
                </div>
                <video className="podcast-player" poster={previewUrl} controls autoPlay playsInline preload="metadata">
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>

          <p className="podcast-description">
            Step inside this AI-generated podcast spotlight created for the Google DeepMind ReDI team.
            Discover how Sining Zhou’s GoodRx product leadership, $100k Columbia University research grant,
            and ”master hobbyist” energy combine to make her a mission-driven powerhouse for frontier
            AI safety and ethics.
          </p>
          <p className="podcast-meta">YOUR VIEW ONLY <span aria-hidden="true">·</span> 6 MIN</p>
          <svg className="podcast-brush" viewBox="0 0 266 7" preserveAspectRatio="none" aria-hidden="true">
            <path d={svgPaths.p14d35f00} fill="currentColor" />
          </svg>
        </article>
      </div>
    </main>
  );
}
