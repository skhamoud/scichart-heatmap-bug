import React from "react";
import ExampleHeatmap from "components/ExampleHeatmap";
import "./app.css";

import tileData2 from "./tileData2.json";
import tileData1 from "./tileData1.json";
import HeatmapChart, {TileData} from "components/Chart";

const App: React.FC = () => (
    <div className="App">
        <div>
            <h2>Chart with normal heatmap</h2>
            <HeatmapChart tileData={tileData1 as TileData} chartId="chart1" />
        </div>
        <div>
            <h2>Chart with heatmap not working</h2>
            <HeatmapChart tileData={tileData2 as TileData} chartId="chart2" />
        </div>
    </div>
);

export default App;
