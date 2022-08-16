import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {xValues, y1Values, y2Values, y3Values} from "../data/stackedMountainData";
import {StackedMountainRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import {StackedMountainCollection} from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {LegendModifier} from "scichart/Charting/ChartModifiers/LegendModifier";
import {
    ELegendOrientation,
    ELegendPlacement
} from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {SeriesSelectionModifier} from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";

const drawExample = async (chartId: string) => {
    const {wasmContext, sciChartSurface} = await SciChartSurface.create(chartId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {labelPrecision: 0}));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {growBy: new NumberRange(0, 0.1), labelPrecision: 0})
    );

    const rendSeries1 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: y1Values,
            dataSeriesName: "Apples"
        }),
        fill: "#939899",
        stroke: "#FFF",
        strokeThickness: 2,
        opacity: 0.8
    });
    const rendSeries2 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: y2Values,
            dataSeriesName: "Pears"
        }),
        fill: "#66838d",
        stroke: "#FFF",
        strokeThickness: 2,
        opacity: 0.8
    });
    const rendSeries3 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: y3Values,
            dataSeriesName: "Oranges"
        }),
        onSelectedChanged(e) {
            console.log(e);
        },
        fill: "#368BC1",
        stroke: "#FFF",
        strokeThickness: 2,
        opacity: 0.8
    });

    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3);
    stackedMountainCollection.animation = new WaveAnimation({duration: 600, fadeEffect: true});

    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    sciChartSurface.chartModifiers.add(
        //   🔥 If you add this modifier everything crashes.
        // new SeriesSelectionModifier({}),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier()
    );

    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true
        })
    );

    sciChartSurface.zoomExtents();

    return {wasmContext, sciChartSurface};
};

interface ChartProps {
    chartId: string;
}
export default function StackedMountainChart({chartId}: ChartProps) {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        if (sciChartSurface) return;
        (async () => {
            const res = await drawExample(chartId);
            setSciChartSurface(res.sciChartSurface);
        })();
        return () => {
            sciChartSurface?.delete();
        };
    }, [chartId, sciChartSurface]);

    return <div id={chartId} />;
}
