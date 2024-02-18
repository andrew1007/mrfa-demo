import { Provider } from "./StateManager";
import App from "./App";

const StateManaged = () => (
  <Provider>
    <App />
  </Provider>
);

export default StateManaged