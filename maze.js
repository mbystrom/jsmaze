var height = 68;
var width = 132;
var grid;

const N = 1;
const S = 2;
const E = 4;
const W = 8;

// for some reason these needed to be translated back into their bits?
const DX = { 1: 0, 2: 0, 4: 1, 8: -1 };
const DY = { 1: -1, 2: 1, 4: 0, 8: 0 };
const Opposite = { 1: 2, 2: 1, 4: 8, 8: 4 }

window.onload = function () {
  GenerateMaze();
}

function GenerateMaze ()
{
  grid = CreateArray(width, height);
  CarvePassages(0,0);
  DrawMaze();
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

function DrawMaze ()
{
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
}
