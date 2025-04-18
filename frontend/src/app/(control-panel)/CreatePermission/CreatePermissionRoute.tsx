import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CreatePermission = lazy(() => import('./createPermission'));

/**
 * Project Dashboard App  Route
 */
const CreatePermissionRoute: FuseRouteItemType = {
	path: '/create/permission',
	element: <CreatePermission />
};

export default CreatePermissionRoute;
