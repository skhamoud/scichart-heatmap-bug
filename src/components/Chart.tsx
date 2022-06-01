import * as React from "react";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartSurface} from "scichart";
import {UniformHeatmapDataSeries} from "scichart/Charting/Model/UniformHeatmapDataSeries";
import {UniformHeatmapRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import {HeatmapColorMap} from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {SmartDateLabelProvider} from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";
import {format} from "date-fns";
import {EAxisAlignment} from "scichart/types/AxisAlignment";

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

const drawExample = async (chartId: string, tileData: TileData) => {
    // Create a SciChartSurface
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(chartId);

    // Add XAxis and YAxis
    const timeAxis = new NumericAxis(wasmContext, {
        axisTitle: `Time ${format(new Date(), "O")}`,
        axisAlignment: EAxisAlignment.Bottom,
        labelProvider: new SmartDateLabelProvider()
    });
    const depthAxis = new NumericAxis(wasmContext, {
        axisTitle: "Depth (m)",
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true
    });
    sciChartSurface.yAxes.add(timeAxis);
    sciChartSurface.xAxes.add(depthAxis);
    depthAxis.isPrimaryAxis = true;
    timeAxis.isPrimaryAxis = true;

    const {tiles, z_min, z_max, metres_per_pixel, seconds_per_pixel} = tileData;

    const initialZValues: number[][] = tiles[0]?.tile.map((t) =>
        t.map((v) => (Number.isNaN(v) || v === null ? NaN : v))
    );

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: parseFloat(String(tiles[0].depth_min)),
        xStep: parseFloat(String(metres_per_pixel)),
        yStart: parseFloat(String(tiles[0].time_min)),
        yStep: parseFloat(String(seconds_per_pixel)),

        zValues: initialZValues
    });

    heatmapDataSeries.hasNaNs = true;

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        fillValuesOutOfRange: true,
        colorMap: new HeatmapColorMap({
            minimum: z_min,
            maximum: z_max,
            gradientStops: [
                {
                    color: "#000083",
                    offset: 0
                },
                {
                    color: "#0000ff",
                    offset: 0.13
                },
                {
                    color: "#0afff5",
                    offset: 0.35
                },
                {
                    color: "#8fff70",
                    offset: 0.5
                },
                {
                    color: "#ffff00",
                    offset: 0.65
                },
                {
                    color: "#ff5400",
                    offset: 0.77
                },
                {
                    color: "#ff0000",
                    offset: 0.88
                },
                {
                    color: "#800000",
                    offset: 1
                }
            ]
        })
    });

    // Add heatmap to the chart
    sciChartSurface.renderableSeries.add(heatmapSeries);
    console.log({
        initialZValues,
        dataSeries: heatmapDataSeries,
        heatmapSeries
    });

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return {sciChartSurface, wasmContext, heatmapDataSeries};
};

export default function HeatmapChart({chartId, tileData}: {chartId: string; tileData: TileData}) {
    // const [heatmapDataSeries, setHeatmapDataSeries] = React.useState<UniformHeatmapDataSeries>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(chartId, tileData);
            setSciChartSurface(res.sciChartSurface);
            // setHeatmapDataSeries(res.heatmapDataSeries);
        })();
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={chartId} className="ChartWrapper" />
        </div>
    );
}
