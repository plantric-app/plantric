import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CreateProject = lazy(() => import('./createProject'));

/**
 * Project Dashboard App  Route
 */
const CreateProjectRoute: FuseRouteItemType = {
	path: '/create/project',
	element: <CreateProject />
};

export default CreateProjectRoute;
