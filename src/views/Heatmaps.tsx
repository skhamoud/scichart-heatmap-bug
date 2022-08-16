import React from "react";
import HeatmapChart, {TileData} from "components/Chart";

import tileData2 from "../data/tileData2.json";
import tileData1 from "../data/tileData1.json";

export default function Heatmaps() {
    return (
        <div>
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
}
