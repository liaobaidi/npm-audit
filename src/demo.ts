import { Npm } from './plugins/npm/npm'
class App {
	constructor() {}
	use(plugin: typeof Npm) {
		return plugin.install(this)
	}
}

function createApp() {
	const app = new App()
	const appWithNpm = app.use(Npm)
	return appWithNpm
}

const app = createApp()
app.$npm.audit()
