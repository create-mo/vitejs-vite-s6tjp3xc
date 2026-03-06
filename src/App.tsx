import { useState } from 'react';
import { DATABASE } from './data/database';
import TimeAxis from './components/TimeAxis';
import ScoreCanvas from './components/ScoreCanvas';
import './App.css';

function App() {
  const [selectedComposerId, setSelectedComposerId] = useState('bach');

  return (
    <div className="app-container">
      <TimeAxis
        composers={DATABASE}
        selectedComposerId={selectedComposerId}
        onSelectComposer={setSelectedComposerId}
      />
      
      <div className="main-canvas-container">
        <ScoreCanvas selectedComposerId={selectedComposerId} />
      </div>
    </div>
  );
}

export default App;