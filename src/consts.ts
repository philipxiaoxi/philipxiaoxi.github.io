// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = '杰西的自习室';
export const SITE_DESCRIPTION = '一个全栈开发者的技术自习与实战分享';
export const SITE_AUTHOR = '杰西';
export const SITE_TAGLINE = '持续更新中 — 每一次踩坑，都是一次成长。';
export const SITE_EMAIL = 'xswork@qq.com';

/** 导航项 */
export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog', label: '博客' },
	{ href: '/about', label: '关于' },
] as const;

/** 社交链接 */
export const SOCIAL_LINKS = [
	{
		href: 'https://github.com/philipxiaoxi',
		label: 'GitHub',
		icon: 'github' as const,
	},
	{
		href: 'mailto:xswork@qq.com',
		label: '邮箱',
		icon: 'email' as const,
	},
] as const;

/** 首页「关于我」 */
export const ABOUT_INTRO = [
	'我是杰西，一名持续折腾的全栈开发者。',
	'从前端起步，踩过无数坑后转型全栈，专注于 AI Agent 开发与前端工程化实践。',
] as const;

/** 技术方向 */
export const TECH_FOCUS = [
	{
		area: '全栈开发',
		icon: '📚',
		detail: '前端 → 后端思维转型，跨栈实战经验',
	},
	{
		area: '前端工程化',
		icon: '⚙️',
		detail: '性能优化、持久化缓存、构建体系',
	},
	{
		area: 'AI Agent 开发',
		icon: '🤖',
		detail: '从零打造 AI CLI、Agent 工作流编排',
	},
	{
		area: 'AI 实践',
		icon: '🧠',
		detail: '用 AI 重构研发流程、提示词工程到 Skill 沉淀',
	},
	{
		area: '安全分析',
		icon: '🔒',
		detail: '前端反爬机制、Web 安全研究',
	},
] as const;
