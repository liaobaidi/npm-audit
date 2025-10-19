import { Git } from './git'

async function runDemo() {
	console.log('Git Plugin Demo')
	console.log('===============')

	const git = new Git()

	try {
		// 示例1: 从GitHub获取package.json
		console.log('\n1. Fetching package.json from GitHub...')
		const githubPackage = await git.fetchPackageJson({
			url: 'https://github.com/Hunter-away/nextjs-dashboard',
			ref: 'main',
		})
		console.log('GitHub package.json:', githubPackage)
	} catch (error) {
		console.log('Error fetching from GitHub:', (error as Error).message)
	}

	try {
		// 示例2: 从Gitee获取package.json
		console.log('\n2. Fetching package.json from Gitee...')
		const giteePackage = await git.fetchPackageJson({
			url: 'https://gitee.com/shuangovo_admin/miku-desu-vue',
			ref: 'master',
		})
		console.log('Gitee package.json:', giteePackage)
	} catch (error) {
		console.log('Error fetching from Gitee:', (error as Error).message)
	}

	try {
		// 示例3: 尝试从不支持的提供者获取package.json
		console.log('\n3. Trying to fetch from unsupported provider...')
		const unsupportedPackage = await git.fetchPackageJson({
			url: 'https://gitlab.com/owner/repo',
		})
		console.log('Unsupported provider package.json:', unsupportedPackage)
	} catch (error) {
		console.log(
			'Error fetching from unsupported provider:',
			(error as Error).message
		)
	}

	try {
		// 示例4: 从GitHub获取并保存package.json
		console.log('\n4. Fetching and saving package.json from GitHub...')
		await git.fetchAndSavePackageJson({
			url: 'https://github.com/Hunter-away/nextjs-dashboard',
			ref: 'main',
		})
		console.log('GitHub package.json fetched and saved successfully')
	} catch (error) {
		console.log(
			'Error fetching and saving from GitHub:',
			(error as Error).message
		)
	}

	try {
		// 示例5: 从Gitee获取并保存package.json
		console.log('\n5. Fetching and saving package.json from Gitee...')
		await git.fetchAndSavePackageJson({
			url: 'https://gitee.com/shuangovo_admin/miku-desu-vue',
			ref: 'master',
		})
		console.log('Gitee package.json fetched and saved successfully')
	} catch (error) {
		console.log(
			'Error fetching and saving from Gitee:',
			(error as Error).message
		)
	}

	console.log('\nDemo completed!')
}

// 运行demo
runDemo().catch(console.error)
