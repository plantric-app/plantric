import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicResetPasswordPage = lazy(() => import('./ClassicResetPasswordPage'));
const ModernResetPasswordPage = lazy(() => import('./ModernResetPasswordPage'));
const ModernReversedResetPasswordPage = lazy(() => import('./ModernReversedResetPasswordPage'));
const SplitScreenResetPasswordPage = lazy(() => import('./SplitScreenResetPasswordPage'));
const SplitScreenReversedResetPasswordPage = lazy(() => import('./SplitScreenReversedResetPasswordPage'));
const FullScreenResetPasswordPage = lazy(() => import('./FullScreenResetPasswordPage'));
const FullScreenReversedResetPasswordPage = lazy(() => import('./FullScreenReversedResetPasswordPage'));

/**
 * Reset Password Pages Route
 */
const ResetPasswordPagesRoute: FuseRouteItemType = {
	path: 'pages/authentication/reset-password',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicResetPasswordPage />
		},
		{
			path: 'modern',
			element: <ModernResetPasswordPage />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedResetPasswordPage />
		},
		{
			path: 'split-screen',
			element: <SplitScreenResetPasswordPage />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedResetPasswordPage />
		},
		{
			path: 'full-screen',
			element: <FullScreenResetPasswordPage />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedResetPasswordPage />
		}
	]
};

export default ResetPasswordPagesRoute;
