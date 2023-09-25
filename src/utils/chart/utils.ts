import { getPercentage } from "./calculation";

export const formatDataPrometheus = (rawData: any) => {
	let result: any = {};
	const cpuData = rawData.reduce((cpuGroup: any, item: any) => {
		const group = cpuGroup[item.metric.cpu] || [];
		group.push(item);
		cpuGroup[item.metric.cpu] = group;
		return cpuGroup;
	}, {});
	Object.keys(cpuData).map((cpu) => {
		cpuData[cpu].map((item: any) => {
			item.values.map((value: [Number, String]) => {
				cpuData[cpu].push({ time: value[0], [item.metric.mode]: value[1] });
			});
			const temp = cpuData[cpu].reduce((cpuDataGroup: any, value: any) => {
				if (value.time != undefined) {
					const group = cpuDataGroup[value.time] || {};
					group[Object.keys(value)[1]] = value[Object.keys(value)[1]];
					// ({
					// 	[Object.keys(value)[1]]: value[Object.keys(value)[1]],
					// });
					cpuDataGroup[value.time] = group;
				}
				return cpuDataGroup;
			}, {});
			result[cpu] = temp;
		});
	});
	return result;
};

export const formatSeries = (formattedData: any) => {
	let result: { [key: string]: any } = {};
	let temp: { [key: string]: any[] } = {};
	Object.keys(formattedData).map((key) => {
		Object.keys(formattedData[key]).map((time) => {
			Object.keys(formattedData[key][time]).map((attr) => {
				let curSeries = temp[attr] || [];
				curSeries.push([
					Number(time) * 1000,
					Number(formattedData[key][time][attr]),
				]);
				temp[attr] = curSeries;
			});
		});
		result[key] = temp;
		temp = {};
	});
	return result;
};

export const formatPrometheusDataSeries = (rawData: any) => {
	return formatSeries(formatDataPrometheus(rawData));
};

export const formatPercentageDataSeries = (rawData: any) => {
	const formattedData = formatDataPrometheus(rawData);
	Object.keys(formattedData).map((key) => {
		Object.keys(formattedData[key]).map((time) => {
			formattedData[key][time] = getPercentage(formattedData[key][time]);
		});
	});
	return formatSeries(formattedData);
};

export const getCPUTotal = (rawData: any) => {
	const formattedData = formatDataPrometheus(rawData);
	let result: { [key: string | number]: any } = {};
	Object.keys(formattedData).map((key) => {
		Object.keys(formattedData[key]).map((time) => {
			let temp = result[time] || {};
			Object.keys(formattedData[key][time]).map((value) => {
				temp[value] == undefined
					? (temp[value] = Number(formattedData[key][time][value]))
					: (temp[value] += Number(formattedData[key][time][value]));
			});
			result[time] = temp;
		});
	});
	let temp: { [key: string]: any[] } = {};
	console.log("formatted", result);
	Object.keys(result).map((time) => {
		Object.keys(result[time]).map((attr) => {
			let curSeries = temp[attr] || [];
			curSeries.push([Number(time) * 1000, Number(result[time][attr])]);
			temp[attr] = curSeries;
		});
	});
	result = temp;
	// temp = {};
	return result;
};

export const formatPremetheusSeries = (rawData: any, groupByAttr: string) => {
	let result: { [x: number | string]: any }[] = [];
	rawData.map((item: any) => {
		result[item["metric"][groupByAttr]] = item["values"];
	});
	return result;
};

export const formatPieChart = (rawData: any, groupByAttr: string) => {
	let result: { [x: number | string]: any }[] = [];
	rawData.map((item: any) => {
		result[item["metric"][groupByAttr]] =
			item["values"][item["values"].length - 1][1];
	});
	return result;
};

export const formatPrometheusClient = (rawData: any) => {
	let result: [number, any][] = [];
	rawData.values.map((item: any) => {
		result.push([new Date(item["time"]).getTime(), item["value"]]);
	});
	return result;
};
