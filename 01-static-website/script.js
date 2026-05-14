const deployTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});

const projectInfo = [
    `📁 项目类型: 静态 HTML 网站`,
    `🐳 容器技术: Nginx`,
    `🌍 部署平台: Dokploy`,
    `⏰ 部署时间: ${deployTime}`,
    `📝 运行环境: Linux (Docker)`
];

document.getElementById('projectInfo').innerHTML = projectInfo.map(item => `<li>${item}</li>`).join('');
document.getElementById('deployTime').textContent = deployTime;

let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
visitCount++;
localStorage.setItem('visitCount', visitCount.toString());
document.getElementById('visitCount').textContent = visitCount;

document.getElementById('fetchDataBtn').addEventListener('click', async () => {
    const resultBox = document.getElementById('result');
    resultBox.classList.add('show');
    resultBox.textContent = '正在获取信息...';

    try {
        const info = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            localStorageKeys: Object.keys(localStorage),
            sessionStorageKeys: Object.keys(sessionStorage),
            timestamp: new Date().toISOString()
        };

        resultBox.innerHTML = `<strong>浏览器信息:</strong>\n${JSON.stringify(info, null, 2)}`;
    } catch (error) {
        resultBox.textContent = `错误: ${error.message}`;
    }
});

document.getElementById('clearCacheBtn').addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    document.getElementById('visitCount').textContent = '0';
    document.getElementById('result').classList.add('show');
    document.getElementById('result').textContent = '本地存储已清除！';
});

console.log('Dokploy 静态网站示例已加载');
console.log('部署时间:', deployTime);