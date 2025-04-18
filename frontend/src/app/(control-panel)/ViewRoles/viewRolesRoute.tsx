import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ViewRoles = lazy(() => import('./viewRoles'));

/**
 * Project Dashboard App  Route
 */
const ViewRolesRoute: FuseRouteItemType = {
	path: '/view/roles',
	element: <ViewRoles />
};

export default ViewRolesRoute;
