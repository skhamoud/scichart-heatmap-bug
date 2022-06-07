import React from "react";
import "./app.css";

import negativeValues from "./negative-data.json";
import HeatmapChart, {TileData} from "components/Chart";

const App: React.FC = () => (
    <div className="App">
        <div>
            <h2>Chart with negative values heatmap</h2>
            <HeatmapChart
                tileData={negativeValues as TileData}
                chartId="chart1"
                gradientStops={[
                    {
                        color: "#FFFFFF",
                        offset: 0
                    },
                    {
                        color: "#09316c",
                        offset: 1
                    }
                ]}
            />
        </div>
    </div>
);

export default App;
