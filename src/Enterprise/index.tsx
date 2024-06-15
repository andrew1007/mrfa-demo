import { Provider } from "./store";
import Main from "./Main";
import "./styles.css";
import "./enterprise-styles.css";
import EnterpriseLocal from "./EnterpriseLocal";
import PerformanceBar from "./App/PerformanceBar";
import Credit from "./App/Credit";

const Enterprise = () => (
  <Provider>
    <div>
      <div className="apps-container">
        <EnterpriseLocal />
        <Main />
        <PerformanceBar />
      </div>
      <Credit />
    </div>
  </Provider>
)

export default Enterprise