import { runCommand } from '../../../shared/command'
import { retry } from '../../../shared/utils/retry'
import type {
	GitProviderInterface,
	GitFetchParams,
	GitPackageJson,
} from '../../types'

export abstract class BaseGitProvider
	implements GitProviderInterface<GitFetchParams, GitPackageJson>
{
	abstract name: string

	/**
	 * Parse repository URL to extract owner and repo info
	 */
	protected abstract parseUrl(
		url: string
	): { owner: string; repo: string } | null

	/**
	 * Get the raw URL for fetching package.json
	 */
	protected abstract getRawUrl(params: GitFetchParams): string

	/**
	 * Fetch package.json from the provider with retry mechanism
	 */
	async fetchPackageJson(params: GitFetchParams): Promise<GitPackageJson> {
		const { url } = params
		const parsed = this.parseUrl(url)

		if (!parsed) {
			throw new Error(`Invalid ${this.name} URL`)
		}

		// Use the shared retry utility
		return retry<GitPackageJson>(
			async () => {
				const rawUrl = this.getRawUrl(params)
				console.log(`Fetching ${this.name} package.json from ${rawUrl}`)
				const result = await runCommand(`curl -s "${rawUrl}"`)

				// Check if result is valid JSON
				if (!result || result.trim().length === 0) {
					throw new Error('Empty response from server')
				}

				// Try to parse JSON
				const parsedResult = JSON.parse(result)
				return parsedResult as GitPackageJson
			},
			3,
			1000
		) // 3 retries with 1 second delay
	}
}
