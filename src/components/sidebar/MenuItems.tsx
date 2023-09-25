import {
	IconAperture,
	IconCopy,
	IconLayoutDashboard,
	IconLogin,
	IconMoodHappy,
	IconTypography,
	IconUserPlus,
	IconUser,
	IconCurrencyDollar,
	IconChartAreaLine,
	IconChartArcs,
	IconChartAreaFilled,
	IconChartLine,
	IconChartPie,
	IconUserCheck,
} from "@tabler/icons-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SourceIcon from "@mui/icons-material/Source";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import { uniqueId } from "lodash";

const Menuitems = [
	{
		navlabel: true,
		subheader: "Home",
	},

	{
		id: uniqueId(),
		title: "Dashboard",
		icon: IconLayoutDashboard,
		href: "/",
	},
	{
		navlabel: true,
		subheader: "Monitoring",
	},
	{
		id: uniqueId(),
		title: "Node Monitoring",
		icon: IconChartLine,
		href: "/node-monitoring",
	},
];

export default Menuitems;
