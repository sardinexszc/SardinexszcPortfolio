import { Composition } from "remotion";
import { Showcase } from "./Showcase";

// 21s of scenes minus 2.1s of transition overlap = 18.9s.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PortfolioShowcase" component={Showcase} durationInFrames={567} fps={30} width={1920} height={1080} />
    </>
  );
};
