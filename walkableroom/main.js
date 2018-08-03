import dungeon from "./dungeon.js";
import random from "../random.js";

var grid;
var playerPos;

var playerGlyph = '<span style="color:red">@</span>';

window.onload = function () {
  grid = dungeon.GenerateMaze();
  playerPos = PlacePlayer();
  Start();
}

document.addEventListener('keydown', (event) => {
  KeyPress(event.keyCode);
})

function Start ()
{
  Update();
}

function Update (key)
{
  playerPos = MovePlayer(playerPos, key);
  grid[playerPos.y][playerPos.x] = playerGlyph;
  ClearGrid(playerPos);
  dungeon.DrawMaze(grid)
}

function MovePlayer (pos, key)
{
  let validKeys = ['left', 'right', 'up', 'down'];
  if (validKeys.indexOf(key) > -1) {
    let DX = { 'left': -1, 'right': 1, 'up': 0, 'down': 0 };
    let DY = { 'left': 0, 'right': 0, 'up': -1, 'down': 1 };

    let nextX = pos.x + DX[key];
    let nextY = pos.y + DY[key];

    if (grid[nextY][nextX] === '.') {
      pos.x = nextX;
      pos.y = nextY;
    }
  }
  return pos;
}

function ClearGrid (keep)
{
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (x == keep.x && y == keep.y) continue;
      if (grid[y][x] != '.' && grid[y][x] != '#') {
        grid[y][x] = '.';
      }
    }
  }
}

function KeyPress (keycode)
{
  if (keycode == "37") Update('left');
  if (keycode == "39") Update('right');
  if (keycode == "38") Update('up');
  if (keycode == "40") Update('down');
}

function PlacePlayer ()
{
  let possibleLocations = [];
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '.') {
        possibleLocations.push({ x: x, y: y });
      }
    }
  }

  let choice = random.choice(possibleLocations);
  return choice;
}
