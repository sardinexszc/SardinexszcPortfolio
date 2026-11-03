import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { Contact, Facts, Glyph, Hero, Work } from "./scenes";
import { color, dotGrid } from "./theme";

const centered = { justifyContent: "center", alignItems: "center" } as const;

// ~19s showcase of the portfolio site: glyph intro, hero, work, facts, and the curtain contact footer.
export const Showcase = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Glyph intro" durationInFrames={5 * fps}>
        <Glyph name="Glyph" style={{ ...dotGrid, ...centered }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="Hero" durationInFrames={4 * fps}>
        <Hero name="Hero" style={dotGrid} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="Work" durationInFrames={5 * fps}>
        <Work name="Work" style={dotGrid} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="Facts" durationInFrames={3 * fps}>
        <Facts name="Facts" style={dotGrid} />
      </TransitionSeries.Sequence>
      {/* The page lifts off the black footer, as on the site. */}
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 0.6 * fps })} />
      <TransitionSeries.Sequence name="Contact" durationInFrames={4 * fps}>
        <Contact name="Contact" style={{ backgroundColor: color.black }} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
