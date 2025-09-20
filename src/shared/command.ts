import { execaCommand } from 'execa'

export interface RunCommandOptions {
	cwd?: string
	env?: Record<string, string>
	timeout?: number
	shell?: boolean | string
	/** 是否允许非0退出 */
	allowNonZeroExit?: boolean
}

/**
 * 使用 execa 执行命令，返回 Promise<string>（stdout）。
 * - 支持 opts.cwd / opts.env / opts.timeout / opts.shell
 * - 错误时会抛出包含 stdout/stderr 的 Error，便于调试
 */
export async function runCommand(
	commandStr: string,
	opts: RunCommandOptions = {}
): Promise<string> {
	const { cwd, env, timeout, shell, allowNonZeroExit } = opts
	try {
		const result = await execaCommand(commandStr, {
			cwd,
			env: { ...process.env, ...(env || {}) },
			timeout,
			shell: shell ?? true,
			windowsHide: true,
		})
		return result.stdout
	} catch (err: any) {
		if (allowNonZeroExit) {
			return err.stdout ?? ''
		}
		const e: any = new Error(
			`Command failed: ${commandStr}\n${err.message || ''}`
		)
		e.stdout = err.stdout
		e.stderr = err.stderr
		throw e
	}
}
