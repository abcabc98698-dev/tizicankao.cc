import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const PORT = 4173;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// 全局异常捕获，确保预览服务永不崩溃
process.on('uncaughtException', (err) => {
  console.error('[PREVIEW SERVER UNCAUGHT]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[PREVIEW SERVER REJECTION]', reason);
});

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  req.on('error', (err) => {
    console.error('[REQ ERROR]', err.message);
  });

  res.on('error', (err) => {
    // 客户端提前断开连接属于正常网络行为，静默忽略
  });

  if (!req.url) {
    res.statusCode = 400;
    return res.end('Bad Request');
  }

  try {
    // 解析并去除 query 字符串
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 映射请求路径到本地文件
    let filePath = path.join(DIST_DIR, pathname);

    // 1. 如果路径以 / 结尾或没有扩展名，尝试 index.html
    if (pathname.endsWith('/') || !path.extname(pathname)) {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (fs.existsSync(`${filePath}.html`)) {
        filePath = `${filePath}.html`;
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    // 2. 检查文件是否存在
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (streamErr) => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('File read error');
        }
      });
      res.on('close', () => {
        fileStream.destroy();
      });
      fileStream.pipe(res);
      return;
    }

    // 3. 404 处理
    const notFoundPath = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      const notFoundStream = fs.createReadStream(notFoundPath);
      notFoundStream.on('error', () => res.end('404 Not Found'));
      res.on('close', () => notFoundStream.destroy());
      notFoundStream.pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error: ' + err.message);
    }
  }
});

server.on('clientError', (err, socket) => {
  if (socket.writable) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});

server.on('error', (err) => {
  console.error('[PREVIEW SERVER ERROR]', err.message);
});

server.listen(PORT, () => {
  console.log(`[PREVIEW SERVER] Resilient daemon running at http://localhost:${PORT}/`);
  console.log(`[PREVIEW SERVER] Serving static directory: ${DIST_DIR}`);
});

// 保持常驻
setInterval(() => {}, 60000);
