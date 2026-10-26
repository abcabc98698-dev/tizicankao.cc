import { defineConfig } from 'vitepress';
import * as path from 'path';

export default defineConfig({
  lang: 'zh-CN',
  title: '梯子参考',
  titleTemplate: ':title ｜ 梯子参考 tizicankao.cc',
  description: '梯子参考：按设备与需求选择合适的网络方案。客观比较手机电脑客户端、服务类型、使用教程与网络排障指南。',
  srcDir: 'generated',
  outDir: '../dist',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://tizicankao.cc'
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:site_name', content: '梯子参考' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '梯子参考',
    outline: {
      level: [2, 3],
      label: '本页导读与目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后复核与更新'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../')
      }
    },
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    }
  }
});
