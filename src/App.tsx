import { useCallback, useEffect, useState } from "react";

const Direction = {
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
} as const;

const LightColor = {
  RED: "red",
  YELLOW: "yellow",
  GREEN: "green",
} as const;

interface TrafficLight {
  direction: (typeof Direction)[keyof typeof Direction];
  color: (typeof LightColor)[keyof typeof LightColor];
  greenDuration: number;
}

export const App: React.FC = () => {
  const YELLOW_DURATION = 1000;
  const DEFAULT_GREEN_DURATION = 5000;

  const [lights, setLights] = useState<TrafficLight[]>([
    {
      direction: Direction.NORTH,
      color: LightColor.RED,
      greenDuration: DEFAULT_GREEN_DURATION,
    },
    {
      direction: Direction.EAST,
      color: LightColor.RED,
      greenDuration: DEFAULT_GREEN_DURATION,
    },
    {
      direction: Direction.SOUTH,
      color: LightColor.RED,
      greenDuration: DEFAULT_GREEN_DURATION,
    },
    {
      direction: Direction.WEST,
      color: LightColor.RED,
      greenDuration: DEFAULT_GREEN_DURATION,
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

  const handleGreenDurationChange = (
    direction: (typeof Direction)[keyof typeof Direction],
    value: string
  ) => {
    const duration = Math.max(1000, parseInt(value) * 1000);
    setLights((prevLights) =>
      prevLights.map((light) =>
        light.direction === direction
          ? { ...light, greenDuration: duration }
          : light
      )
    );
  };

  const updateLights = useCallback(() => {
    setLights((prevLights) =>
      prevLights.map((light, index) => ({
        ...light,
        color:
          index === currentIndex
            ? isYellow
              ? LightColor.YELLOW
              : LightColor.GREEN
            : LightColor.RED,
      }))
    );
  }, [currentIndex, isYellow]);

  const getGreenDuration = useCallback(
    (currentIndex: number) => lights[currentIndex].greenDuration,
    [lights]
  );

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
      }, getGreenDuration(currentIndex));
    }

    updateLights();
    return () => clearTimeout(timer);
  }, [isRunning, currentIndex, isYellow]);

  const getClassNameFromLightColor = (
    color: (typeof LightColor)[keyof typeof LightColor]
  ) => {
    return color === LightColor.RED
      ? "bg-red-500"
      : color === LightColor.YELLOW
      ? "bg-yellow-500"
      : "bg-green-500";
  };

  return (
    <div className="h-screen p-6 mx-auto lg:p-20">
      <div className="grid grid-cols-3 border border-black grid-row-3 *:border *:border-black *:w-full *:h-20 md:*:h-28 lg:*:h-36">
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.NORTH]].color
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.WEST]].color
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.EAST]].color
          )}
        />
        <div />
        <div
          className={getClassNameFromLightColor(
            lights[directionToIndexMap[Direction.SOUTH]].color
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
      <div className="flex flex-col items-center justify-center mt-12 gap-y-2">
        Change green light duration (in seconds) for:
        <div className="flex items-center gap-x-2">
          {Object.values(Direction).map((direction, idx) => (
            <div key={direction} className="flex items-center">
              <span>{direction}</span>
              <input
                type="number"
                value={getGreenDuration(idx) / 1000}
                onChange={(e) =>
                  handleGreenDurationChange(direction, e.target.value)
                }
                className="w-16 h-8 ml-2 border border-black rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
