import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import RegisterPage from './RegisterPage'

const RegisterPageRoute: FuseRouteItemType = {
	path: 'register',
	element: <RegisterPage />,
	settings: {
		layout: {
			config: {
				navbar: { display: false },
				toolbar: { display: false },
				footer: { display: false },
				leftSidePanel: { display: false },
				rightSidePanel: { display: false }
			}
		}
	},
	auth: authRoles.onlyGuest
};
console.log('[ROUTE] RegisterPageRoute loaded');

export default RegisterPageRoute;
