export class RequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function apiResponse(action: () => Promise<Response>): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof RequestError) {
      return json({ error: error.message }, error.status);
    }
    console.error("Library API request failed:", error);
    return json({ error: "The request could not be completed. Please try again." }, 500);
  }
}
