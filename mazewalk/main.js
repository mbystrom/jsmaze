import { GenerateMaze, DrawMaze } from './maze.js';

var grid;
var playerPosition;
var lastPos;

window.onload = function () {
  grid = GenerateMaze();
  playerPosition = PlacePlayer();
  lastPos = playerPosition;
  Start();
}

document.addEventListener('keydown', (event) => {
  if (event.keyCode == "37") Update('left');
  if (event.keyCode == "39") Update('right');
  if (event.keyCode == "38") Update('up');
  if (event.keyCode == "40") Update('down');
}, true)

function Start ()
{
  Update('');
}

function Update (key)
{
  playerPosition = MovePlayer(playerPosition, key);

  grid[playerPosition.y][playerPosition.x] = '<span style="color:red">@</span>';

  ClearGrid(playerPosition);

  DrawMaze(grid);
}

function MovePlayer (pos, key)
{
  let choices = ['left', 'right', 'up', 'down'];
  if (choices.indexOf(key) > -1) {
    let DX = { 'left': -1, 'right': 1, 'up': 0, 'down': 0 };
    let DY = { 'left': 0, 'right': 0, 'up': -1, 'down': 1 };

    let nextX = pos.x + DX[key];
    let nextY = pos.y + DY[key];
    if (grid[nextY][nextX] != '#') {
      console.log("the next space ("+ grid[nextY][nextX] +") isn't a '#'!")
      pos.x = nextX;
      pos.y = nextY;
      return pos
    } else {
      return pos;
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

function PlacePlayer ()
{
  let possibleLocations = [];

  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == '.') {
        possibleLocations.push({x: x, y: y});
      }
    }
  }

  let choice = Math.floor(Math.random() * possibleLocations.length);

  let pos = possibleLocations[choice];
  return pos;
}
