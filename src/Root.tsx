import "./index.css";
import { Composition } from "remotion";
import { StepModeDemo } from "./StepModeDemo";
import { ProblemSolution } from "./concepts/ProblemSolution";
import { DayInLife } from "./concepts/DayInLife";
import { AICoachPOV } from "./concepts/AICoachPOV";
import { SpeedRun } from "./concepts/SpeedRun";
import { BeforeAfter } from "./concepts/BeforeAfter";
import { AllInOne } from "./concepts/AllInOne";
import { RunReplay3D } from "./replay/RunReplay3D";
import { replayVideoSchema, calculateReplayMetadata } from "./replay/schema";
import { sampleRoute, sampleStats } from "./replay/sampleRoute";

const SHARED = {
  durationInFrames: 600,
  fps: 30,
  width: 1080,
  height: 1920,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="0-FeaturesCarousel" component={StepModeDemo} {...SHARED} />
      <Composition id="1-ProblemSolution" component={ProblemSolution} {...SHARED} />
      <Composition id="2-DayInLife" component={DayInLife} {...SHARED} />
      <Composition id="3-AICoachPOV" component={AICoachPOV} {...SHARED} />
      <Composition id="4-SpeedRun" component={SpeedRun} {...SHARED} />
      <Composition id="5-BeforeAfter" component={BeforeAfter} {...SHARED} />
      <Composition id="6-AllInOne" component={AllInOne} {...SHARED} />
      <Composition
        id="RunReplay3D"
        component={RunReplay3D}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={900}
        schema={replayVideoSchema}
        calculateMetadata={calculateReplayMetadata}
        defaultProps={{
          route: sampleRoute,
          stats: sampleStats,
          mapboxToken: process.env.REMOTION_MAPBOX_TOKEN ?? "",
        }}
      />
    </>
  );
};
