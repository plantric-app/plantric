import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ViewPermission = lazy(() => import('./viewPermission'));

/**
 * Project Dashboard App  Route
 */
const ViewPermissionRoute: FuseRouteItemType = {
	path: '/view/permission',
	element: <ViewPermission />
};

export default ViewPermissionRoute;