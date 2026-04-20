export const normalizeUrl = (url: string) => {
  if (!url) return '/';
  if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;

  try {
    const parsed = new URL(url);
    const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL;

    if (wpUrl) {
      try {
        const wpBase = new URL(wpUrl);
        const wpPath = wpBase.pathname.replace(/\/$/, '');

        if (parsed.hostname === wpBase.hostname || parsed.hostname === 'localhost' || parsed.hostname === 'techumayur.com' || parsed.hostname === 'www.techumayur.com') {
          let path = parsed.pathname;
          
          if (wpPath && wpPath !== '/' && path.startsWith(wpPath)) {
            path = path.slice(wpPath.length) || '/';
          }

          // 🔥 Special case for "home" slug - redirect to root
          if (path === '/home' || path === '/home/' || path === '/home') {
             return '/';
          }

          // 🔥 Special case for "terms-and-conditions" slug
          if (path === '/terms-and-conditions' || path === '/terms-and-conditions/') {
             return '/terms-conditions';
          }

          return path.startsWith('/') ? path : `/${path}`;
        }
      } catch { }
    }

    const path = parsed.pathname;
    return (path === '/home' || path === '/home/') ? '/' : path;
  } catch {
    const path = url.startsWith('/') ? url : `/${url}`;
    return (path === '/home' || path === '/home/') ? '/' : path;
  }
};
