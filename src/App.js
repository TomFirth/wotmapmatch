import { useState, useEffect } from "react";
import { mapData } from "./data/maps";
import "./App.css";

// Helper: shuffle array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [assigned, setAssigned] = useState({});
  const [availableNames, setAvailableNames] = useState([]);
  const [score, setScore] = useState(null);
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    setMaps(shuffleArray(mapData)); // Shuffle maps once
    setAvailableNames(
      mapData.map((m) => ({
        id: `name-${m.id}`,
        label: m.name,
        mapId: m.id,
      }))
    );
  }, []);

  const onDragStart = (e, name) => {
    e.dataTransfer.setData("name-id", name.id);
  };

  const onDrop = (e, map) => {
    e.preventDefault();
    const nameId = e.dataTransfer.getData("name-id");
    const name = availableNames.find((n) => n.id === nameId);
    if (!name) return;

    setAssigned((prev) => ({ ...prev, [map.id]: name }));
    setAvailableNames((prev) => prev.filter((n) => n.id !== nameId));
  };

  const onDragOver = (e) => e.preventDefault();

  const clearAll = () => {
    setAssigned({});
    setAvailableNames(
      mapData.map((m) => ({
        id: `name-${m.id}`,
        label: m.name,
        mapId: m.id,
      }))
    );
    setScore(null);
  };

  const submit = () => {
    let correct = 0;
    mapData.forEach((map) => {
      const a = assigned[map.id];
      if (a && a.mapId === map.id) correct++;
    });
    const wrong = mapData.length - correct;
    setScore({ correct, wrong });
  };

  return (
    <div className="app-container">
      {/* MAP GRID */}
      <div className="map-grid">
        {maps.map((map) => (
          <div
            key={map.id}
            className="map-tile"
            onDrop={(e) => onDrop(e, map)}
            onDragOver={onDragOver}
          >
            <div className="img-wrapper">
              <img src={map.img} alt={map.img} />
              <div className="overlay"></div>
            </div>
            <div className="map-label">
              {assigned[map.id] ? assigned[map.id].label : ""}
            </div>
          </div>
        ))}
      </div>

      {/* NAME LIST */}
      <div className="names-panel">
        <h2>Names</h2>
        <div className="names-list">
          {availableNames.map((name) => (
            <div
              key={name.id}
              className="name-item"
              draggable
              onDragStart={(e) => onDragStart(e, name)}
            >
              {name.label}
            </div>
          ))}
        </div>

        <button className="btn submit" onClick={submit}>
          Submit
        </button>
        <button className="btn clear" onClick={clearAll}>
          Clear
        </button>

        {score && (
          <div className="score-box">
            <p>
              <strong>Correct:</strong> {score.correct}
            </p>
            <p>
              <strong>Wrong:</strong> {score.wrong}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
