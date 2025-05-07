import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CreateCompany = lazy(() => import('./createCompany'));

/**
 * Project Dashboard App  Route
 */
const CreateCompanyRoute: FuseRouteItemType = {
	path: '/create/company',
	element: <CreateCompany />
};

export default CreateCompanyRoute;
