import { queryRange } from "@/services/prometheus";
import {
	formatDataPrometheus,
	formatPrometheusClient,
	formatPrometheusDataSeries,
} from "./utils";

export const getPercentage = (data: any) => {
	let result: { [key: string]: any } = {};
	let total = 0;
	Object.keys(data).map((key) => {
		total += Number(data[key]);
	});
	Object.keys(data).map((key) => {
		result[key] = ((Number(data[key]) * 100) / total).toFixed(4);
	});
	return result;
};

export const getTotalDiskBytes = (available: any, size: any) => {
	let total: { [key: string]: number } = {};
	Object.keys(available).map((key: any) => {
		total[key] = Number(available[key]) + Number(size[key]);
	});
	return total;
};

export const getCPUTotal = async (interval: number) => {
	const data: { [key: string]: any } = {};
	const start = new Date().getTime() - interval * 1000;
	const end = new Date();
	// System
	await queryRange(
		"node_cpu_seconds_total",
		'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234",mode="system"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.system = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	// User
	await queryRange(
		"node_cpu_seconds_total",
		'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="user"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.user = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	// Idle
	await queryRange(
		"node_cpu_seconds_total",
		'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="idle"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.idle = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	// Iowait
	await queryRange(
		"node_cpu_seconds_total",
		'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="iowait"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.iowait = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	// Irq
	await queryRange(
		"node_cpu_seconds_total",
		'sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234",mode=~".*irq"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"}[5m])))',
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.irq = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	// Other
	await queryRange(
		"node_cpu_seconds_total",
		"sum by(instance) (irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\", mode!='idle',mode!='user',mode!='system',mode!='iowait',mode!='irq',mode!='softirq'}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\"}[5m])))",
		start,
		end,
		"15s"
	)
		.then((res: any) => {
			data.other = formatPrometheusClient(res.result[0]);
		})
		.catch((err: any) => {
			console.error(err);
		});
	return data;
};
