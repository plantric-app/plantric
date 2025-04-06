import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import OrdersHeader from './ProjectHeader';
import OrdersTable from './ProjectTable';

/**
 * The orders page.
 */
function ViewProject() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full flex flex-col px-4">
				<OrdersHeader />
				<OrdersTable />
			</div>
		</>
	);
}

export default ViewProject;
