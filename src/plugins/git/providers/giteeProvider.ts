import { BaseGitProvider } from './baseProvider'
import type { GitFetchParams } from '../../types'
import { parseGitUrl } from '../../../shared/utils/urlParser'

export class GiteeProvider extends BaseGitProvider {
	name = 'gitee'

	protected parseUrl(url: string): { owner: string; repo: string } | null {
		return parseGitUrl(url, 'gitee.com')
	}

	protected getRawUrl(params: GitFetchParams): string {
		const { url, ref = 'master' } = params
		const parsed = this.parseUrl(url)

		// This check is just for type safety, validation already happened in base class
		if (!parsed) {
			throw new Error('Invalid Gitee URL')
		}

		const { owner, repo } = parsed
		return `https://gitee.com/${owner}/${repo}/raw/${ref}/package.json`
	}
}
