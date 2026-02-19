export function createSSEStream(
	signal: AbortSignal,
	generator: () => AsyncGenerator<{ event: string; data: string }>
): ReadableStream {
	return new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			try {
				for await (const { event, data } of generator()) {
					if (signal.aborted) break;
					controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
				}
			} catch {
				/* client disconnected */
			} finally {
				controller.close();
			}
		}
	});
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
