export abstract class Plugin {
	/**
	 * 插件名称
	 */
	name: string
	/**
	 * 插件注册函数
	 */
	static install<T, R>(ctx: T, opts?: R): unknown
}

export abstract class NpmPlugin extends Plugin {
	/**
	 * 生成 package-lock
	 */
	generatePackageLock(): void
	/**
	 * 审计
	 */
	audit<TAudit>(): Promise<TAudit> | TAudit
}

export type GitProvider = 'gitee' | 'gitlab'

export interface GitFetchParams {
	url: string
	ref?: string // branch, tag, or commit hash
}

export interface GitPackageJson {
	name: string
	version: string
	description?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	[key: string]: any
}

export abstract class GitPlugin extends Plugin {
	/**
	 * 获取远程仓库的 package.json
	 */
	fetchPackageJson(params: GitFetchParams): Promise<GitPackageJson>
}

// Base interface for Git providers
export interface GitProviderInterface<P = GitFetchParams, T = GitPackageJson> {
	name: string
	fetchPackageJson: (params: P) => Promise<T>
}
