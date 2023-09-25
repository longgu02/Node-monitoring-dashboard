"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, Typography, styled } from "@mui/material";
import { useState } from "react";
import theme from "@/theme";

const MainWrapper = styled("div")(() => ({
	display: "flex",
	minHeight: "100vh",
	width: "100%",
}));

const PageWrapper = styled("div")(() => ({
	display: "flex",
	flexGrow: 1,
	paddingBottom: "60px",
	flexDirection: "column",
	zIndex: 1,
	backgroundColor: "transparent",
}));

export default function FullLayout(props: {
	children: React.ReactNode;
	title?: string;
}) {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	return (
		<MainWrapper className="mainwrapper">
			<ThemeProvider theme={theme}>
				<Sidebar
					isSidebarOpen={isSidebarOpen}
					isMobileSidebarOpen={isMobileSidebarOpen}
					onSidebarClose={() => setMobileSidebarOpen(false)}
				/>
				<PageWrapper>
					<Container>
						{props.title && <Typography variant="h3">{props.title}</Typography>}
						{props.children}
					</Container>
				</PageWrapper>
			</ThemeProvider>
		</MainWrapper>
	);
}
