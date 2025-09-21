// functions/api/auth/callback.js
function renderBody(status, content) {
  return `
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:${status}:${JSON.stringify(content)}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  `;
}

export async function onRequest({ request, env }) {
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    // Exchange code for access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "cloudflare-functions-github-oauth-login",
        "accept": "application/json",
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const result = await response.json();

    if (result.error) {
      return new Response(renderBody("error", result), {
        headers: { "content-type": "text/html;charset=UTF-8" },
        status: 401,
      });
    }

    const token = result.access_token;
    const provider = "github";

    return new Response(
      renderBody("success", { token, provider }),
      { headers: { "content-type": "text/html;charset=UTF-8" }, status: 200 }
    );
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
