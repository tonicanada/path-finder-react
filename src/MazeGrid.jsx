import { useState, useEffect } from "react";
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

  const move2 = [getFloorRandomNumber(boardSize - position[0]), 0];
  position = updatePosition(position, move2);

  const move3 = [0, dy[1]];
  position = updatePosition(position, move3);

  const move4 = [-getFloorRandomNumber(position[0]), 0];
  position = updatePosition(position, move4);

  const move5 = [0, dy[2]];
  position = updatePosition(position, move5);

  const move6 = [end[0] - position[0], 0];
  position = updatePosition(position, move6);

  const move7 = [0, dy[3]];
  position = updatePosition(position, move7);

  return [move1, move2, move3, move4, move5, move6, move7];
}

function generateMaze() {
  let maze = Array.from({ length: 20 }, () =>
    Array.from({ length: 20 }, () => "wall")
  );

  // Establecer inicio y fin aleatorios en los bordes
  let start = [Math.floor(Math.random() * 20), 0];
  let end = [Math.floor(Math.random() * 20), 19];

  // Generamos un camino posible
  const moves = generatePath(start, end, 20);
  // console.log("start", start);
  maze[start[0]][start[1]] = "start";

  const current = [...start];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    // console.log("move", move);
    if (move[0] == 0) {
      // Movimiento horizontal
      for (let j = 0; j < Math.abs(move[1]); j++) {
        if (move[1] > 0) {
          current[1] += 1;
        } else if (move[1] < 0) {
          current[1] += -1;
        }

        maze[current[0]][current[1]] = "path";
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
    }
  }

  maze[end[0]][end[1]] = "end";

  // Liberamos más celdas que sean del tipo "path"
  const cellTypes = ["wall", "path"];

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze.length; j++) {
      if (
        maze[i][j] !== "path" &&
        maze[i][j] !== "start" &&
        maze[i][j] !== "end"
      ) {
        let randomIdx = Math.round(Math.random());
        maze[i][j] = cellTypes[randomIdx];
      }
    }
  }

  return { maze, start, end };
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

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// Función helper para manejar el retraso
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dfs = async (maze, start, visited, end, updateMaze) => {
  const currentCell = maze[start[0]][start[1]];

  if (currentCell != "start" && currentCell != "end") {
    maze[start[0]][start[1]] = "visited";
  }
  updateMaze(maze);

  await delay(100); // Espera 100 ms antes de continuar

  if (start[0] === end[0] && start[1] === end[1]) {
    return true;
  }

  visited[start[0]][start[1]] = true;
  for (let j = 0; j < directions.length; j++) {
    let move = directions[j];
    let newPosition = [start[0] + move[0], start[1] + move[1]];
    let new_i = newPosition[0];
    let new_j = newPosition[1];
    if (new_i >= 0 && new_i < maze.length) {
      if (new_j >= 0 && new_j < maze.length) {
        if (!visited[new_i][new_j]) {
          if (maze[new_i][new_j] != "wall") {
            if (await dfs(maze, [new_i, new_j], visited, end, updateMaze)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

const bfs = async (maze, start, visited, end, updateMaze) => {
  const queue = [start];

  while (queue.length !== 0) {
    let current = queue.shift();
    // visited[current[0]][current[1]] = true;

    const currentCell = maze[current[0]][current[1]];

    if (current[0] === end[0] && current[1] === end[1]) {
      break;
    }
    if (currentCell != "start" && currentCell != "end") {
      maze[current[0]][current[1]] = "visited";
    }
    updateMaze(maze);
    await delay(100); // Espera 100 ms antes de continuar

    for (let j = 0; j < directions.length; j++) {
      let move = directions[j];
      let newPosition = [current[0] + move[0], current[1] + move[1]];
      let new_i = newPosition[0];
      let new_j = newPosition[1];
      if (new_i >= 0 && new_i < maze.length) {
        if (new_j >= 0 && new_j < maze.length) {
          if (!visited[new_i][new_j]) {
            if (maze[new_i][new_j] != "wall") {
              visited[new_i][new_j] = true; // Marcar como visitado antes de encolar
              queue.push(newPosition);
            }
          }
        }
      }
    }
  }
  return true;
};

function clearMaze(maze, updateMaze) {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze.length; j++) {
      if (maze[i][j] === "visited") {
        maze[i][j] = "path";
      }
    }
  }
  updateMaze(maze);
}

function MazeGrid() {
  const [mazeDict, setMaze] = useState(generateMaze());
  const { maze, start, end } = mazeDict;

  const updateMaze = (newMaze) => {
    setMaze({ ...mazeDict, maze: newMaze });
  };

  const handleSearchClickDfs = async () => {
    clearMaze(maze, updateMaze);
    const visited = Array.from({ length: maze.length }, () =>
      Array(maze.length).fill(false)
    );
    await dfs(maze, start, visited, end, updateMaze);
  };

  const handleSearchClickBfs = async () => {
    clearMaze(maze, updateMaze);
    const visited = Array.from({ length: maze.length }, () =>
      Array(maze.length).fill(false)
    );
    await bfs(maze, start, visited, end, updateMaze);
  };

  const handleSearchClickClearMaze = () => {
    clearMaze(maze, up);
  };

  const regenerateMaze = () => {
    setMaze(generateMaze()); // Generar y establecer un nuevo laberinto
  };

  return (
    <div>
      {renderMaze(maze)}
      <button onClick={regenerateMaze}>Regenerar laberinto</button>
      <button onClick={handleSearchClickDfs}>Ejecutar DFS</button>
      <button onClick={handleSearchClickBfs}>Ejecutar BFS</button>
      <button onClick={handleSearchClickClearMaze}>Limpiar</button>
    </div>
  );
}

export default MazeGrid;
