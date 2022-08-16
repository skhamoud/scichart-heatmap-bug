import React from "react";
import "./app.css";
import StackedMountainsView from "./views/StackedMountains";
// import Heatmaps from "./views/Heatmaps";

const App: React.FC = () => (
    <div className="App">
        {/* <Heatmaps /> */}
        <StackedMountainsView />
    </div>
);

export default App;
