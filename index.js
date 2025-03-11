const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{ERROR_CODE}！ 服务球出问题了！</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            margin-bottom: 25px;
            border-bottom: 2px solid #eee;
            position: relative;
        }
        .branding {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logo {
            max-width: 180px;
            max-height: 200px;
            object-fit: contain;
        }
        .logo-divider {
            border-left: 2px solid #2196F3;
            height: 60px;
            margin:0  70px;
        }
        .company-info {
            font-size: 18px;
            color: #2196F3;
            letter-spacing: 0.8px;
        }
        .code-box {
            background: #2196F3;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            font-size: 32px;
            text-align: center;
            margin: 25px 0;
            letter-spacing: 3px;
            font-family: monospace;
        }
        .info-card {
            background: #f8f9fa;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 15px 0;
            border-radius: 3px;
            transition: transform 0.3s ease;
        }
        .info-card:hover {
            transform: translateX(5px);
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .alert-footer {
            background: linear-gradient(145deg, #f8f9fa 0%, #e3f2fd 100%);
            border-radius: 8px;
            padding: 18px 25px;
            margin-top: 30px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .alert-footer:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(33,150,243,0.15);
        }
        .alert-footer-icon {
            animation: glow 2s ease-in-out infinite;
            flex-shrink: 0;
        }
        @keyframes glow {
            0% { filter: drop-shadow(0 0 2px rgba(33,150,243,0.4)); }
            50% { filter: drop-shadow(0 0 6px rgba(33,150,243,0.8)); }
            100% { filter: drop-shadow(0 0 2px rgba(33,150,243,0.4)); }
        }
        .highlight {
            color: #2196F3;
            font-weight: 600;
            padding: 2px 5px;
            background: rgba(33,150,243,0.1);
            border-radius: 3px;
        }
        .timeline {
            border-left: 2px solid #2196F3;
            margin: 20px 0;
            padding-left: 25px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 头部品牌信息 -->
        <div class="header">
            <div class="branding">
                <img src="https://r2.cf.bqiu.top/app/Snowball_Intelligent.png" class="logo" alt="Logo">
                <div class="logo-divider"></div>
                <div class="company-info">
                    这是在托管在cloudflare的告知页面
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="content">
            <div class="code-box">
                {ERROR_CODE} 服务球出错了！
            </div>
                <div class="info-card">
                    <h3>非常感谢您可以访问雪球Bqiu的网站</h3>
                    <p>我们的服务器出现了一些问题，我们的雪球Bqiu正在努力修复中，请稍后再试。</p>
                    <p>如果您原因提供错误代码的话，请把错误代码<span class="highlight">{ERROR_CODE}</span>提供给雪球Bqiu</p>
                    <p>下面是联系方式：</p>
                    <p>Github：<span class="highlight">https://github.com/SnowBall-Bqiu</span></p>
                    <p>mial：<span class="highlight">wsxqyy@gmail.com</span></p>
                    <p>访问的URL：<span class="highlight">{ERROR_URL}</span></p>
                    <p>错误代码:<span class="highlight">{ERROR_CODE}</span></p>
                </div>
            <div class="alert-footer">
                <img src="https://r2.cf.bqiu.top/app/!.webp">
                <div class="alert-footer-text">
                    <p>如果您遇到问题，欢迎您通过我的联系方式提交问题，感谢您！</p>
                </div>
                <img src="https://r2.cf.bqiu.top/app/boot.gif" class="logo" alt="boot">
            </div>
        </div>
        <div class="footer">
            <p>©2025 雪球Bqiu 版权所有</p>
        </div>
    </div>
</body>
</html>
`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const response = await fetch(request);
    
    // 拦截4xx/5xx错误
    if (response.status >= 400) {
      return renderErrorPage({
        code: response.status,
        url: request.url
      });
    }
    return response;
  } catch (error) {
    // 处理网络错误
    return renderErrorPage({
      code: 503,
      url: request.url
    });
  }
}

function renderErrorPage({ code, url }) {
  // 替换占位符
  const content = HTML_TEMPLATE
    .replace(/{ERROR_CODE}/g, code)
    .replace(/{ERROR_URL}/g, url);

  return new Response(content, {
    status: code,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache'
    }
  });
}
