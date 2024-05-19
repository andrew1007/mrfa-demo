import { Provider } from "./state";
import Main from "./Main";
import "./styles.css";
import "./enterprise-styles.css";

const Enterprise = () => (
  <Provider>
    <Main />
  </Provider>
)

export default Enterprise