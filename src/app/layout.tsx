import { store } from "@/redux/store";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Camera Monitoring",
	description: "Camera Monitoring Initial",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
