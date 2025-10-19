import type { GitPlugin, GitFetchParams, GitPackageJson } from '../types'
import { attachPlugin } from '../../shared/attachPlugin'
import { GitHubProvider } from './providers/githubProvider'
import { GiteeProvider } from './providers/giteeProvider'
import fse from 'fs-extra'
import { join } from 'path'

export class Git implements GitPlugin {
	name = 'git'
	private providers: Map<string, any>
	workspace = join(process.cwd(), 'workspace')

	constructor() {
		this.providers = new Map()
		this.providers.set('github', new GitHubProvider())
		this.providers.set('gitee', new GiteeProvider())
	}

	/**
	 * Determine provider from URL and fetch package.json
	 */
	async fetchPackageJson(params: GitFetchParams): Promise<GitPackageJson> {
		const { url } = params

		// Determine provider from URL
		let providerKey = ''
		if (url.includes('github.com')) {
			providerKey = 'github'
		} else if (url.includes('gitee.com')) {
			providerKey = 'gitee'
		} else {
			throw new Error(
				'Unsupported git provider. Only GitHub and Gitee are supported.'
			)
		}

		const provider = this.providers.get(providerKey)
		if (!provider) {
			throw new Error(`Provider ${providerKey} not found`)
		}

		return provider.fetchPackageJson(params)
	}

	/**
	 * Fetch package.json and save it to the workspace
	 */
	async fetchAndSavePackageJson(
		params: GitFetchParams
	): Promise<GitPackageJson> {
		try {
			// Fetch the package.json
			const packageJson = await this.fetchPackageJson(params)

			// Ensure workspace directory exists
			await fse.ensureDir(this.workspace)

			// Save package.json to workspace
			const filePath = join(this.workspace, 'package.json')
			await fse.writeJSON(filePath, packageJson, { spaces: 2 })

			console.log(`[plugin-git]: package.json saved to ${filePath}`)

			return packageJson
		} catch (error) {
			console.error(
				'[plugin-git]: Error fetching and saving package.json',
				error
			)
			throw error
		}
	}

	/**
	 * Install the plugin
	 */
	static install<T>(ctx: T) {
		return attachPlugin(ctx, '$git', new this()) as typeof ctx & {
			$git: GitPlugin
		}
	}
}
