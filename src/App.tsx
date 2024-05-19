import { useState } from 'react';
import './App.css';
import Enterprise from './Enterprise';
import { LocalState } from './LocalState';
import StateManaged from './StateManaged';

const Apps = {
  local: LocalState,
  optimized: StateManaged,
  enterprise: Enterprise,
}

function App() {
  const [openedApp, setOpenedApp] = useState<keyof typeof Apps>('enterprise')

  const CurrentApp = Apps[openedApp]

  return (
    <div className="App">
      <form onChange={(e) => {
        // @ts-expect-error
        setOpenedApp(e.target?.value)
      }}>
        <fieldset id="group1">
          <input type="radio" value="optimized" name="group1" />
          <label>Optimized</label>
          <input type="radio" value="local" name="group1" />
          <label>Local state</label>
          <input type="radio" defaultChecked value="enterprise" name="group1" />
          <label>Enterprise</label>
        </fieldset>
      </form>
      <div>
        {CurrentApp && <CurrentApp />}
      </div>
    </div>
  );
}

export default App;
