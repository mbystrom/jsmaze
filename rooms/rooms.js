import random from "../random.js";

var height = 25;
var width = 50;
var roomAttempts = 25;

var grid;
var finalGrid;

var inRoom = [];

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
  grid = CreateArray(width, height);
  PlaceRooms();
  CarvePassages();
  finalGrid = ConvertAsciiMaze();
  ConnectRegions();
  RemoveEnds();
  DrawMaze(finalGrid);
  let end = performance.now() - start;
  console.log("Maze generator ran in " + end + " ms");
}

// Room Placement Functions

function PlaceRooms ()
{
  for (var i = 0; i < roomAttempts; i++) {
    TryRoom();
  }
}

function TryRoom ()
{
  let roomWidth = random.randint(3,6);
  let roomHeight = random.randint(3,5);

  let xPos = random.randint(0, width - roomWidth);
  let yPos = random.randint(0, height - roomHeight);

  let canPlace = true;
  for (var y = yPos; y < yPos + roomHeight; y++) {
    for (var x = xPos; x < xPos + roomWidth; x++) {
      if (grid[y][x] != 0) {
        canPlace = false;
        break;
      }
    }
  }

  if (canPlace) {
    for (var y = 0; y < roomHeight; y++) {
      for (var x = 0; x < roomWidth; x++) {
        let realX = x + xPos;
        let realY = y + yPos;

        if (y > 0) grid[realY][realX] |= N;
        if (x > 0) grid[realY][realX] |= W;
        if (y < (roomHeight - 1)) grid[realY][realX] |= S;
        if (x < (roomWidth - 1)) grid[realY][realX] |= E;

        inRoom.push({ x: realX, y: realY });
      }
    }
  }
}


// Maze-Carving Functions

function CarvePassages ()
{
  let tiles = GetTiles(grid, 0);
  while (tiles.length > 0) {
    let target = tiles[0];
    CarveFrom(target.x, target.y);
    tiles = GetTiles(grid, 0);
  }
}

function CarveFrom (currentX, currentY)
{
  let directions = random.shuffle([N, S, E, W]);
  for (var direction of directions) {
    let nextX = currentX + DX[direction];
    let nextY = currentY + DY[direction];

    if (isOut(grid, nextX, nextY)) continue;

    if (grid[nextY][nextX] == 0) {
      grid[currentY][currentX] |= direction;
      grid[nextY][nextX] |= Opposite[direction];
      CarveFrom(nextX, nextY);
    }
  }
}


// Region-Joining functions

function ConnectRegions ()
{
  let regions = GetRegions();

  while (regions.length > 1) {
    let walls = GetWalls();
    let connectors = [];

    for (var wall of walls) {
      let adjacentTiles = [];

      for (var direction of [N,S,E,W]) {
        let newX = wall.x + DX[direction];
        let newY = wall.y + DY[direction];

        if (isOut(finalGrid, newX, newY)) continue;

        if (finalGrid[newY][newX] === '.') {
          adjacentTiles.push({ x: newX, y: newY });
        }
      }

      let tilesWithRegions = []
      for (var region of regions) {
        for (var tile of adjacentTiles) {
          for (var regionTile of region) {
            if (regionTile.x == tile.x && regionTile.y == tile.y) {
              tilesWithRegions.push({ tile: tile, region: region });
            }
          }
        }
      }

      for (var i = 0; i < tilesWithRegions.length; i++) {
        for (var j = 0; j < tilesWithRegions.length; j++) {
          if (i === j) continue;
          if (tilesWithRegions[i].region != tilesWithRegions[j].region) {
            connectors.push(wall);
          }
        }
      }
    }

    if (connectors.length > 0) {
      if (connectors.length > 5) {
        for (var i = 0; i < 5; i++) {
          let connector = random.choice(connectors);
          console.log(connector);
          finalGrid[connector.y][connector.x] = '.';
        }
      }
      else {
        for (var i = 0; i < Math.ceil(connectors.length / 2); i++) {
          let connector = random.choice(connectors);
          finalGrid[connector.y][connector.x] = '.';
        }
      }
    }

    regions = GetRegions();
  }
}

