import { run } from 'node-cmd'

export const runCommand = (command: string): Promise<string> =>
	new Promise((resolve, reject) => {
		if (!command) {
			reject(new Error('Command is required'))
			return
		}
		run(command, (err, data, stderr) => {
			if (err) {
				reject({
					err,
					stderr,
				})
			} else {
				resolve(data)
			}
		})
	})
