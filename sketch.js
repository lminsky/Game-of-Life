var squareSize = 20;    //The width and height of an individual cell
var run;                //A boolean to allow the simulation to proceed or not
var speed = 5;          //The starting frame rate
var oneStep = false;    //A boolean to allow the simulation to proceed one step
var showKey = true;     //A boolean to show or hide the key in the bottom right hand corner
var livingCells;   //A count of how many living cells there are at any given time
var life = [];          //An array to store every moment of the simulation (3D)
var loopSize = false;   //Is false if not in a loop. Becomes an int if there is a loop
var showOrig = false;   //A boolean to show or hide indicators for where the simulation started
var showHist = false;   //A boolean to show or hide indicators for where cells were once alive
var onScreen;           //Stores the number of cells visible on the screen at any given time

function setup() {
  createCanvas(windowWidth, windowHeight);  //Create the canvas
  setupGrid();                              //Do all the housekeeping to get the game started
  frameRate(speed);                         //Set the frame rate to the default value
}

function draw() {
  background(255);                          //Draw a white background
  displayGrid();                            //Draw every cell
  
  if(showKey)                               //If the showKey variable is true...
    displayKey();                             //show the key in the bottom right hand corner

  if(oneStep)                               //If the oneStep variable is true...
    run = true;                               //set the run variable to true

  if(run) {                                 //If the run variable is true...
    checkGrid();                              //evaluate the current grid and prepare the next moment
  }

  if(oneStep) {                             //If the oneStep variable is true...
    run = false;                              //set the run variable to false
    oneStep = false;                          //set the oneStep variable to false
  }
}

//Displays the key in the bottom right hand corner
function displayKey() {
  stroke(0);
  fill(230);
  rect(width - 200, height - 100, 180, 80);
  textSize(9);
  var status;
  if(run) {                                         //If the simulation is running...
    noStroke();
    fill(0, 180, 0); 
    ellipse(width - 185, height - 85, 10, 10);        //draws a circle
    fill(0);
    status = "Running (press enter to stop)";         //and writes that it is running
  } else {                                          //if the simulation is stopped...
    noStroke();
    fill(180, 0, 0);
    rect(width - 190, height - 90, 10, 10);           //draws a square
    fill(0);
    status = "Stopped (press enter to run)"           //and writes that it is stopped
  }
  text(status, width - 175, height - 82);
  text("Cycle " + life.length, width - 190, height - 65);   //Writes what number cycle the simulation is in
  if(loopSize != false) {                             //If the simulation is in a loop...
    run = false;
    fill(180, 0, 0);
    text("In a " + (loopSize) + " cycle loop", width - 130, height - 65);  //write the size of the loop
    fill(0);
  }
  text(livingCells[life.length - 1] + " Living Cells", width - 190, height - 48);    //Writes the number of living cells there are
  if(life.length > 1) {
    var difference = livingCells[life.length-1] - livingCells[life.length - 2];
    if(difference > 0) {
      fill(0, 180, 0);
      difference = "+" + difference;
    } else if(difference < 0) {
      fill(180, 0, 0);
    }
    text(difference, width - 120, height - 48);
    fill(0);
  }
  text("Use the left and right arrow keys to step", width - 190, height - 31);    //gives some instructions
}

//Used to initialize the grid back to empty
function setupGrid() {
  run = false;          //set run to false
  loopSize = false;     //set loopSize to false
  life = [];            //empty the life array
  livingCells = [];    //initialize the living cell array to empty
  livingCells[0] = 0;
  var grid = [];        //create a grid array
  createArray(grid);    //populate the grid array
  life.push(grid);      //push the grid array into the life array
}

//pushes values into the array parameter until it is the appropriate size for the window
function createArray(a) {
  for(var x = 0; x < 3 * width/squareSize; x++) {     //Creates a grid 9x the size of the window
    var temp = [];
    for(var y = 0; y < 3 * height/squareSize; y++) {
      temp.push(0);
    }
    a.push(temp);
  }
  onScreen = {                                        //Stores the number of cells visible
    x: Math.ceil(width/squareSize),
    y: Math.ceil(height/squareSize)
  }
}


function displayGrid() {
  for(var x = 0; x < life[life.length-1].length; x++) {           //Loop through the current grid
    for(var y = 0; y < life[life.length-1][x].length; y++) {
      if(life[0][x][y] == 1 && showOrig) {                        //If showOrig is true, highlight the starter cells in blue
        stroke(0, 0, 100);
        strokeWeight(2);
      } else {
        stroke(128);
        strokeWeight(1);
      }
      if(life[life.length-1][x][y] == 0) {                        //If the current cell is dead, make it white
        fill(255);
      } else if(life[life.length-1][x][y] == 1) {                 //if the current cell is alive, make it green and increase count                              //make it green if the showHist flag is set
          fill(0, 100, 0);
      } else {
        if(showHist) {                                            //if it was ever alive make it green (if the showHist flag is set)
          fill(200, 0, 0, 30);
         } else {
          fill(255);
         }
      }
      rect(x * squareSize - onScreen.x * squareSize, y * squareSize - onScreen.y * squareSize, squareSize, squareSize);   //draw the cells (offset by the size of the window)
      strokeWeight(1);
    }
  }
}

