/** 把插件实例挂载到宿主对象上，并支持类型提示 */
export function attachPlugin<C, K extends string, P>(
	host: C,
	key: K,
	plugin: P
): C & Record<K, P> {
	;(host as any)[key] = plugin
	return host as C & Record<K, P>
}
