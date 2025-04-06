import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, MouseEvent, useState } from 'react';
import TableHead from '@mui/material/TableHead';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken, lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import { useDeleteECommerceOrdersMutation } from '../ECommerceApi';

/**
 * The row type.
 */
// type rowType = {
// 	id: string;
// 	align: 'left' | 'center' | 'right';
// 	disablePadding: boolean;
// 	label: string;
// 	sort: boolean;
// };

/**
 * The rows.
 */
// const rows: rowType[] = [
// 	{
// 		id: 'id',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'ID',
// 		sort: true
// 	},
// 	{
// 		id: 'reference',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'Reference',
// 		sort: true
// 	},
// 	{
// 		id: 'customer',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'Customer',
// 		sort: true
// 	},
// 	{
// 		id: 'total',
// 		align: 'right',
// 		disablePadding: false,
// 		label: 'Total',
// 		sort: true
// 	},
// 	{
// 		id: 'payment',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'Payment',
// 		sort: true
// 	},
// 	{
// 		id: 'status',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'Status',
// 		sort: true
// 	},
// 	{
// 		id: 'date',
// 		align: 'left',
// 		disablePadding: false,
// 		label: 'Date',
// 		sort: true
// 	}
// ];

// type OrdersTableHeadProps = {
// 	onRequestSort: (event: MouseEvent<HTMLSpanElement>, property: string) => void;
// 	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
// 	tableOrder: {
// 		direction: 'asc' | 'desc';
// 		id: string;
// 	};
// 	selectedOrderIds: string[];
// 	rowCount: number;
// 	onMenuItemClick: () => void;
// };

/**
 * The orders table head.
 */
function ProjectTableHead() {
	
	return (
		<p>Project table head component</p>
	);
}

export default ProjectTableHead;
