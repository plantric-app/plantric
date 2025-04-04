import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicSignInPage = lazy(() => import('./ClassicSignInPage'));
const ModernSignInPage = lazy(() => import('./ModernSignInPage'));
const ModernReversedSignInPage = lazy(() => import('./ModernReversedSignInPage'));
const SplitScreenSignInPage = lazy(() => import('./SplitScreenSignInPage'));
const SplitScreenReversedSignInPage = lazy(() => import('./SplitScreenReversedSignInPage'));
const FullScreenSignInPage = lazy(() => import('./FullScreenSignInPage'));
const FullScreenReversedSignInPage = lazy(() => import('./FullScreenReversedSignInPage'));

/**
 * SignIn Pages Route
 */
const SignInPagesRoute: FuseRouteItemType = {
	path: 'pages/authentication/sign-in',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicSignInPage />
		},
		{
			path: 'modern',
			element: <ModernSignInPage />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedSignInPage />
		},
		{
			path: 'split-screen',
			element: <SplitScreenSignInPage />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedSignInPage />
		},
		{
			path: 'full-screen',
			element: <FullScreenSignInPage />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedSignInPage />
		}
	]
};

export default SignInPagesRoute;
