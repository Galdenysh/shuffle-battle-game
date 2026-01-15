/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Настройка CSP заголовков для VK
  async headers() {
    return [
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
