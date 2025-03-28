import { FC } from "react";
import Lap from "./Lap";

type LapsProps = {
  laps: number[];
  onDelete: (index: number) => () => void;
};


const Laps: FC<LapsProps> = ({ laps, onDelete }) => {
  if (!laps.length) {
    return <></>;
  }

  return (
    <div className="stopwatch-laps">
      {laps.map((lap, i) => (
        <Lap key={lap + i} index={i + 1} lap={lap} onDelete={onDelete(i)} />
      ))}
    </div>
  );
};

export default Laps;