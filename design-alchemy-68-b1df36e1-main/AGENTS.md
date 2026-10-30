# Architecture

- Keep the podcast experience on `/podcast` and preserve the portfolio homepage so the new experience is independently accessible.
- Use CDN asset pointers for uploaded podcast media and fonts to keep binary files out of the repository.
- Use the existing Radix dialog primitives and design-system Button for podcast playback so focus trapping, Escape dismissal, and focus restoration remain accessible.