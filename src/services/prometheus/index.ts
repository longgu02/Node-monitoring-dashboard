import { createClient } from "../../utils/client/client";

const prometheusClient = createClient("http://localhost:9090/api/v1");

export const queryRange = (
	query: any,
	start: string,
	end: string,
	step: string
) => {
	let queryBuilder = "";
	Object.keys(query).map((key) => {
		queryBuilder += `${key}=\"${query[key]}\"`;
	});
	const _promise = prometheusClient.get(`/query_range`, {
		params: {
			query: `node_cpu_seconds_total{${queryBuilder}}`,
			start: start,
			end: end,
			step: step,
		},
	});
	return _promise;
};
