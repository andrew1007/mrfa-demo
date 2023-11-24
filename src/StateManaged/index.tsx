import { Provider } from "../library/StateManager";
import App from "./App";

const StateManaged = () => (
  <Provider>
    <App />
  </Provider>
);

export default StateManaged