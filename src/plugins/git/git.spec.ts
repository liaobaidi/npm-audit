jest.mock('fs-extra', () => ({
	emptyDir: jest.fn(),
	writeJSON: jest.fn(),
	ensureDir: jest.fn(),
}))

jest.mock('../../shared/command', () => ({
	runCommand: jest.fn(),
}))

beforeEach(() => {
	jest.clearAllMocks()
})

import { Git } from './git'
import { runCommand } from '../../shared/command'
import fse from 'fs-extra'

describe('Git plugin', () => {
	it('注册插件，应该正确把git实例挂载到ctx上', () => {
		const ctx: Record<string, unknown> = {}
		;(Git as any).install(ctx)
		expect((ctx as any).$git).toBeInstanceOf(Git)
	})

	it('不支持的仓库应该报错', async () => {
		const git = new Git()
		await expect(
			git.fetchPackageJson({
				url: 'https://gitlab.com/owner/repo',
			})
		).rejects.toThrow('Unsupported git provider')
	})

	it('应该能够从GitHub获取package.json', async () => {
		// Mock successful response from GitHub
		const mockPackageJson = { name: 'test-repo', version: '1.0.0' }
		;(runCommand as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockPackageJson)
		)

		const git = new Git()
		const result = await git.fetchPackageJson({
			url: 'https://github.com/Hunter-away/nextjs-dashboard',
			ref: 'main',
		})

		expect(result).toEqual(mockPackageJson)
		expect(runCommand).toHaveBeenCalledWith(
			'curl -s "https://raw.githubusercontent.com/Hunter-away/nextjs-dashboard/main/package.json"'
		)
	})

	it('应该能够从Gitee获取package.json', async () => {
		// Mock successful response from Gitee
		const mockPackageJson = { name: 'test-repo', version: '1.0.0' }
		;(runCommand as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockPackageJson)
		)

		const git = new Git()
		const result = await git.fetchPackageJson({
			url: 'https://gitee.com/shuangovo_admin/miku-desu-vue',
			ref: 'master',
		})

		expect(result).toEqual(mockPackageJson)
		expect(runCommand).toHaveBeenCalledWith(
			'curl -s "https://gitee.com/shuangovo_admin/miku-desu-vue/raw/master/package.json"'
		)
	})

	it('应该在GitHub请求失败时重试3次', async () => {
		// Mock failed responses to trigger retries
		;(runCommand as jest.Mock).mockRejectedValue(new Error('Network error'))

		const git = new Git()
		await expect(
			git.fetchPackageJson({
				url: 'https://github.com/Hunter-away/nextjs-dashboard',
				ref: 'main',
			})
		).rejects.toThrow('Operation failed after 3 attempts')

		// Should have been called 3 times (initial + 2 retries)
		expect(runCommand).toHaveBeenCalledTimes(3)
	})

	it('应该在Gitee请求失败时重试3次', async () => {
		// Mock failed responses to trigger retries
		;(runCommand as jest.Mock).mockRejectedValue(new Error('Network error'))

		const git = new Git()
		await expect(
			git.fetchPackageJson({
				url: 'https://gitee.com/shuangovo_admin/miku-desu-vue',
				ref: 'master',
			})
		).rejects.toThrow('Operation failed after 3 attempts')

		// Should have been called 3 times (initial + 2 retries)
		expect(runCommand).toHaveBeenCalledTimes(3)
	})

	it('应该能够从GitHub获取并保存package.json', async () => {
		// Mock successful response from GitHub
		const mockPackageJson = { name: 'test-repo', version: '1.0.0' }
		;(runCommand as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockPackageJson)
		)

		const git = new Git()
		const result = await git.fetchAndSavePackageJson({
			url: 'https://github.com/Hunter-away/nextjs-dashboard',
			ref: 'main',
		})

		expect(result).toEqual(mockPackageJson)
		expect(fse.ensureDir).toHaveBeenCalledWith(
			expect.stringContaining('workspace')
		)
		expect(fse.writeJSON).toHaveBeenCalledWith(
			expect.stringContaining('package.json'),
			mockPackageJson,
			{ spaces: 2 }
		)
	})

	it('应该能够从Gitee获取并保存package.json', async () => {
		// Mock successful response from Gitee
		const mockPackageJson = { name: 'test-repo', version: '1.0.0' }
		;(runCommand as jest.Mock).mockResolvedValueOnce(
			JSON.stringify(mockPackageJson)
		)

		const git = new Git()
		const result = await git.fetchAndSavePackageJson({
			url: 'https://gitee.com/shuangovo_admin/miku-desu-vue',
			ref: 'master',
		})

		expect(result).toEqual(mockPackageJson)
		expect(fse.ensureDir).toHaveBeenCalledWith(
			expect.stringContaining('workspace')
		)
		expect(fse.writeJSON).toHaveBeenCalledWith(
			expect.stringContaining('package.json'),
			mockPackageJson,
			{ spaces: 2 }
		)
	})
})
