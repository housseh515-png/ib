export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Serve files from KV or static assets
    const assets = {
      '/': 'serabta.html',
      '/index.html': 'serabta.html',
      '/serabta.html': 'serabta.html',
      '/photo.jpg': 'photo.jpg',
      '/voice.mp3': 'voice.mp3',
    };

    const file = assets[path] || null;

    if (!file) {
      return new Response('Not Found', { status: 404 });
    }

    // Serve via __STATIC_CONTENT (Cloudflare Workers Sites)
    const content = await env.__STATIC_CONTENT.get(file, { type: 'arrayBuffer' });

    if (!content) {
      return new Response('Not Found', { status: 404 });
    }

    const mimeTypes = {
      'serabta.html': 'text/html;charset=UTF-8',
      'photo.jpg': 'image/jpeg',
      'voice.mp3': 'audio/mpeg',
    };

    return new Response(content, {
      headers: {
        'Content-Type': mimeTypes[file] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  },
};
