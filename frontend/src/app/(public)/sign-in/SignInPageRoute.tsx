import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import SignInPage from './SignInPage';

const SignInPageRoute: FuseRouteItemType = {
	path: 'sign-in',
	element: <SignInPage />,
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest // []
};

// Create a root route that also serves the sign-in page
// export const RootSignInPageRoute: FuseRouteItemType = {
// 	path: '', // Empty string represents the root path '/'
// 	element: <SignInPage />,
// 	settings: {
// 		layout: {
// 			config: {
// 				navbar: {
// 					display: false
// 				},
// 				toolbar: {
// 					display: false
// 				},
// 				footer: {
// 					display: false
// 				},
// 				leftSidePanel: {
// 					display: false
// 				},
// 				rightSidePanel: {
// 					display: false
// 				}
// 			}
// 		}
// 	},
// 	auth: authRoles.onlyGuest // []
// };

export default SignInPageRoute;
