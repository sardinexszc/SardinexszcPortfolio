import { Composition } from "remotion";
import { Showcase } from "./Showcase";
import { Walkthrough } from "./Walkthrough";
import { EmailAgent } from "./EmailAgent";
import { Carwash } from "./Carwash";
import { Edw } from "./Edw";
import { Tcehub } from "./Tcehub";
import { Crrdc } from "./Crrdc";
import { Reel, REEL_FRAMES } from "./Reel";
import { ShortReel, SHORT_FRAMES } from "./ShortReel";

// 18s of scenes minus 1.6s of transition overlap = 16.4s.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PortfolioShowcase" component={Showcase} durationInFrames={492} fps={30} width={1920} height={1080} />
      {/* Phone version: same scenes, laid out for a portrait 9:16 frame. */}
      <Composition id="PortfolioShowcaseMobile" component={Showcase} durationInFrames={492} fps={30} width={1080} height={1920} />
      {/* 40s job-application walkthrough with voice-over: site + admin dashboard. */}
      <Composition id="PortfolioWalkthrough" component={Walkthrough} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* 40s walkthrough of the n8n Email summary agent v2. */}
      <Composition id="EmailAgentWalkthrough" component={EmailAgent} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* 40s demo of carwash-booking (n8n + Google Forms/Sheets + Telegram). */}
      <Composition id="CarwashWalkthrough" component={Carwash} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* 40s walkthrough of DRIW, the disaster-response data warehouse (IT271 EDW project). */}
      <Composition id="EdwWalkthrough" component={Edw} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* 40s walkthrough of TCEHub, marked as in development throughout. */}
      <Composition id="TcehubWalkthrough" component={Tcehub} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* 40s walkthrough of the CRRDC information system; personal data blurred. */}
      <Composition id="CrrdcWalkthrough" component={Crrdc} durationInFrames={1200} fps={30} width={1920} height={1080} />
      {/* All six project walkthroughs in one reel, after a 3s intro card. */}
      <Composition id="ProjectsReel" component={Reel} durationInFrames={REEL_FRAMES} fps={30} width={1920} height={1080} />
      {/* ~70s cut of all six projects, for applications; same scenes laid out for 9:16 below. */}
      <Composition id="ShortReel" component={ShortReel} durationInFrames={SHORT_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="ShortReelVertical" component={ShortReel} durationInFrames={SHORT_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
