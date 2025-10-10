import { runCommand } from '@shared/command'
import type { NpmPlugin } from '../types'
import { join } from 'node:path'
import fstat from 'fs-extra'
import { attachPlugin } from '@shared/attachPlugin'

export class Npm implements NpmPlugin {
	name = 'npm'
	workspace = join(process.cwd(), 'workspace')
	generatePackageLock() {
		return runCommand(
			'npm install --package-lock-only --registry=https://registry.npmjs.org/',
			{
				cwd: this.workspace,
			}
		)
			.then(() => {
				console.log('[plugin-npm]: package-lock.json generated successfully.')
			})
			.catch((err) => {
				console.error(
					'[plugin-npm]: Failed to generate package-lock.json.',
					err
				)
				throw err
			})
	}
	async audit<TAudit = unknown>(): Promise<TAudit> {
		try {
			await this.generatePackageLock()
			const data = await runCommand(
				'npm audit --json --registry=https://registry.npmjs.org/',
				{
					cwd: this.workspace,
					allowNonZeroExit: true,
				}
			)
			fstat.writeJSON(
				join(process.cwd(), 'workspace', 'audit.json'),
				JSON.parse(data),
				{ spaces: 2 }
			)
			return JSON.parse(data) as TAudit
		} catch (error) {
			console.error('[plugin-npm]: Error during audit process.', error)
			throw error
		}
	}
	static install<T>(ctx: T) {
		return attachPlugin(ctx, '$npm', new this()) as typeof ctx & {
			$npm: NpmPlugin
		}
	}
}
