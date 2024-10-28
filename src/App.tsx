import { useCallback, useEffect, useState } from "react";

const Direction = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west",
} as const;

const LightColor = {
  RED: "red",
  YELLOW: "yellow",
  GREEN: "green",
} as const;

interface TrafficLight {
  direction: (typeof Direction)[keyof typeof Direction];
  state: (typeof LightColor)[keyof typeof LightColor];
}

export const App: React.FC = () => {
  const YELLOW_DURATION = 1000;
  const [greenDuration, setGreenDuration] = useState(5000);

  const [lights, setLights] = useState<TrafficLight[]>([
    {
      direction: Direction.NORTH,
      state: LightColor.RED,
    },
    {
      direction: Direction.EAST,
      state: LightColor.RED,
    },
    {
      direction: Direction.SOUTH,
      state: LightColor.RED,
    },
    {
      direction: Direction.WEST,
      state: LightColor.RED,
    },
  ]);

  const directionToIndexMap = {
    [Direction.NORTH]: 0,
    [Direction.EAST]: 1,
    [Direction.SOUTH]: 2,
    [Direction.WEST]: 3,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isYellow, setIsYellow] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleGreenDurationChange = (value: string) => {
    setGreenDuration(Math.max(1000, parseInt(value) * 1000));
  };

  const updateLights = useCallback(() => {
    setLights((prevLights) =>
      prevLights.map((light, index) => ({
        ...light,
        state:
          index === currentIndex
            ? isYellow
              ? LightColor.YELLOW
              : LightColor.GREEN
            : LightColor.RED,
      }))
    );
  }, [currentIndex, isYellow]);

  useEffect(() => {
    if (!isRunning) return;

    let timer: ReturnType<typeof setTimeout>;

    if (isYellow) {
      timer = setTimeout(() => {
        setIsYellow(false);
        setCurrentIndex((prev) => (prev + 1) % lights.length);
      }, YELLOW_DURATION);
    } else {
      timer = setTimeout(() => {
        setIsYellow(true);
      }, greenDuration);
    }

    updateLights();
    return () => clearTimeout(timer);
  }, [isRunning, greenDuration, currentIndex, isYellow]);

  const getClassNameFromLightColor = (
    color: (typeof LightColor)[keyof typeof LightColor]
  ) => {
    return color === LightColor.RED
      ? "bg-red-500"
      : color === LightColor.YELLOW
      ? "bg-orange-300"
      : "bg-green-500";
  };

  return (
    <div className="h-screen p-6 mx-auto lg:p-20">
      <div className="grid grid-cols-3 border border-black grid-row-3 *:border *:border-black *:w-full *:h-20 md:*:h-28 lg:*:h-36">
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.NORTH]].state
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.WEST]].state
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.EAST]].state
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.SOUTH]].state
          )}
        />
        <div />
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className="p-4 text-white bg-black rounded-lg"
        >
          {isRunning ? "Stop" : "Start"} simulation
        </button>
      </div>
      <div className="flex items-center justify-center mt-12">
          Change green light duration (in seconds):
          <input
            type="number"
            value={greenDuration / 1000}
            onChange={(e) => handleGreenDurationChange(e.target.value)}
            className="w-16 h-8 ml-2 border border-black rounded-lg"
            />
      </div>
    </div>
  );
};
