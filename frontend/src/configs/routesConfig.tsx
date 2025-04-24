// Dynamically import all *ConfigConfig.tsx files from the app folder
import { FuseRouteConfigType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import { Navigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import { layoutConfigOnlyMain } from './layoutConfigTemplates';
import settingsConfig from './settingsConfig';
import App from '@/app/App';
import Error404Page from '@/app/(public)/404/Error404Page';
import Error401Page from '@/app/(public)/401/Error401Page';
// import SignInPageRoute, { RootSignInPageRoute } from '@/app/(public)/sign-in/SignInPageRoute';
import ProjectDashboardApp from '@/app/(control-panel)/dashboards/project/ProjectDashboardApp';
import authRoles from '@auth/authRoles';

const configModules: Record<string, unknown> = import.meta.glob('/src/app/**/*Route.tsx', {
	eager: true
});

const mainRoutes: FuseRouteConfigType[] = Object.keys(configModules)
	.map((modulePath) => {
		const moduleConfigs = (configModules[modulePath] as { default: FuseRouteConfigType | FuseRouteConfigType[] })
			.default;
		return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
	})
	.flat();

const publicRoutes: FuseRouteConfigType[] = mainRoutes.filter(
	(route) => route.auth === authRoles.onlyGuest
);

const privateRoutes: FuseRouteConfigType[] = mainRoutes.filter(
	(route) => route.auth !== authRoles.onlyGuest
);

const routes: FuseRoutesType = [
	// 🔓 Public routes like /sign-in, /register
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorBoundary />,
		children: [
			...publicRoutes,
			{
				path: '401',
				element: <Error401Page />
			},
			{
				path: '404',
				element: <Error404Page />,
				settings: { layout: layoutConfigOnlyMain },
				auth: null
			}
		]
	},

	// 🔒 Authenticated routes
	{
		path: '/',
		element: <App />,
		auth: ['admin', 'user'], // ✅ only apply to protected section
		errorElement: <ErrorBoundary />,
		children: [
			{
				path: '/',
				element: <ProjectDashboardApp />
			},
			...privateRoutes,
			{
				path: 'loading',
				element: <FuseLoading />,
				settings: { layout: layoutConfigOnlyMain }
			}
		]
	},

	{
		path: '*',
		element: <Navigate to="/404" />
	}
];

export default routes;
