"use client";
import { ReactElement, useEffect, useState, useCallback } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Collapse,
	Grid,
	Typography,
} from "@mui/material";
import CPUOverall from "@/components/Charts/CPUOverall";
import { queryRange } from "@/services/prometheus";
import {
	formatDataPrometheus,
	formatPercentageDataSeries,
	formatPrometheusDataSeries,
	getCPUTotal,
} from "@/utils/chart/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getPercentage } from "@/utils/chart/calculation";

const pageData = [
	{ name: "Long", price: 10000 },
	{ name: "Minh", price: 2000 },
	{ name: "Vanh", price: 3000 },
];

export default function NodeMonitoring() {
	const [cpuData, setCPUData] = useState<{ [key: number | string]: any }>({});
	const [cpuTotal, setCPUTotal] = useState<{ [key: number | string]: any }>({});
	const [isOpenCpu, setOpenCpu] = useState<boolean>();

	const fetch = useCallback(() => {
		let rawData;
		queryRange(
			{ hostname: "10.255.246.32" },
			new Date(Date.now() - 86400000 * 1).toISOString(),
			new Date().toISOString(),
			"15s"
		)
			.then((res: any) => {
				rawData = res.data.result;
				// console.log("total", getCPUTotal(rawData));
				setCPUTotal(getCPUTotal(rawData));
				// console.log(formatDataPrometheus(rawData));
				setCPUData(formatPrometheusDataSeries(rawData));
			})
			.catch((err: any) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		fetch();
		const intervalId = setInterval(fetch, 120000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<Box component="div">
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>CPU Usage</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Box>
						<CPUOverall data={cpuTotal} title={`CPU Overall`} />
					</Box>
					<Box>
						{Object.keys(cpuData).length > 0 && (
							<Grid container>
								{Object.keys(cpuData).map((cpu) => (
									<Grid
										item
										xs={Object.keys(cpuData).length % 2 == 0 ? 6 : 4}
										key={cpu}
									>
										<CPUOverall
											data={cpuData[cpu]}
											title={`CPU Core ${Number(cpu) + 1}`}
										/>
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography>Accordion 2</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
						malesuada lacus ex, sit amet blandit leo lobortis eget.
					</Typography>
				</AccordionDetails>
			</Accordion>
		</Box>
	);
}
