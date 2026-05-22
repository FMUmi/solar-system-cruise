import "./index.css";
import { Composition } from "remotion";
import { SolarCruise } from "./SolarCruise";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SolarCruise"
      component={SolarCruise}
      durationInFrames={510}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
