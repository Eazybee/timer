import { FC } from "react";
import { formattedSeconds } from "../helper/utils";

type LapProps = {
  index: number;
  lap: number;
  onDelete: () => void;
};

const Lap: FC<LapProps> = (props) => (
  <div className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={props.onDelete}> X </button>
  </div>
);

export default Lap;
