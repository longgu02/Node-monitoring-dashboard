import { instantQuery, queryRange } from "@/services/prometheus";
import {
	formatDataPrometheus,
	formatPrometheusClient,
	formatPrometheusDataSeries,
} from "./utils";
import {
	COUNT_CPU_QUERY,
	CPU_IDLE_QUERY,
	CPU_IOWAIT_QUERY,
	CPU_IRQ_QUERY,
	CPU_OTHER_QUERY,
	CPU_SYSTEM_QUERY,
	CPU_USER_QUERY,
	RAM_CACHE_BUFFER_QUERY,
	RAM_FREE_QUERY,
	RAM_TOTAL_QUERY,
	RAM_USED_QUERY,
	SWAP_USED_QUERY,
	getNodeCPUSecTotalQuery,
} from "@/constant/queries";
import { bytesToGigabytes } from "./calculation";
import { PrometheusQueryDate } from "prometheus-query";

export const getCPUTotal = async (
	hostname: string,
	// interval: number,
	start: PrometheusQueryDate,
	end: PrometheusQueryDate,
	cpu?: number | string
) => {
	const data: { [key: string]: any } = {};
	// const start = new Date().getTime() - interval * 1000;
	// const end = new Date();
	// System
	await queryRange(
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu ? { mode: ["system"], cpu: [String(cpu)] } : { mode: ["system"] }
		),
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
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu ? { mode: ["user"], cpu: [String(cpu)] } : { mode: ["user"] }
		),
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
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu ? { mode: ["idle"], cpu: [String(cpu)] } : { mode: ["idle"] }
		),
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
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu ? { mode: ["iowait"], cpu: [String(cpu)] } : { mode: ["iowait"] }
		),
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
		// getNodeCPUSecTotalQuery(hostname, "5m", { mode: "user" }),
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu ? { mode: ["idle"], cpu: [String(cpu)] } : { mode: ['~".*irq"'] }
		),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234",mode=~".*irq"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }[5m])))`,
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
		// getNodeCPUSecTotalQuery(hostname, "5m", { mode: "idle" }),
		getNodeCPUSecTotalQuery(
			hostname,
			"5m",
			cpu
				? { mode: ["idle"], cpu: [String(cpu)] }
				: { mode: ["!idle", "!user", "!system", "!iowait", "!irq", "!softirq"] }
		),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\", mode!='idle',mode!='user',mode!='system',mode!='iowait',mode!='irq',mode!='softirq'${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])))`,
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

export const getCPUCoreMetrics = async (
	hostname: string,
	start: PrometheusQueryDate,
	end: PrometheusQueryDate,
	cpu?: number | string
) => {
	const data: { [key: string]: any } = {};
	// System
	await queryRange(
		CPU_SYSTEM_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="system", cpu="3"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234", cpu="3"}[5m])))`,
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
		CPU_USER_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="user", cpu="3"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234", cpu="3"}[5m])))`,
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
		CPU_IDLE_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="idle", cpu="3"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234", cpu="3"}[5m])))`,
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
		CPU_IOWAIT_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode="iowait", cpu="3"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234", cpu="3"}[5m])))`,
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
		// getNodeCPUSecTotalQuery(hostname, "5m", { mode: "user" }),
		CPU_IRQ_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234", mode=~".*irq", cpu="3"}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234", cpu="3"}[5m])))`,
		// `sum by(instance) (irate(node_cpu_seconds_total{instance="10.255.246.32:1234",mode=~".*irq"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="10.255.246.32:1234"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }[5m])))`,
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
		// getNodeCPUSecTotalQuery(hostname, "5m", { mode: "idle" }),
		CPU_OTHER_QUERY(hostname, Number(cpu)),
		// `sum by(instance) (irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\", mode!='idle',mode!='user',mode!='system',mode!='iowait',mode!='irq',mode!='softirq'${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance=\"10.255.246.32:1234\"${
		// 	cpu && ',cpu="' + cpu + '"'
		// }}[5m])))`,
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

export const getRAMMetrics = async (hostname: string, interval: number) => {
	const data: { [key: string]: any } = {};
	const start = new Date().getTime() - interval * 1000;
	const end = new Date();

	await queryRange(RAM_FREE_QUERY(hostname), start, end, "15s")
		.then((res) => {
			data.free = formatPrometheusClient(res.result[0], bytesToGigabytes);
		})
		.catch((err) => {
			console.error(err);
		});
	await queryRange(RAM_USED_QUERY(hostname), start, end, "15s")
		.then((res) => {
			data.used = formatPrometheusClient(res.result[0], bytesToGigabytes);
		})
		.catch((err) => {
			console.error(err);
		});
	await queryRange(RAM_TOTAL_QUERY(hostname), start, end, "15s")
		.then((res) => {
			data.total = formatPrometheusClient(res.result[0], bytesToGigabytes);
		})
		.catch((err) => {
			console.error(err);
		});
	await queryRange(RAM_CACHE_BUFFER_QUERY(hostname), start, end, "15s")
		.then((res) => {
			data.cache = formatPrometheusClient(res.result[0], bytesToGigabytes);
		})
		.catch((err) => {
			console.error(err);
		});
	await queryRange(SWAP_USED_QUERY(hostname), start, end, "15s")
		.then((res) => {
			data.swap = formatPrometheusClient(res.result[0], bytesToGigabytes);
		})
		.catch((err) => {
			console.error(err);
		});
	return data;
};

export const getCPUCount = async (hostname: string) => {
	let result = -1;
	await instantQuery(COUNT_CPU_QUERY(hostname)).then((res) => {
		result = res.result[0].value.value;
	});
	return result;
};
