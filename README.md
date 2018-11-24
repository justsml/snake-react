# Dan's Snake Refactor

## Exploring State Management Designs

Many factors could influence the design...

1. Store a rewindable/replayable stack of EVERY cell change or move (redux-ish)
   1. Could simplify logic around 1UPs, enemies (certain cases)
1. Save only list of key presses with each's coords: might save overall memory, speed.
   1. Better for a websockets multi-player variant

[**View & Edit Live on Codesandbox**](https://codesandbox.io/s/n363vo61mj?module=%2Fsrc%2FApp.js)

# [Source: Coding Garden Live!](https://github.com/CodingGarden/snake-react)
