import { useState } from 'react';
import './App.css';
import { LocalState } from './LocalState';
import StateManaged from './StateManaged';

function App() {
  const [showStateManaged, setShowStateManaged] = useState(true)

  return (
    <div className="App">
      <button onClick={() => setShowStateManaged(prev => !prev)}>
        Swap to {showStateManaged ? 'Local state implementation' : 'State managed implementation'}
      </button>
      <div>
        {showStateManaged ? <StateManaged /> : <LocalState />}
      </div>
    </div>
  );
}

export default App;
