import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
// import SettingsAppNavigation from '../app/(control-panel)/apps/settings/SettingsAppNavigation';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboards',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'dashboards.project',
				title: 'Dashboard',
				type: 'item',
				icon: 'heroicons-outline:clipboard-document-check',
				url: '/'
			},
			// {
			// 	id: 'project.create',
			// 	title: 'Form',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:clipboard-document-check',
			// 	url: '/create/project'
				
			// },

			// {
			// 	id:'project.view',
			// 	title: 'View Project',
			// 	type:'item',
			// 	icon:'heroicons-outline:clipboard-document-check',
			// 	url: '/view/project'
			// },
			{
				id: 'apps.ecommerce',
				title: 'Project',
				type: 'collapse',
				icon: 'heroicons-outline:list-bullet',
				translate: 'Project',
				children: [
					{
						id: 'project.create',
						title: 'Create',
						type: 'item',
						icon: 'heroicons-outline:plus',
						url: '/create/project'
						
					},
					{
						id:'project.view',
						title: 'View',
						type:'item',
						icon:'heroicons-outline:eye',
						url: '/view/project'
					},
				]
			},
		]
		
	},
];

export default navigationConfig;
