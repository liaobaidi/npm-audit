// 导入要测试的函数和 execaCommand，我们稍后会模拟它
import { runCommand } from '../command'
import { execaCommand } from 'execa'

jest.mock('execa', () => ({
	execaCommand: jest.fn(),
}))

describe('runCommand', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	// --- 测试成功场景 ---
	test('应该在命令成功时返回 stdout', async () => {
		;(execaCommand as jest.Mock).mockResolvedValue({
			stdout: '成功执行的输出',
			stderr: '',
			exitCode: 0,
			failed: false,
			isCanceled: false,
			isTimedOut: false,
			killed: false,
			command: '',
			message: '',
		})

		const result = await runCommand('test command')
		// 验证返回值是否为我们模拟的 stdout
		expect(result).toBe('成功执行的输出')
		// 验证 execaCommand 是否被调用了正确的参数
		expect(execaCommand).toHaveBeenCalledWith('test command', {
			cwd: undefined,
			env: expect.any(Object), // 确保 env 存在
			timeout: undefined,
			shell: true,
			windowsHide: true,
		})
	})

	// --- 测试自定义选项 ---
	test('应该将自定义选项传递给 execaCommand', async () => {
		;(execaCommand as jest.Mock).mockResolvedValue({
			stdout: 'options test',
			stderr: '',
			exitCode: 0,
			failed: false,
			isCanceled: false,
			isTimedOut: false,
			killed: false,
			command: '',
			message: '',
		})

		const options = {
			cwd: '/my-project',
			env: { MY_VAR: 'test' },
			timeout: 5000,
			shell: false,
		}
		await runCommand('another command', options)

		// 验证 execaCommand 是否正确接收了所有选项
		expect(execaCommand).toHaveBeenCalledWith('another command', {
			cwd: '/my-project',
			env: { ...process.env, MY_VAR: 'test' },
			timeout: 5000,
			shell: false,
			windowsHide: true,
		})
	})

	// --- 测试失败场景 ---
	test('应该在命令失败时抛出错误', async () => {
		// 模拟 execaCommand 失败，并返回一个带有 stderr 和 stdout 的错误对象
		const mockError = {
			stdout: '部分成功输出',
			stderr: '这是一个错误信息',
			message: '命令执行失败',
			exitCode: 1,
			failed: true,
		}
		;(execaCommand as jest.Mock).mockRejectedValue(mockError)

		// 验证函数是否抛出了错误
		await expect(runCommand('failed command')).rejects.toThrow(
			'Command failed: failed command'
		)

		// 验证抛出的错误对象是否包含了 stdout 和 stderr
		await expect(runCommand('failed command')).rejects.toMatchObject({
			stdout: '部分成功输出',
			stderr: '这是一个错误信息',
		})
	})

	// --- 测试 allowNonZeroExit 场景 ---
	test('当 allowNonZeroExit 为 true 时，即使失败也应该返回 stdout', async () => {
		const mockError = {
			stdout: '非零退出时的输出',
			stderr: '非零退出时的错误',
			exitCode: 1,
			failed: true,
		}
		;(execaCommand as jest.Mock).mockRejectedValue(mockError)

		// 传递 allowNonZeroExit: true
		const result = await runCommand('non-zero exit', { allowNonZeroExit: true })

		// 验证函数没有抛出错误，而是返回了 stdout
		expect(result).toBe('非零退出时的输出')
	})
})
