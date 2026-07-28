// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = '杰西的自习室';
export const SITE_DESCRIPTION = '记录软件工程技术与折腾';
export const SITE_AUTHOR = '杰西';

/** 导航项 */
export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog', label: '博客' },
	{ href: '/about', label: '关于' },
] as const;

/** 社交链接（没有的平台可删） */
export const SOCIAL_LINKS = [
	{
		href: 'https://github.com/philipxiaoxi',
		label: 'GitHub',
		icon: 'github' as const,
	},
] as const;
