// filepath: e:\serve\npm-audit\src\shared\__test__\command.spec.ts
import { runCommand } from '../command'
import { run } from 'node-cmd'

jest.mock('node-cmd', () => ({
	run: jest.fn(),
}))

const runMock = run as unknown as jest.Mock

beforeEach(() => {
	jest.clearAllMocks()
})

describe('runCommand', () => {
	it('如果没有传递命令，应该报错处理', async () => {
		await expect(runCommand('')).rejects.toThrow('Command is required')
		expect(runMock).not.toHaveBeenCalled()
	})

	it('如果 node-cmd 返回错误，应该以对象形式拒绝并包含 err 和 stderr', async () => {
		const fakeErr = new Error('exec failed')
		runMock.mockImplementation(
			(
				cmd: string,
				cb: (err: unknown, data: unknown, stderr: unknown) => void
			) => cb(fakeErr, null, 'some stderr')
		)

		await expect(runCommand('invalid-cmd')).rejects.toMatchObject({
			err: fakeErr,
			stderr: 'some stderr',
		})

		expect(runMock).toHaveBeenCalledTimes(1)
		expect(runMock).toHaveBeenCalledWith('invalid-cmd', expect.any(Function))
	})

	it('如果 node-cmd 成功，应该解析 stdout 文本', async () => {
		runMock.mockImplementation(
			(
				cmd: string,
				cb: (err: unknown, data: unknown, stderr: unknown) => void
			) => cb(null, 'ok output', '')
		)

		await expect(runCommand('echo ok')).resolves.toBe('ok output')

		expect(runMock).toHaveBeenCalledTimes(1)
		expect(runMock).toHaveBeenCalledWith('echo ok', expect.any(Function))
	})

	it('确保传入的命令字符串被传递给 node-cmd', async () => {
		runMock.mockImplementation(
			(
				cmd: string,
				cb: (err: unknown, data: unknown, stderr: unknown) => void
			) => cb(null, 'output', '')
		)

		const cmd = 'some-command --flag'
		await runCommand(cmd)
		expect(runMock).toHaveBeenCalledWith(cmd, expect.any(Function))
	})
})
