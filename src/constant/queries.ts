/* =================== CPU QUERIES ======================*/
export const COUNT_CPU_QUERY = (hostname: string) =>
	`count(count(node_cpu_seconds_total{instance="${hostname}",job="nodes"}) by (cpu))`;
export const getNodeCPUSecTotalQuery = (
	hostname: string,
	interval: string | number,
	query: { [key: string]: Array<string> },
	cpu?: number
) => {
	return `sum by(instance) (irate(node_cpu_seconds_total{instance=\"${hostname}\",${Object.keys(
		query
	).map((key) => {
		return `${query[key].map((value) => {
			if (value[0] == "!") {
				return `${key}!="${value.slice(1)}"`;
			} else if (value[0] == "~") {
				return `${key}=${value}`;
			} else {
				return `${key}="${value}"`;
			}
		})}`;
	})}}[${interval}])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance=\"${hostname}\",${
		query.cpu && query.cpu.length > 0 ? `cpu="${query.cpu[0]}"` : ""
	}}[${interval}])))`;
};

export const CPU_SYSTEM_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}", mode="system", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;
export const CPU_USER_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}", mode="user", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;
export const CPU_IDLE_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}", mode="idle", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;
export const CPU_IOWAIT_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}", mode="iowait", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;
export const CPU_IRQ_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}", mode=~".*irq", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;
export const CPU_OTHER_QUERY = (hostname: string, cpu?: number) =>
	`sum by(instance) (irate(node_cpu_seconds_total{instance="${hostname}",mode!='idle',mode!='user',mode!='system',mode!='iowait',mode!='irq',mode!='softirq', ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${hostname}", ${
		cpu == undefined ? "" : `cpu=\"${cpu}\"`
	}}[5m])))`;

/* =================== RAM QUERIES ======================*/
export const RAM_TOTAL_QUERY = (hostname: string) =>
	`node_memory_MemTotal_bytes{instance="${hostname}",job="nodes"}`;
export const RAM_USED_QUERY = (hostname: string) =>
	`node_memory_MemTotal_bytes{instance="${hostname}"} - node_memory_MemFree_bytes{instance="${hostname}"} - (node_memory_Cached_bytes{instance="${hostname}"} + node_memory_Buffers_bytes{instance="${hostname}"} + node_memory_SReclaimable_bytes{instance="${hostname}"})`;
export const RAM_CACHE_BUFFER_QUERY = (hostname: string) =>
	`node_memory_Cached_bytes{instance="${hostname}"} + node_memory_Buffers_bytes{instance="${hostname}"} + node_memory_SReclaimable_bytes{instance="${hostname}"}`;
export const RAM_FREE_QUERY = (hostname: string) =>
	`node_memory_MemFree_bytes{instance="${hostname}"}`;
export const SWAP_USED_QUERY = (hostname: string) =>
	`(node_memory_SwapTotal_bytes{instance="${hostname}"} - node_memory_SwapFree_bytes{instance="${hostname}"})`;
