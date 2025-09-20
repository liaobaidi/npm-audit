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
