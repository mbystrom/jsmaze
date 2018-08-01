var height = 50;
var width = 50;
var grid;

// remember these because they are referenced directly as numbers
const N = 1;
const S = 2;
const E = 4;
const W = 8;

// for some reason these needed to be translated back into their bits?
const DX = { 1: 0, 2: 0, 4: 1, 8: -1 };
const DY = { 1: -1, 2: 1, 4: 0, 8: 0 };
const Opposite = { 1: 2, 2: 1, 4: 8, 8: 4 };

window.onload = function () {
  GenerateMaze();
}

function GenerateMaze ()
{
  let start = performance.now();
  try {
    width = Number(document.getElementById("width").value);
    height = Number(document.getElementById("height").value);
  }
  catch {
    console.log("Error converting your input to a number!")
  }
  grid = CreateArray(width, height);
  CarvePassages();
  DrawMaze();
  let elapsed = performance.now() - start;
  console.log("generation took "+elapsed+" ms");
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

function CarvePassages ()
{
  let ignore = [];
  let emptyTiles = GetEmptyTiles(ignore);
  timeStarted = performance.now();
  
  while (emptyTiles.length > 3) {
    let stack = [];
    stack.push(emptyTiles[0]);

    while (stack.length > 0) {
      let index = stack.length - 1;
      let currentTile = stack[index];

      let directions = Shuffle([N,S,E,W]);

      let directionsTried = [];

      for (direction of directions) {
        nextX = currentTile.x + DX[direction];
        nextY = currentTile.y + DY[direction];

        directionsTried.push(direction);

        if (isOut(nextX, nextY)) continue;

        if (grid[nextY][nextX] == 0) {
          stack.push({x: nextX, y: nextY});
          grid[currentTile.y][currentTile.x] |= direction;
          grid[nextY][nextX] |= Opposite[direction];
          break;
        }
      }

      if (directionsTried.length >= 4) {
        if (grid[currentTile.y][currentTile.x] == 0) {
          ignore.push(currentTile);
        }
        stack.pop(index);
      }
    }

    emptyTiles = GetEmptyTiles(ignore);
    if ((performance.now() - timeStarted) > 300) {
      console.error("It ran too long again!");
      console.error(grid, ignore);
      break;
    }
  }
}

function isOut (x, y)
{
  if (x < 0 || x >= width)  return true;
  if (y < 0 || y >= height) return true;
  return false;
}

function Shuffle(arr)
{
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function DrawMaze ()
{
  let start = performance.now();
  var html = "<pre>";

  for (var z = 0; z < width; z++) {
    html += "__";
  }
  html += "<br/>";

  for (var y = 0; y < height; y++) {
    html += "|"
    for (var x = 0; x < width; x++) {
      if ((grid[y][x] & S) != 0) {
        html += " ";
      } else {
        html += "_";
      }

      if ((grid[y][x] & E) != 0) {
        if (((grid[y][x] | grid[y][x+1]) & S) != 0) {
          html += " ";
        } else {
          html += "_";
        }
      } else {
        html += "|";
      }
    }
    html += "<br/>";
  }
  html += "</pre>"
  document.getElementById("mazeContainer").innerHTML = html;
  let elapsed = performance.now() - start;
  console.log("DrawMaze executed in "+elapsed+" ms");
}

function GetEmptyTiles (ignore = [])
{
  let empty = [];
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      for (var tile of ignore) {
        if (tile.x == x && tile.y == y) continue;
      }
      if (grid[y][x] == 0) empty.push({x:x,y:y});
    }
  }
  return empty;
}
