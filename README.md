# Traffic Crossing Lights Simulator

## Setup
- Clone the repository
- Install the dependencies - `npm install`
- Run the app - `npm run dev`
- Open `localhost:5173` in the browser to see the app.

## Overview
The architecture is pretty straight forward. The only dependency is tailwindcss which I find faster to write CSS with. The template uses vite as the build tool along with React + Typescript.


## How it works
We have an array of objects containing information on each light(direction, color, duration of green light). When clicking start simulation sets a variabled called `isRunning` as true which sets the `useEffect` in motion. 

We do a few things in the `useEffect`. First we return early if simulation is not running. Next we check if a state called `isYellow` is true. If yes, we set a timeout to change it false after the duration of yellow light(1 sec). We also set the current index of the light to be +1. If it's false, we set a timeout to turn `isYellow` to true after the duration of green light for each individual light object.

Next we call the `updateLights` method, which based on the `currentIndex` and `isYellow` states, sets the color of the current light object from one of `RED`, `YELLOW`, `GREEN`.
