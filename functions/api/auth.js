export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const siteId = url.searchParams.get("site_id");

  if (provider !== "github") {
    return new Response("Unsupported provider", { status: 400 });
  }

  const redirectUri = `${url.origin}/api/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user:email&state=${crypto.randomUUID()}`;

  return Response.redirect(githubAuthUrl, 302);
}
