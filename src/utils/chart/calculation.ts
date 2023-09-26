export const bytesToGigabytes = (bytes: number | string) => {
	return Number(bytes) / Math.pow(1024, 3);
};
