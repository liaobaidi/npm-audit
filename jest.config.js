module.exports = {
	// Jest 会使用 ts-jest 来处理 .ts 文件
	preset: 'ts-jest',
	// 测试环境，通常是 'node' 或 'jsdom' (用于浏览器环境)
	testEnvironment: 'node',
	// 指定 Jest 应该搜索测试文件的目录
	roots: ['<rootDir>/src'],
	// 测试文件匹配的模式
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	// 忽略的测试文件，通常是 node_modules
	testPathIgnorePatterns: ['/node_modules/'],
}
