const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      // hidden-source-map 으로 바꾸지 않으면 개발자모드-소스에 webpack 이 생김
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale%/, /^\.\/ko$/),
      ],
    };
  },
  compress: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});
