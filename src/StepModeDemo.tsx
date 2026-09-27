import { AbsoluteFill, Sequence } from "remotion";
import { Hook } from "./scenes/Hook";
import { Features } from "./scenes/Features";
import { CTA } from "./scenes/CTA";
import { theme } from "./theme";

export const StepModeDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={60}>
        <Hook />
      </Sequence>
      <Sequence from={60} durationInFrames={420}>
        <Features />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
