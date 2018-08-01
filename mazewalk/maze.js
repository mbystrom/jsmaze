export { GenerateMaze, DrawMaze };

var height = 20;
var width = 42;
var grid;

const N = 1;
const S = 2;
const E = 4;
const W = 8;

// for some reason these needed to be translated back into their bits?
const DX = { 1: 0, 2: 0, 4: 1, 8: -1 };
const DY = { 1: -1, 2: 1, 4: 0, 8: 0 };
const Opposite = { 1: 2, 2: 1, 4: 8, 8: 4 };

function GenerateMaze ()
{
  // widthComponent = document.getElementById("width");
  // heightComponent = document.getElementById("height");
  // try {
  //   height = Number(heightComponent.value);
  //   width = Number(widthComponent.value);
  // }
  // catch {
  //   console.log("couldn't convert type!");
  // }
  grid = CreateArray(width, height);
  CarvePassages(0,0);
  var maze = ConvertAsciiMaze();
  return maze;
}

function CreateArray (width, height)
{
  var arr = [];

  for (var i = 0; i < height; i++) {
    arr[i] = [];
    for (var j = 0; j < width; j++) {
      arr[i][j] = 0;
    }
  }

  return arr;
}

function CarvePassages (currentX, currentY)
{
  let dirs = Shuffle([ N, S, E, W ]);

  for (var direction of dirs) {
    let nextX = currentX + DX[direction];
    let nextY = currentY + DY[direction];

    if (isOutOfBounds(nextX, nextY)) continue;

    if (grid[nextY][nextX] == 0) {
      grid[currentY][currentX] |= direction;
      grid[nextY][nextX] |= Opposite[direction];
      CarvePassages(nextX, nextY);
    }
  }
}

function isOutOfBounds (x, y)
{
  if (x < 0 || x >= width) return true;
  if (y < 0 || y >= height) return true;
  return false;
}

function Shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function DrawMaze (matrix)
{
  var html = "";

  for (var row of matrix) {
    for (var cell of row) {
      html += cell;
    }
    html += "<br/>";
  }
  
  document.getElementById("mazeContainer").innerHTML = html;
}

function ConvertAsciiMaze ()
{
  var maze = [];

  let firstLine = [];
  for (var x = 0; x < width*2 + 1; x++) {
    firstLine.push('#');
  }
  maze.push(firstLine);

  for (var y = 0; y < height; y++) {
    
    let line = [];
    line.push('#');

    for (var x = 0; x < width; x++) {
      
      if (grid[y][x] == 0) {
        line.push('#');
      } else {
        line.push('.');
      }

      if ((grid[y][x] & E) == 0) {
        line.push('#');
      } else {
        line.push('.');
      }
    }

    maze.push(line);

    line = [];
    line.push('#');

    for (var x = 0; x < width; x++) {
      
      if ((grid[y][x] & S) == 0) {
        line.push('#');
      } else {
        line.push('.')
      }

      line.push('#');
    }

    maze.push(line);
  }
  return maze;
}
