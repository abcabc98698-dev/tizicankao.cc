import { defineConfig, type HeadConfig } from 'vitepress';
import * as path from 'path';
import * as fs from 'fs';

// 读取注册表，建立已发布白名单集合
const registryPath = path.resolve(__dirname, '../../data/content_registry.json');
const publishedUrls = new Set<string>();
if (fs.existsSync(registryPath)) {
  const nodes = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  nodes.filter((n: any) => n.status === 'published').forEach((n: any) => publishedUrls.add(n.url));
}
// 补充核心信任与法律政策支撑页面
['/about/', '/methodology/', '/privacy/', '/terms/', '/disclosure/'].forEach(u => publishedUrls.add(u));

export default defineConfig({
  lang: 'zh-CN',
  title: '梯子参考',
  titleTemplate: ':title ｜ 梯子参考 tizicankao.cc',
  description: '梯子参考：按设备与需求选择合适的网络方案。客观比较手机电脑客户端、服务类型、使用教程与网络排障指南。',
  srcDir: 'generated',
  outDir: '../dist',
  publicDir: path.resolve(__dirname, '../public'),
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://tizicankao.cc',
    transformItems(items) {
      return items
        .filter(item => {
          let u = item.url;
          if (!u.startsWith('/')) u = '/' + u;
          if (!u.endsWith('/')) u += '/';
          return publishedUrls.has(u) && !u.includes('404');
        })
        .map(item => ({
          ...item,
          lastmod: new Date().toISOString()
        }));
    }
  },
  transformHead({ pageData }) {
    let rel = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '');
    if (!rel.startsWith('/')) rel = '/' + rel;
    if (!rel.endsWith('/')) rel += '/';
    if (rel === '//') rel = '/';
    const canonicalUrl = `https://tizicankao.cc${rel}`;

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }]
    ];

    // Schema.org 结构化数据
    const schemas: any[] = [];

    // 1. 全局 BreadcrumbList 面包屑
    const pathSegments = rel.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const itemListElement = [
        {
          '@type': 'ListItem',
          position: 1,
          name: '梯子参考首页',
          item: 'https://tizicankao.cc/'
        }
      ];
      let currentPath = 'https://tizicankao.cc';
      pathSegments.forEach((seg, idx) => {
        currentPath += `/${seg}/`;
        itemListElement.push({
          '@type': 'ListItem',
          position: idx + 2,
          name: idx === pathSegments.length - 1 ? (pageData.title || seg) : seg,
          item: currentPath
        });
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement
      });
    }

    // 2. 首页 WebSite Schema
    if (rel === '/') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '梯子参考',
        url: 'https://tizicankao.cc/',
        description: '梯子参考：按设备与需求选择合适的网络方案。客观比较手机电脑客户端、服务类型、使用教程与网络排障指南。',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://tizicankao.cc/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      });
    } else {
      // 3. 技术文章与专题页 TechArticle Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title || '梯子参考技术指南',
        description: pageData.description || '客观中立的网络选型、客户端与技术配置指南',
        url: canonicalUrl,
        inLanguage: 'zh-CN',
        author: {
          '@type': 'Organization',
          name: '梯子参考技术评测实验室',
          url: 'https://tizicankao.cc/about/'
        },
        publisher: {
          '@type': 'Organization',
          name: '梯子参考',
          url: 'https://tizicankao.cc/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://tizicankao.cc/avatar.jpg'
          }
        },
        datePublished: '2026-10-26T00:00:00+08:00',
        dateModified: new Date().toISOString()
      });
    }

    if (schemas.length > 0) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(schemas)]);
    }

    return head;
  },
  head: [
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/avatar.jpg?v=20261026' }],
    ['link', { rel: 'shortcut icon', href: '/avatar.jpg?v=20261026' }],
    ['link', { rel: 'apple-touch-icon', href: '/avatar.jpg?v=20261026' }],
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
