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
const DiskAllocation = (props: CPUOverallProps) => {
	const { data, title } = props;
	// generateDataSet(data["idle"]);
	const options: Highcharts.Options = {
		chart: {
			type: "pie",
		},
		title: {
			text: title,
			align: "left",
		},
		accessibility: {
			point: {
				valueSuffix: "%",
			},
		},
		tooltip: {
			pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: "pointer",
				depth: 35,
				dataLabels: {
					enabled: true,
					format: "{point.name}",
				},
			},
		},
		series: [
			{
				type: "pie",
				name: "Allocated",
				data: [
					["/", Number(data.size["/"])],
					["/boot", 18],
					{
						name: "Available",
						y: data.avail,
						sliced: true,
						selected: true,
					},
					["/run", Number(data.size["/run"])],
					["/run/lock", Number(data.size["/run/lock"])],
					["/run/snapd/ns", Number(data.size["/run/snapd/ns"])],
					["/run/user/1000", Number(data.size["/run/user/1000"])],
				],
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

export default DiskAllocation;
