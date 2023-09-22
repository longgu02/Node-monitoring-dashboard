import { queryRange } from "@/services/prometheus";
import { formatDataPrometheus, formatPrometheusDataSeries } from "./utils";

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
