import React, { useRef, useEffect } from 'react';
import { ItemData } from '../../types';

interface Props {
    width?: number;
    height?: number;
    data: ItemData[]; // data for first chart
    data2: ItemData[]; // data for second chart
    temperatureIsSelected?: boolean;
    precipitationIsSelected?: boolean;
}

const Chart: React.FC<Props> = (props: Props) => {
    const {
        data,
        data2,
        width = 800,
        height = 600,
        temperatureIsSelected = true,
        precipitationIsSelected = true,
    } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawChart = (
        precipitationIsVisible = true,
        temperatureIsVisible = true,
    ) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx && canvas && !!data.length && !!data2.length) {
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const width = canvas.width;
            const height = canvas.height;
            const margin = 50;

            // get min and max temperatures
            const temperatures = data.map((item) => item.v);
            const dates = data.map((item) => item.t);
            // add two degrees above and below, so there is "air" around the chart
            const minTemp = Math.min(...temperatures) - 2;
            const maxTemp = Math.max(...temperatures) + 2;

            // get min and max precipitation
            const precipitations = data2.map((item) => item.v);
            // add two degrees above and below, so there is "air" around the chart
            const minPre = Math.min(...precipitations);
            const maxPre = Math.max(...precipitations);

            // get min and max dates
            const minDate = new Date(data[0].t);
            const maxDate = new Date(data[data.length - 1].t);

            // get ranges for both axes
            const xRange = maxDate.getTime() - minDate.getTime();
            const yRange = maxTemp - minTemp;
            const yRange2 = maxPre - minPre;

            // get scales for both axes
            const xScale = (width - margin * 2) / xRange;
            const yScale = (height - margin * 2) / yRange;
            const yScale2 = (height - margin * 2) / yRange2;

            // draw label for first Y axis
            const numLabels = 20;
            const yStep = yRange / numLabels;
            const yStep2 = yRange2 / numLabels;
            ctx.font = '10px Inter, Avenir, Helvetica, Arial, sans-serif';
            ctx.fillStyle = '#000000';
            ctx.lineWidth = 1;
            // align to the right for ease of comparison
            ctx.textAlign = 'right';
            for (let i = 0; i <= numLabels; i++) {
                const temp = minTemp + i * yStep;
                const y = height - margin - (temp - minTemp) * yScale;
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
                const temp2 = minPre + i * yStep2;
                const y2 = height - margin - (temp2 - minPre) * yScale2;
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
            ctx.strokeStyle = '#000000';
            ctx.moveTo(margin, margin);
            ctx.lineTo(margin, height - margin);
            ctx.lineTo(width - margin, height - margin);
            ctx.stroke();

            // draw second Y axis
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            ctx.moveTo(width - margin, margin);
            ctx.lineTo(width - margin, height - margin);
            ctx.lineTo(margin, height - margin);
            ctx.stroke();

            if (temperatureIsVisible) {
                // begin draw line of chart
                ctx.beginPath();

                data.forEach((item, i) => {
                    // find relative position of point
                    const x =
                        margin +
                        (new Date(item.t).getTime() - minDate.getTime()) *
                            xScale;
                    const y = height - margin - (item.v - minTemp) * yScale;

                    // if it is first point, move to it
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                // end draw line of chart
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 1;
                ctx.stroke();
                // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineTo(width - margin, height - margin);
                ctx.lineTo(margin, height - margin);
            }

            if (precipitationIsVisible) {
                // begin draw line of chart
                ctx.beginPath();

                data2.forEach((item, i) => {
                    // find relative position of point
                    const x =
                        margin +
                        (new Date(item.t).getTime() - minDate.getTime()) *
                            xScale;
                    const y = height - margin - (item.v - minPre) * yScale2;

                    // if it is first point, move to it
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                // end draw line of chart
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.stroke();
                // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineTo(width - margin, height - margin);
                ctx.lineTo(margin, height - margin);
            }
        }
    };

    useEffect(() => {
        drawChart(precipitationIsSelected, temperatureIsSelected);
    }, [data, precipitationIsSelected, temperatureIsSelected]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};
export default Chart;
