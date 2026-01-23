/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_ASSET_VERSION: Date.now().toString(),
  },

  async headers() {
    return [
      // Отключаем кэширование для CDN
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(.*text/html.*|.*application/xhtml\\+xml.*)',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      // Настройка CSP заголовков для VK
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors vk.com *.vk.com *.vk-apps.com *.vk-apps.io *.userapi.com https://ok.ru *.ok.ru;',
          },
          {
            key: 'Permissions-Policy',
            value:
              'autoplay=(self), camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
