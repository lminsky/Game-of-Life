# Game of Life
Conway's Game of Life implemented in p5.js

This Game of Life is bound by the boarders of the window. A living cell on the edge of the screen cannot have a neighbor beyond the border. The simulation will automatically stop if:

  1. All cells are dead.
  2. The simulation enters a loop (up to 50 cycles long).

The controls are as follows:

  * *Click on a cell* to toggle it between alive and dead
  * Press *Enter* to run the simulation
  * Press **Left** or **Right** to step through the simulation
  * Press **h** to toggle the history display (cells that are dead but were once alive are highlighed in red)
  * Press **o** to toggle the original display (cells that were alive in the initial moment of the simulation are outlined in blue)
  * Press **Up** to display or hide the information box in the bottomright corner
  * Press **Down** to set the current configuration as the start (resets the "original" cells to whatever is alive now and loses the ability to step backwards in time)

  [It is available here](https://lminsky.github.io/Game-of-Life/)