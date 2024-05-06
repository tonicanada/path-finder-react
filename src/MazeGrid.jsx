import { useState } from "react";
import "./App.css";

function getFloorRandomNumber(size) {
  return Math.floor(Math.random() * size);
}

function updatePosition(point, displacement) {
  return [point[0] + displacement[0], point[1] + displacement[1]];
}

function generatePath(start, end, boardSize) {
  // Genera un camino aleatorio desde start hasta end
  const dy = [4, 6, 3, 6];
  const move1 = [0, dy[0]];
  let position = updatePosition(start, move1);
  // console.log("position1", position);

  const move2 = [getFloorRandomNumber(boardSize - position[0]), 0];
  position = updatePosition(position, move2);
  // console.log("position2", position);

  const move3 = [0, dy[1]];
  position = updatePosition(position, move3);
  // console.log("position3", position);

  const move4 = [-getFloorRandomNumber(position[0]), 0];
  position = updatePosition(position, move4);
  // console.log("position4", position);

  const move5 = [0, dy[2]];
  position = updatePosition(position, move5);
  // console.log("position5", position);

  const move6 = [end[0] - position[0], 0];
  position = updatePosition(position, move6);
  // console.log("position6", position);

  const move7 = [0, dy[3]];
  position = updatePosition(position, move7);
  // console.log("position7", position);

  return [move1, move2, move3, move4, move5, move6, move7];
}

function generateMaze() {
  let maze = Array.from({ length: 20 }, () =>
    Array.from({ length: 20 }, () => "wall")
  );

  // Establecer inicio y fin aleatorios en los bordes
  let start = [Math.floor(Math.random() * 20), 0];
  let end = [Math.floor(Math.random() * 20), 19];
  maze[start[0]][start[1]] = "start";
 

  const moves = generatePath(start, end, 20);
  console.log('start', start)
  
  const current = start;

  console.log(moves)

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    console.log('move', move)
    if (move[0] == 0) {
      // Movimiento horizontal
      for (let j = 0; j < Math.abs(move[1]); j++) {
        if (move[1] > 0) {
          current[1] += 1;
        } else if (move[1] < 0) {
          current[1] += -1;
        }

        maze[current[0]][current[1]] = "path";
        console.log(current)
      }
    } else if (move[1] == 0) {
      // Movimiento vertical
      for (let j = 0; j < Math.abs(move[0]); j++) {
        if (move[0] > 0) {
          current[0] += 1;
        } else {
          current[0] += -1;
        }
        maze[current[0]][current[1]] = "path";
      }
      console.log(current)
    }
  }

  maze[end[0]][end[1]] = "end";
  console.log(maze)
  return maze;
}

// Función para renderizar el laberinto
const renderMaze = (maze) => {
  return maze.map((row, rowIndex) => (
    <div key={rowIndex} className="row">
      {row.map((cell, cellIndex) => (
        <div key={`${rowIndex}-${cellIndex}`} className={`cell ${cell}`}></div>
      ))}
    </div>
  ));
};

function MazeGrid() {
  const [maze, setMaze] = useState(generateMaze());

  const regenerateMaze = () => {
    setMaze(generateMaze()); // Generar y establecer un nuevo laberinto
  };

  return (
    <div>
      {renderMaze(maze)}
      <button onClick={regenerateMaze}>Regenerar laberinto</button>
    </div>
  );
}

export default MazeGrid;
