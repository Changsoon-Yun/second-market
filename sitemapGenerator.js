/* eslint-disable @typescript-eslint/no-var-requires */
require('babel-register')({
  presets: ['es2015', 'react'],
});

const router = require('./src/lib/router/sitemapRoutes.js').default; // 좀 전에 만든 sitemapRoutes 파일이 있는 경로입니다.
const Sitemap = require('react-router-sitemap').default;

function generateSitemap() {
  return new Sitemap(router)
    .build('https://www.secondmarket.store/') // 여러분의 도메인 이름으로 변경해주세요.
    .save('./public/sitemap.xml'); // sitemap.xml 파일이 생성될 위치입니다.
}

generateSitemap();
