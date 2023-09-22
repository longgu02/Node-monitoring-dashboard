import { Box, Container, Typography } from "@mui/material";

export default function NodeMonitoringLayout(props: {
	children: React.ReactNode;
}) {
	return (
		<Box>
			<Typography variant="h3">Node Monitoring</Typography>
			<Container>{props.children}</Container>
		</Box>
	);
}
