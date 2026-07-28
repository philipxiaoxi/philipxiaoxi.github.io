/** 站点级常量：标题、导航、社交与首页简介 */

export const SITE_TITLE = '杰西的自习室';
export const SITE_DESCRIPTION = '杰西的技术笔记：前端、工程化与一点 AI 实践';
export const SITE_AUTHOR = '杰西';
export const SITE_TAGLINE = '写清楚一点，少踩一点坑。';
export const SITE_EMAIL = 'xswork@qq.com';
export const SITE_GITHUB = 'https://github.com/philipxiaoxi';
export const SITE_GITHUB_HANDLE = 'philipxiaoxi';

/** 导航项 */
export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog', label: '博客' },
] as const;

export type SocialIconName = 'github' | 'email';

/** 社交链接 */
export const SOCIAL_LINKS = [
	{
		href: SITE_GITHUB,
		label: 'GitHub',
		icon: 'github' as const satisfies SocialIconName,
		external: true,
	},
	{
		href: `mailto:${SITE_EMAIL}`,
		label: '邮箱',
		icon: 'email' as const satisfies SocialIconName,
		external: false,
	},
] as const;

/**
 * 首页简介：委婉、克制，不写求职话术。
 */
export const PROFILE = {
	name: '杰西',
	headline: '做前端，也写一点全栈与 AI。',
	paragraphs: [
		'我是杰西。从 Vue 与工程化一路做下来，习惯把复杂业务收成可维护的结构，也愿意在性能与交付质量上多花一点心思。',
		'近几年除了业务系统，也在做 AI 辅助研发与 Agent 相关的实践——更在意工具能不能嵌进真实流程，而不是只停留在演示。',
		'这里记录一些可复现的笔记：踩坑、取舍、以及还在学的事。',
	],
	focus: ['Vue / TypeScript', '前端工程化', '性能与体验', 'AI 工作流', '全栈交付'],
} as const;
