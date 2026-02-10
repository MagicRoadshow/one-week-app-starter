export async function GET() {
  return Response.json({
    status: "ok",
    message: "Starter API is working",
    timestamp: new Date().toISOString(),
  });
}
