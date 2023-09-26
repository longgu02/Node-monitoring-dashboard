"use client";
import { ReactElement, useEffect, useState, useCallback } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Grid,
	Typography,
} from "@mui/material";
import CPUOverall from "@/components/charts/CPUOverall";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	getCPUCount,
	getCPUTotal,
	getRAMMetrics,
	test,
} from "@/utils/chart/query";
import DiskAllocation from "@/components/charts/DiskAllocation";
import RAMOverall from "@/components/charts/RAMOverall";

export default function NodeMonitoring() {
	const [cpuData, setCPUData] = useState<{ [key: number | string]: any }>({});
	const [cpuTotal, setCPUTotal] = useState<{ [key: number | string]: any }>({});
	const [cpuCore, setCPUCore] = useState<{ [key: number | string]: any }>({});
	const [cpuCount, setCPUCount] = useState<number>();
	const [diskAllocation, setDiskAllocation] = useState<{
		[key: number | string]: any;
	}>({});
	const [ramUsage, setRAMUsage] = useState<{
		[key: number | string]: any;
	}>({});
	const [isOpenCpu, setOpenCpu] = useState<boolean>();

	const fetchCPUCoreMetrics = async (numOfCore: number) => {
		let temp: { [key: number | string]: any } = {};
		for (let i = 0; i < numOfCore; i++) {
			await test("10.255.246.32:1234", 86400, i).then((res) => {
				temp[i] = res;
				setCPUCore(temp);
			});
		}
	};

	const fetch = async () => {
		await getCPUTotal("10.255.246.32:1234", 86400).then((res) => {
			setCPUTotal(res);
		});
		await getCPUCount("10.255.246.32:1234").then((res) => {
			setCPUCount(res);
			fetchCPUCoreMetrics(res);
		});
		await getRAMMetrics("10.255.246.32:1234", 86400).then((res) => {
			setRAMUsage(res);
		});
		// await queryRange(
		// 	"node_cpu_seconds_total",
		// 	'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="user"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		// 	// new Date().getTime() - 86400000 * 1,
		// 	new Date().getTime() - 100000,
		// 	new Date(),
		// 	"15s"
		// )
		// 	.then((res: any) => {
		// 		// rawData = res.data.result;
		// 		console.log("Test format", formatPrometheusClient(res.result[0]));

		// 		// console.log("total", getCPUTotal(rawData));
		// 		// setCPUTotal(getCPUTotal(rawData));
		// 		// console.log(formatDataPrometheus(rawData));
		// 		// setCPUData(formatPrometheusClient(res.result[0]));
		// 	})
		// 	.catch((err: any) => {
		// 		console.error(err);
		// 	});
		// await queryRange(
		// 	"node_filesystem_avail_bytes",
		// 	{ instance: "10.255.246.32:1234" },
		// 	new Date(Date.now() - 15 * 1000 + 1).toISOString(),
		// 	new Date().toISOString(),
		// 	"15s"
		// )
		// 	.then((res) => {
		// 		let avail = formatPieChart(res.data.result, "mountpoint");
		// 		let totalAvail = 0;
		// 		Object.keys(avail).map((key: string) => {
		// 			totalAvail += Number(avail[key as keyof typeof avail]);
		// 		});
		// 		queryRange(
		// 			"node_filesystem_size_bytes",
		// 			{ hostname: "10.255.246.32" },
		// 			new Date(Date.now() - 15 * 1000 + 1).toISOString(),
		// 			new Date().toISOString(),
		// 			"15s"
		// 		)
		// 			.then((response) => {
		// 				let size = formatPieChart(response.data.result, "mountpoint");
		// 				console.log("done");
		// 				setDiskAllocation({ avail: totalAvail, size: size });
		// 			})
		// 			.catch((err) => {
		// 				console.error(err);
		// 			});
		// 	})
		// 	.catch((err: any) => {
		// 		console.error(err);
		// 	});
	};

	useEffect(() => {
		fetch();
		// cpuCount && ;
		const intervalId = setInterval(fetch, 120000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);
	console.log("to", cpuCore);
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
						{Object.keys(cpuCore).length > 0 && (
							<Grid container>
								{Object.keys(cpuCore).map((cpu) => (
									<Grid
										item
										xs={Object.keys(cpuCore).length % 2 == 0 ? 6 : 4}
										key={cpu}
									>
										<CPUOverall
											data={cpuCore[cpu]}
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
					<Typography>Disk Partition</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{Object.keys(diskAllocation).length > 0 && (
						<DiskAllocation data={diskAllocation} title="Disk Partition" />
					)}
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography>RAM Usage</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{Object.keys(ramUsage).length > 0 && (
						<RAMOverall data={ramUsage} title="RAM Usage" />
					)}
				</AccordionDetails>
			</Accordion>
		</Box>
	);
}
