import AlgoSlowDown from "./AlgoSlowDown";
import SlowDown from "./SlowDown";

const PerformanceBar = () => {
    return (
        <div className="performance-bar-container">
            Performance Options
            <SlowDown />
            <AlgoSlowDown />
        </div>
    )
}

export default PerformanceBar;
