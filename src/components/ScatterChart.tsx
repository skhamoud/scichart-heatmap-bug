import * as React from "react";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartSurface} from "scichart";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {NumberRange} from "scichart/Core/NumberRange";

interface Tile {
    tile: number[][];
    depth_min: number;
    time_min: number;
}

export interface TileData {
    tiles: Tile[];
    metres_per_pixel: number;
    seconds_per_pixel: number;
    z_min: number;
    z_max: number;
}

const drawExample = async (chartId: string) => {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(chartId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {growBy: new NumberRange(0.05, 0.05)}));
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: "red"
            // stroke: "LightSteelBlue"
        })
    });
    sciChartSurface.renderableSeries.add(scatterSeries);
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }
    scatterSeries.dataSeries = dataSeries;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return {sciChartSurface, wasmContext};
};

interface ChartProps {
    chartId: string;
}

export default function ScatterChart({chartId}: ChartProps) {
    // const [heatmapDataSeries, setHeatmapDataSeries] = React.useState<UniformHeatmapDataSeries>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(chartId);
            setSciChartSurface(res.sciChartSurface);
            // setHeatmapDataSeries(res.heatmapDataSeries);
        })();
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={chartId} style={{width: "80vw"}} />
        </div>
    );
}

// +++++++++++++++++++++++++++++++++++
