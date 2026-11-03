import { Composition } from "remotion";
import { Showcase } from "./Showcase";

// 18s of scenes minus 1.6s of transition overlap = 16.4s.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PortfolioShowcase" component={Showcase} durationInFrames={492} fps={30} width={1920} height={1080} />
    </>
  );
};
