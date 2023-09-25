"use client";
import { Box } from "@mui/material";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import moment from "moment";

interface CPUOverallProps {
	data: any;
	title: string;
}

const generateDataSet = (raw: number[][]) => {
	const temp: number[][] = [];
	const dayTick = 1000 * 60;
	raw.forEach((d: number[], index: any) => {
		d[0] *= 1000;
		if (index != 0) {
			if (d[0] - dayTick === raw[index - 1][0]) {
				temp.push(d);
			} else {
				let lb = raw[index - 1][0];
				const ub = d[0];
				while (lb != ub) {
					lb += dayTick;
					temp.push([lb, 0]);
				}
			}
		} else {
			temp.push(d);
		}
	});
	console.log(temp);
	return temp;
};

const CPUOverall = (props: CPUOverallProps) => {
	const { data, title } = props;
	// generateDataSet(data["idle"]);
	const options: Highcharts.Options = {
		credits: {
			enabled: false,
		},
		chart: {
			type: "area",
		},
		xAxis: {
			type: "datetime",
		},
		yAxis: {
			labels: {
				format: "{value}%",
			},
		},
		time: {
			useUTC: false,
		},
		accessibility: {
			point: {
				valueDescriptionFormat:
					"{index}. {point.category}, {point.y:,.1f} billions, {point.percentage:.1f}%.",
			},
		},
		title: {
			text: title,
		},
		tooltip: {
			shared: true,
			headerFormat:
				'<span style="font-size:12px"><b>{point.key}</b></span><br>',
			pointFormat:
				'<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.5f}%</b><br/>',
		},
		plotOptions: {
			series: {
				pointStart: Date.now() - 86400000 * 1.5,
			},
			area: {
				stacking: "percent",
				lineColor: "#666666",
				lineWidth: 0.5,
				marker: {
					lineWidth: 0.5,
					lineColor: "#666666",
				},
			},
		},
		series: [
			{
				type: "area",
				name: "idle",
				data: data["idle"],
				pointInterval: 36e5,
			},
			{
				type: "area",
				name: "iowait",
				data: data["iowait"],
			},
			{
				type: "area",
				name: "user",
				data: data["user"],
			},
			{
				type: "area",
				name: "Irq",
				data: data["irq"],
			},
			{
				type: "area",
				name: "system",
				data: data["system"],
			},
			{
				type: "area",
				name: "other",
				data: data["other"],
			},
		],
	};
	console.log(data);
	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
	return (
		<Box component="div">
			{" "}
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
				ref={chartComponentRef}
				// {...props}
			/>
		</Box>
	);
};

export default CPUOverall;
