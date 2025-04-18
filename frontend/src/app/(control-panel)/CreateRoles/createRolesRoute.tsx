import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CreateRoles = lazy(() => import('./createRoles'));

/**
 * Project Dashboard App  Route
 */
const CreateRolesRoute: FuseRouteItemType = {
	path: '/create/roles',
	element: <CreateRoles />
};

export default CreateRolesRoute;