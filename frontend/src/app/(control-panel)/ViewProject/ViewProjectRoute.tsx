import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const   ViewProject = lazy(() => import('./ViewProject'));

/**
 * Project Dashboard App  Route
 */
const CreateProjectRoute: FuseRouteItemType = {
	path: '/view/project',
	element: <ViewProject />
};

export default CreateProjectRoute;
