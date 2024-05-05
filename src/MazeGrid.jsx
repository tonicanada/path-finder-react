import "./App.css";

function MazeGrid() {
  let maze = [
    ["wall", "wall", "wall", "wall"],
    ["start", "path", "path", "wall"],
    ["wall", "wall", "path", "wall"],
    ["wall", "wall", "path", "end"],
  ];

  return (
    <div>
      {maze.map((row) => (
        <div className="row">
          {row.map((cell) => (
            <div className={`cell ${cell}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MazeGrid;
