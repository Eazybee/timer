import { FC, useState, useRef, useCallback } from "react";
import Laps from "./components/Laps";
import { formattedSeconds } from "./helper/utils";


type StopwatchProps = {
  initialSeconds: number;
};


const Stopwatch: FC<StopwatchProps> = ({ initialSeconds }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(
    Math.abs(initialSeconds)
  );
  const [laps, setLaps] = useState<number[]>([]);
  const timeRef = useRef<{ rAF: number; previousTime: number }>({
    rAF: 0,
    previousTime: 0,
  });

  const shouldShowReset = !!currentSeconds;

  const updateTime = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - timeRef.current.previousTime;

    if (deltaTime >= 1000) {
      setCurrentSeconds((prev) => prev + Math.floor(deltaTime / 1000));

      timeRef.current.previousTime = now;
    }
    timeRef.current.rAF = requestAnimationFrame(updateTime);
  }, []);

  const handleStartClick = () => {
    cancelAnimationFrame(timeRef.current.rAF);
    timeRef.current.previousTime = performance.now();
    timeRef.current.rAF = requestAnimationFrame(updateTime);
    setIsRunning(true);
  };

  const handleStopClick = () => {
    cancelAnimationFrame(timeRef.current.rAF);
    setIsRunning(false);
  };

  const handleLapClick = () => {
    if (isRunning) {
      setLaps((prevLaps) => [...prevLaps, currentSeconds]);
    }
  };

  const handleResetClick = () => {
    setIsRunning(false);
    setCurrentSeconds(0);
    setLaps([]);
    timeRef.current = {
      rAF: 0,
      previousTime: 0,
    };
  };

  const handleDeleteClick = (index: number) => () => {
    const newlaps = [...laps];
    newlaps.splice(index, 1);
    setLaps(newlaps);
  };

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(currentSeconds)}</h1>

      {!isRunning && (
        <>
          <button
            type="button"
            className="start-btn"
            onClick={handleStartClick}
          >
            start
          </button>

          {shouldShowReset && (
            <button type="button" onClick={handleResetClick}>
              reset
            </button>
          )}
        </>
      )}

      {isRunning && (
        <>
          <button type="button" className="stop-btn" onClick={handleStopClick}>
            stop
          </button>
          <button type="button" onClick={handleLapClick}>
            lap
          </button>
        </>
      )}

      <Laps laps={laps} onDelete={handleDeleteClick} />
    </div>
  );
};

export default Stopwatch;