//loop through the grid and apply conway's rules to each cell
function checkGrid() {
  var tempArray = [];
  createArray(tempArray);

  for(var x = 0; x < life[life.length-1].length; x++) {
    for(var y = 0; y < life[life.length-1][x].length; y++) {
      conway(x, y, tempArray);
    }
  }
  life.push(tempArray);
  livingCells[life.length - 1] = countCells(life.length - 1);
  loopSize = checkStatic();                                     //after creating the new grid, check to see if you're looping
}

function countCells(t) {
  var count = 0;
  for(var x = 0; x < life[t].length; x++) {
    for(var y = 0; y < life[t][x].length; y++) {
      if(life[t][x][y] == 1) {
        count++;
      }
    }
  }
  return count;
}

//loop through all the old grids to see if you're repeating
//if you are, return the number of cycles it takes to loop
function checkStatic() {
  if(life.length > 2) {
    var maxCheck = 50;
    if(life.length < 50)
      maxCheck = life.length;
    for(var t = life.length-2; t > life.length-maxCheck; t--) {
      if(livingCells[t] == livingCells[life.length-1]) {
        var different = false
        for(var x = 0; x < life[t].length; x++) {
          for(var y = 0; y < life[t][x].length; y++) {
            if(life[t][x][y] != life[life.length-1][x][y]) {
              different = true;
            }
          }
        }
        if(!different) {
          return life.length - t - 1;
        }
      }
    }
  }
  return false;
}

//figure out if any given cell will be alive or not in the next moment
function conway(x, y, ta) {
  var neighbors = getNeighbors(x, y);

  ta[x][y] = life[life.length-1][x][y];

  if(life[life.length-1][x][y] == 1) {
    if(neighbors < 2 || neighbors > 3) {
      ta[x][y] = 2;
    }
  } else {
    if(neighbors == 3) {
      ta[x][y] = 1;
    }
  }
}

//returns a count of how many living neighbors any given cell has
function getNeighbors(x, y) {
  var neighbors = 0;

  if(y > 0) {
    if(x > 0) {
      if(life[life.length-1][x - 1][y - 1] == 1) neighbors++;
    }
    if(life[life.length-1][x][y-1] == 1) neighbors++;
    if(x < life[life.length-1].length - 1) {
      if(life[life.length-1][x + 1][y - 1] == 1) neighbors++;
    }
  }

  if(y < life[life.length-1][0].length - 1) {
    if(x > 0) {
      if(life[life.length-1][x - 1][y + 1] == 1) neighbors++;
    }
    if(life[life.length-1][x][y + 1] == 1) neighbors++;
    if(x < life[life.length-1].length - 1) {
      if(life[life.length-1][x + 1][y + 1] == 1) neighbors++;
    }
  }
  
  if(x > 0) {
    if(life[life.length-1][x - 1][y] == 1) neighbors++;
  }
  if(x < life[life.length-1].length - 1) {
    if(life[life.length-1][x + 1][y] == 1) neighbors++;
  }

  return neighbors;
}

//forgets all of the history but the current moment
function reduceToOne() {
  life.splice(0, life.length-1);
}

//toggle a cell alive/dead and stop the simulation if it's running
function mousePressed() {
  var tx = Math.floor(mouseX/squareSize + onScreen.x);
  var ty = Math.floor(mouseY/squareSize + onScreen.y);
  if(life[life.length-1][tx][ty] == 1) {
    life[life.length-1][tx][ty] = 2;
  } else {
    life[life.length-1][tx][ty] = 1;
  }
  loopSize = false;
  livingCells[life.length - 1] = countCells(life.length - 1);
}

//get use input and do stuff
function keyPressed() {
  if(keyCode == ENTER) {                      //Toggle the simulation when you press enter
    run = !run;
  } else if(key == 'H') {                     //Show or hide the history when you press H
    showHist = !showHist
  } else if(keyCode == BACKSPACE) {              //Reset everything when you press delete
    setupGrid();
  } else if(keyCode == DOWN_ARROW) {          //Forget the history when you hit press the down arrow
    reduceToOne();
    loopSize = false;
  } else if(key == 'O') {                     //Toggle the original cell indicator when you press 'o'
    showOrig = !showOrig;
  } else if(keyCode == RIGHT_ARROW) {         //Move the simulation one moment ahead when you press the right arrow
    oneStep = true;
  } else if(keyCode == LEFT_ARROW) {          //Move the simulation one moment back when you press the left arrow
    run = false;
    if(life.length > 1) {
      life.pop();
      loopSize = false;
    }
  } else if(keyCode == UP_ARROW) {            //Toggle the display box when you press the up arrow
    showKey = !showKey;
  } else if(keyCode > 48 && keyCode < 58) {
    frameRate(10 + (keyCode-49)*2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupGrid();
}