function GetRegions ()
{
  console.log("getting regions!"); let start = performance.now();
  let notInRoom = GetTiles(finalGrid, '.', inRoom);
  let regions = [];
  let flags = CreateArray(finalGrid[0].length, finalGrid.length);

  while (notInRoom.length > 0) {
    notInRoom = GetTiles(finalGrid, '.');
    for (var y = 0; y < flags.length; y++) {
      for (var x = 0; x < flags[0].length; x++) {
        if (flags[y][x] === 1) {
          for (var i = 0; i < notInRoom.length; i++) {
            if (notInRoom[i].x === x && notInRoom[i].y === y) {
              notInRoom.splice(i, 1);
              // console.log("Point ("x+", "+y+") in flags! splicing!");
            }
          }
        }
      }
    }
    if (notInRoom.length > 0) {
      let region = GetRegion(notInRoom[0], flags);
      regions.push(region);
    }
    console.log("there are "+regions.length+" regions");
  }

  let end = performance.now() - start; console.log("GetRegions Ran in "+end+" ms!");
  return regions;
}

function GetRegion(point, flags)
{
  console.log("getting a region!"); let start = performance.now();
  let tiles = [];
  let queue = [point,];
  while (queue.length > 0) {
    let tile = queue.shift();
    tiles.push(tile);

    for (var direction of [N,S,E,W]) {
      let x = tile.x + DX[direction];
      let y = tile.y + DY[direction];
      
      if (isOut(finalGrid, x, y)) continue;

      if (flags[y][x] === 0 && finalGrid[y][x] === '.') {
        flags[y][x] = 1;
        queue.push({ x: x, y: y });
      }
    }
  }

  let end = performance.now() - start; console.log("getting one region took "+end+" ms");
  return tiles;
}

function GetWalls ()
{
  let walls = [];
  for (var y = 0; y < finalGrid.length; y++) {
    for (var x = 0; x < finalGrid[0].length; x++) {
      if (finalGrid[y][x] === '#') {
        walls.push({ x: x, y: y });
      }
    }
  }
  return walls;
}


// Uncarving Functions

function RemoveEnds ()
{
  let uncarve = TilesToUncarve();
  while (uncarve.length > 0) {
    for (var tile of uncarve) {
      finalGrid[tile.y][tile.x] = '#';
    }
    uncarve = TilesToUncarve();
  }
}

function TilesToUncarve ()
{
  let tiles = [];
  for (var y = 0; y < finalGrid.length; y++) {
    for (var x = 0; x < finalGrid[0].length; x++) {
      
      if (finalGrid[y][x] === '#') continue;

      let surroundingWallCount = 0;
      for (var direction of [N,S,E,W]) {
        let newX = x + DX[direction];
        let newY = y + DY[direction];
        if (isOut(finalGrid, newX, newY)) continue;
        if (finalGrid[newY][newX] === '#') surroundingWallCount++;
      }
      
      if (surroundingWallCount >= 3) {
        tiles.push({ x: x, y: y });
      }
    }
  }
  
  return tiles;
}

// General Management Functions

function GetTiles (grid, target, ignore = [])
{
  let targetTiles = [];
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == target) {
        if (ignore.length !== 0) {
          for (var i of ignore) {
            if (i.x == x && i.y == y) continue;
          }
        }
        targetTiles.push({ x: x, y: y });
      }
    }
  }
  return targetTiles;
}

function isOut (grid, x, y)
{
  if (x < 0 || x >= grid[0].length) return true;
  if (y < 0 || y >= grid.length) return true;
  return false;
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

      let point = { x: x, y: y };
      if (grid[y][x] === 15) {
        line.push('.');
      }
      else if (grid[y][x] === 14 || grid[y][x] === 7 || grid[y][x] === 6) {
        let pushed = false;
        for (var cell of inRoom) {
          if (cell.x == point.x && cell.y == point.y) {
            line.push('.');
            pushed = true;
          }
        }
        if (!pushed) line.push('#');
      }
      else {
        line.push('#');
      }
    }

    maze.push(line);
  }
  return maze;
}

function DrawMaze (maze)
{
  let html = "";
  for (var row of maze) {
    for (var cell of row) {
      if (cell === "#") html += "&#9608;" // creates the "full block (█)" character instead of "#"
      else html += cell;
      // html += cell;
    }
    html += "<br/>";
  }
  document.getElementById("mazeContainer").innerHTML = html;
}
