import React, { useRef, useEffect } from 'react';
import { ItemData } from '../../types';

interface Props {
    width?: number;
    height?: number;
    chart: {
        title: string;
        data: ItemData[];
        isVisible: boolean;
    };
    chart2: {
        title: string;
        data: ItemData[];
        isVisible: boolean;
    };
}

/**
 * Chart with two lines
 * @param props
 * @constructor
 */
const MultiAxesChart: React.FC<Props> = (props: Props) => {
    const { width = 800, height = 600, chart, chart2 } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawChart = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx && canvas && !!chart?.data.length && !!chart2?.data.length) {
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const width = canvas.width;
            const height = canvas.height;
            const margin = 50;

            // get min and max of first chart
            const values = chart.data.map((item) => item.v);
            // add two degrees above and below, so there is "air" around the chart
            const minValue = Math.min(...values) - 2;
            const maxValue = Math.max(...values) + 2;

            // get min and max of second chart
            const values2 = chart2.data.map((item) => item.v);
            const minValue2 = Math.min(...values2);
            const maxValue2 = Math.max(...values2);

            // get min and max dates
            const minDate = new Date(chart.data[0].t);
            const maxDate = new Date(chart.data[chart.data.length - 1].t);

            // get ranges for both axes
            const xRange = maxDate.getTime() - minDate.getTime();
            const yRange = maxValue - minValue;
            const yRange2 = maxValue2 - minValue2;

            // get scales for both axes
            const xScale = (width - margin * 2) / xRange;
            const yScale = (height - margin * 2) / yRange;
            const yScale2 = (height - margin * 2) / yRange2;

            // draw label for first Y axis
            const numLabels = 20;
            const yStep = yRange / numLabels;
            const yStep2 = yRange2 / numLabels;
            ctx.font = '10px Inter, Avenir, Helvetica, Arial, sans-serif';
            ctx.fillStyle = '#001219';
            ctx.lineWidth = 1;
            // align to the right for ease of comparison
            ctx.textAlign = 'right';
            for (let i = 0; i <= numLabels; i++) {
                const temp = minValue + i * yStep;
                const y = height - margin - (temp - minValue) * yScale;
                // FIX: after first draw labels change position on Y axis
                ctx.fillText(`${temp.toFixed(1)} °C`, 40, y - 4);
                ctx.beginPath();
                ctx.moveTo(45, y);
                ctx.lineTo(width - margin + 5, y);
                ctx.strokeStyle = '#f5f5f5';
                ctx.stroke();
            }

            // draw label for second Y axis
            for (let i = 0; i <= numLabels; i++) {
                const temp2 = minValue2 + i * yStep2;
                const y2 = height - margin - (temp2 - minValue2) * yScale2;
                // FIX: after first draw labels change position on Y axis
                ctx.fillText(`${temp2.toFixed(1)} мм`, width - 5, y2 - 4);
                ctx.beginPath();
                ctx.strokeStyle = '#f5f5f5';
                ctx.stroke();
            }

            // draw label for X axis
            const numLabelsX = 12;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const xStep = xRange / numLabelsX;
            const angle = -Math.PI / 4; // angle of 45 degrees in radians
            const labelHeight = 24;

            for (let i = 0; i <= numLabelsX; i++) {
                const date = new Date(minDate.getTime() + i * xStep);
                const x =
                    margin + (date.getTime() - minDate.getTime()) * xScale;

                ctx.beginPath();
                ctx.moveTo(x, margin);
                ctx.lineTo(x, height - margin);
                ctx.strokeStyle = '#f5f5f5';
                ctx.stroke();

                // move the origin to the point where we want to draw the text
                ctx.translate(x, height - margin + labelHeight);
                // rotate the drawing context to the specified angle
                ctx.rotate(angle);
                ctx.fillText(date.toLocaleDateString(), 0, 0);
                // restore the drawing context to its original state
                ctx.rotate(-angle);
                ctx.translate(-x, -(height - margin + labelHeight));
            }

            // draw X and Y axis
            ctx.beginPath();
            ctx.strokeStyle = '#001219';
            ctx.moveTo(margin, margin);
            ctx.lineTo(margin, height - margin);
            ctx.lineTo(width - margin, height - margin);
            ctx.stroke();

            // draw second Y axis
            ctx.beginPath();
            ctx.strokeStyle = '#001219';
            ctx.moveTo(width - margin, margin);
            ctx.lineTo(width - margin, height - margin);
            ctx.lineTo(margin, height - margin);
            ctx.stroke();

            if (chart.isVisible) {
                // begin draw line of chart
                ctx.beginPath();

                chart.data.forEach((item, i) => {
                    // find relative position of point
                    const x =
                        margin +
                        (new Date(item.t).getTime() - minDate.getTime()) *
                            xScale;
                    const y = height - margin - (item.v - minValue) * yScale;

                    // if it is first point, move to it
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                // end draw line of chart
                ctx.strokeStyle = '#fb8500';
                ctx.lineWidth = 1;
                ctx.stroke();
                // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineTo(width - margin, height - margin);
                ctx.lineTo(margin, height - margin);
            }

            if (chart2.isVisible) {
                // begin draw line of chart
                ctx.beginPath();

                chart2.data.forEach((item, i) => {
                    // find relative position of point
                    const x =
                        margin +
                        (new Date(item.t).getTime() - minDate.getTime()) *
                            xScale;
                    const y = height - margin - (item.v - minValue2) * yScale2;

                    // if it is first point, move to it
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                // end draw line of chart
                ctx.strokeStyle = '#457b9d';
                ctx.lineWidth = 1;
                ctx.stroke();
                // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineTo(width - margin, height - margin);
                ctx.lineTo(margin, height - margin);
            }
        }
    };

    const drawLegend = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.font = '12px Inter, Avenir, Helvetica, Arial, sans-serif';
            ctx.fillStyle = '#001219';
            ctx.lineWidth = 12;
            ctx.textAlign = 'left';

            // Температура
            ctx.fillText(chart.title, 24, 16);
            ctx.beginPath();
            ctx.moveTo(8, 20);
            ctx.lineTo(20, 20);
            ctx.strokeStyle = '#fb8500';
            ctx.stroke();

            // Осадки
            ctx.fillText(chart2.title, 136, 16);
            ctx.beginPath();
            ctx.moveTo(120, 20);
            ctx.lineTo(132, 20);
            ctx.strokeStyle = '#457b9d';
            ctx.stroke();
        }
    };

    useEffect(() => {
        drawChart();
        drawLegend();
    }, [chart, chart2]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};
export default MultiAxesChart;
