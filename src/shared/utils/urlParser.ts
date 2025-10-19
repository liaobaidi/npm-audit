/**
 * Parse Git repository URL to extract owner and repo info
 * @param url The repository URL
 * @param domain The domain to match (e.g., 'github.com', 'gitee.com')
 * @returns Object with owner and repo, or null if URL doesn't match
 */
export function parseGitUrl(
	url: string,
	domain: string
): { owner: string; repo: string } | null {
	// Create regex pattern dynamically based on domain
	const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(
		`https:\\/\\/${escapedDomain}\\/([^\\/]+)\\/([^\\/.]+)`
	)
	const match = url.match(regex)

	if (match) {
		return {
			owner: match[1],
			repo: match[2],
		}
	}

	return null
}
