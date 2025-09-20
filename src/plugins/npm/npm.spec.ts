import { join } from 'node:path'
import { runCommand } from '../../shared/command'
import fstat from 'fs-extra'
import { Npm } from './npm'
jest.mock('fs-extra', () => ({
	emptyDir: jest.fn(),
	writeJSON: jest.fn(),
}))

jest.mock('../../shared/command', () => ({
	runCommand: jest.fn(),
}))

beforeEach(() => {
	jest.clearAllMocks()
})

describe('Npm plugin', () => {
	it('注册插件，应该正确把npm实例挂载到ctx上', () => {
		const ctx: Record<string, unknown> = {}
		const npm = new Npm()
		const res = (Npm as any).install(ctx)
		if (res && typeof (res as Promise<unknown>).then === 'function') {
			;(res as Promise<unknown>).then(() => {
				expect((ctx as any).$npm).toStrictEqual(npm)
			})
		}
		expect((ctx as any).$npm).toStrictEqual(npm)
	})

	it('执行审计命令，应该正确返回json并且写入audit.json', async () => {
		const fakeAudit = { vulnerabilities: 0, metadata: { total: 1 } }

		;(runCommand as jest.Mock).mockImplementation((cmd: string) => {
			if (cmd.includes('audit --json')) {
				return Promise.resolve(JSON.stringify(fakeAudit))
			}
			return Promise.resolve('')
		})
		;(fstat as any).emptyDir.mockResolvedValue(undefined)
		;(fstat as any).writeJSON.mockResolvedValue(undefined)

		const npm = new Npm()
		const result = await (npm as any).audit()

		expect(result).toEqual(fakeAudit)
		expect((fstat as any).writeJSON).toHaveBeenCalledWith(
			join(process.cwd(), 'workspace', 'audit.json'),
			fakeAudit,
			{ spaces: 2 }
		)
	})
})
