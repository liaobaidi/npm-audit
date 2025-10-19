import { BaseGitProvider } from './baseProvider'
import type { GitFetchParams } from '../../types'
import { parseGitUrl } from '../../../shared/utils/urlParser'

export class GitHubProvider extends BaseGitProvider {
	name = 'github'

	protected parseUrl(url: string): { owner: string; repo: string } | null {
		return parseGitUrl(url, 'github.com')
	}

	protected getRawUrl(params: GitFetchParams): string {
		const { url, ref = 'main' } = params
		const parsed = this.parseUrl(url)

		// This check is just for type safety, validation already happened in base class
		if (!parsed) {
			throw new Error('Invalid GitHub URL')
		}

		const { owner, repo } = parsed
		return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/package.json`
	}
}
