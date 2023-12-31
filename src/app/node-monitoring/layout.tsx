"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, Typography, styled } from "@mui/material";
import { useState } from "react";
import theme from "@/theme";
import FullLayout from "@/layout/FullLayout";

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

export default function NodeMonitoringLayout(props: {
	children: React.ReactNode;
}) {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	return <FullLayout title="Node">{props.children}</FullLayout>;
}
