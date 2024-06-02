import CacheMiss from "./CacheMiss";
import SlowDown from "./SlowDown";

const PerformanceBar = () => {
    return (
        <div className="performance-bar-container">
            Performance Options
            <SlowDown />
            <CacheMiss />
        </div>
    )
}

export default PerformanceBar;
