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

// 站长平台验证配置 (优先使用环境变量，其次读取 data/verification.json)
const verificationConfigPath = path.resolve(__dirname, '../../data/verification.json');
let verification: Record<string, string> = {};
if (fs.existsSync(verificationConfigPath)) {
  try {
    verification = JSON.parse(fs.readFileSync(verificationConfigPath, 'utf-8'));
  } catch {}
}

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || verification.google;
const bingVerification = process.env.MSVALIDATE_01 || verification.bing;
const shenmaVerification = process.env.SHENMA_SITE_VERIFICATION || verification.shenma;
const baiduVerification = process.env.BAIDU_SITE_VERIFICATION || verification.baidu;

// 基础全局 Head
const baseHead: HeadConfig[] = [
  ['link', { rel: 'icon', type: 'image/jpeg', href: '/avatar.jpg?v=20261026' }],
  ['link', { rel: 'shortcut icon', href: '/avatar.jpg?v=20261026' }],
  ['link', { rel: 'apple-touch-icon', href: '/avatar.jpg?v=20261026' }],
  ['meta', { name: 'robots', content: 'index, follow' }],
  ['meta', { name: 'theme-color', content: '#2563eb' }],
  ['meta', { property: 'og:site_name', content: '梯子参考' }],
  ['meta', { property: 'og:locale', content: 'zh_CN' }]
];

// 动态预留四大主流站长平台验证 Meta
if (googleVerification) {
  baseHead.push(['meta', { name: 'google-site-verification', content: googleVerification }]);
}
if (bingVerification) {
  baseHead.push(['meta', { name: 'msvalidate.01', content: bingVerification }]);
}
if (shenmaVerification) {
  baseHead.push(['meta', { name: 'shenma-site-verification', content: shenmaVerification }]);
}
if (baiduVerification) {
  baseHead.push(['meta', { name: 'baidu-site-verification', content: baiduVerification }]);
}

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
    const pageTitle = pageData.title ? `${pageData.title} ｜ 梯子参考 tizicankao.cc` : '梯子参考：按设备与需求选择合适的网络方案';
    const pageDesc = pageData.description || '客观中立的网络选型、客户端与技术配置指南';
    const isHome = rel === '/';
    const isTopicHub = !isHome && rel.split('/').filter(Boolean).length === 1;

    const head: HeadConfig[] = [
      // 1. 规范网址 Canonical
      ['link', { rel: 'canonical', href: canonicalUrl }],

      // 2. Open Graph 社交网络协议
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDesc }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:image', content: 'https://tizicankao.cc/avatar.jpg' }],

      // 3. Twitter Card
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDesc }],
      ['meta', { name: 'twitter:image', content: 'https://tizicankao.cc/avatar.jpg' }]
    ];

    if (!isHome) {
      head.push(
        ['meta', { property: 'article:published_time', content: '2026-10-26T00:00:00+08:00' }],
        ['meta', { property: 'article:modified_time', content: new Date().toISOString() }],
        ['meta', { property: 'article:author', content: '梯子参考技术评测实验室' }]
      );
    }

    // 4. Schema.org 结构化数据体系
    const schemas: any[] = [];

    // 面包屑 BreadcrumbList
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

    // 首页 WebSite + Organization
    if (isHome) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '梯子参考',
        url: 'https://tizicankao.cc/',
        description: '梯子参考：按设备与需求选择合适的网络方案。客观比较手机电脑客户端、服务类型、使用教程与网络排障指南。',
        publisher: {
          '@type': 'Organization',
          name: '梯子参考',
          url: 'https://tizicankao.cc/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://tizicankao.cc/avatar.jpg'
          }
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://tizicankao.cc/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '梯子参考',
        url: 'https://tizicankao.cc/',
        logo: 'https://tizicankao.cc/avatar.jpg'
      });
    } else if (rel === '/about/') {
      // 关于我们 AboutPage
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: pageTitle,
        description: pageDesc,
        url: canonicalUrl
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '梯子参考技术评测实验室',
        url: 'https://tizicankao.cc/about/',
        logo: 'https://tizicankao.cc/avatar.jpg'
      });
    } else if (isTopicHub) {
      // 栏目/主专题 CollectionPage
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDesc,
        url: canonicalUrl,
        publisher: {
          '@type': 'Organization',
          name: '梯子参考',
          url: 'https://tizicankao.cc/'
        }
      });
    } else {
      // 具体技术指南 TechArticle
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title || '梯子参考技术指南',
        description: pageDesc,
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
  head: baseHead,
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
