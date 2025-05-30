import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicConfirmationRequiredPage = lazy(() => import('./ClassicConfirmationRequiredPage'));
const ModernConfirmationRequiredPage = lazy(() => import('./ModernConfirmationRequiredPage'));
const ModernReversedConfirmationRequiredPage = lazy(() => import('./ModernReversedConfirmationRequiredPage'));
const SplitScreenConfirmationRequiredPage = lazy(() => import('./SplitScreenConfirmationRequiredPage'));
const SplitScreenReversedConfirmationRequiredPage = lazy(() => import('./SplitScreenReversedConfirmationRequiredPage'));
const FullScreenConfirmationRequiredPage = lazy(() => import('./FullScreenConfirmationRequiredPage'));
const FullScreenReversedConfirmationRequiredPage = lazy(() => import('./FullScreenReversedConfirmationRequiredPage'));

/**
 * Confirmation Required Pages Route
 */
const ConfirmationRequiredPagesRoute: FuseRouteItemType = {
	path: 'pages/authentication/confirmation-required',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicConfirmationRequiredPage />
		},
		{
			path: 'modern',
			element: <ModernConfirmationRequiredPage />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedConfirmationRequiredPage />
		},
		{
			path: 'split-screen',
			element: <SplitScreenConfirmationRequiredPage />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedConfirmationRequiredPage />
		},
		{
			path: 'full-screen',
			element: <FullScreenConfirmationRequiredPage />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedConfirmationRequiredPage />
		}
	]
};

export default ConfirmationRequiredPagesRoute;
