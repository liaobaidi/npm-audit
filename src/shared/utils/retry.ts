/**
 * Retry utility function that retries a promise-returning function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param delay Base delay in milliseconds (default: 1000)
 * @param exponentialFactor Factor for exponential backoff (default: 2)
 * @returns Promise that resolves with the result of the function or rejects after max retries
 */
export async function retry<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = 1000,
	exponentialFactor: number = 2
): Promise<T> {
	let lastError: Error | null = null

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error as Error

			// If this is the last attempt, don't wait
			if (attempt < maxRetries) {
				// Calculate delay with exponential backoff
				const currentDelay = delay * Math.pow(exponentialFactor, attempt - 1)
				console.warn(
					`Attempt ${attempt} failed. Retrying in ${currentDelay}ms...`,
					error
				)
				await new Promise((resolve) => setTimeout(resolve, currentDelay))
			}
		}
	}

	// If we get here, all attempts failed
	throw new Error(
		`Operation failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
	)
}
