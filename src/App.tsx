import { useState } from 'react';
import './App.css';
import { LocalState } from './LocalState';
import StateManaged from './StateManaged';

function App() {
  const [showStateManaged, setShowStateManaged] = useState(true)

  return (
    <div className="App">
      <form onChange={(e) => {
        // @ts-ignore
        setShowStateManaged(e.target?.value === 'optimized')
      }}>
        <fieldset id="group1">
          <input type="radio" defaultChecked value="optimized" name="group1" />
          <label>Optimized</label>
          <input type="radio" value="local" name="group1" />
          <label>Local state</label>
        </fieldset>
      </form>
      <div>
        {showStateManaged ? <StateManaged /> : <LocalState />}
      </div>
    </div>
  );
}

export default App;
