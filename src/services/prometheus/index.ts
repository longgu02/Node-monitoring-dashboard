import { createClient } from "../../utils/client/client";
import { PrometheusDriver, PrometheusQueryDate } from "prometheus-query";

const prom = new PrometheusDriver({
	endpoint: "http://localhost:9090",
	baseURL: "/api/v1", // default value
});

const prometheusClient = createClient("http://localhost:9090/api/v1");

// const rangeQuery = (query: String) => {
// 	prom.rangeQuery();
// };

export const queryRange = (
	query: any,
	start: PrometheusQueryDate,
	end: PrometheusQueryDate,
	step: string
) => {
	let queryBuilder = "";
	Object.keys(query).map((key) => {
		queryBuilder += `${key}=\"${query[key]}\"`;
	});
	return prom.rangeQuery(query, start, end, step);
	// const _promise = prometheusClient.get(`/query_range`, {
	// 	params: {
	// 		query: `${metric}{${queryBuilder}}`,
	// 		start: start,
	// 		end: end,
	// 		step: step,
	// 	},
	// });
	// return _promise;
};

export const instantQuery = (query: any) => {
	return prom.instantQuery(query);
};
