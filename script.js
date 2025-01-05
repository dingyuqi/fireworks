// script.js
// 确保 DOM 加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', () => {
  // 获取容器元素
  const container = document.querySelector('.fireworks');

  // 确保 container 元素存在
  if (!container) {
    console.error('容器元素 .fireworks 未找到!');
    return;
  }
  const fireworks = new Fireworks.default(container);
  const textInput = document.getElementById('textInput');

  // 用于存储点击时间戳
  let clickTimes = [];
  // 设置触发彩蛋的点击次数和时间间隔
  const triggerTimeLimit = 1000; // 时间限制(秒)
  const requiredClicks = 5; // 需要点击次数
  // 获取彩蛋元素
  const easterEgg = document.getElementById('easterEgg');

  /*
  ===以下是文字部分===
  */

  // 用于存储从输入框中解析出来的文字列表
  let textList = [];
  let currentTextIndex = 0;

  // 创建文字掉落
  function createText(x, y) {
    const text = textList[currentTextIndex] || '蛇年快乐';
    const message = document.createElement('div');
    message.className = 'text';
    message.innerText = text;
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;
    message.style.color = 'rgb(200, 60, 35)';
    container.appendChild(message);

    // 移除文字
    setTimeout(() => message.remove(), 2000);
    // 更新索引，循环使用文字列表中的元素
    currentTextIndex = (currentTextIndex + 1) % textList.length;
  }

  /*
  ===以下是监听部分===
  */
  // 鼠标点击事件
  container.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    // 创建文字掉落
    createText(x, y);
    // 记录点击时间
    const currentTime = new Date().getTime(); // 获取当前时间戳
    clickTimes.push(currentTime);
    // 如果短时间内连续点击了 requiredClicks 次
    if (clickTimes.length >= requiredClicks && currentTime - clickTimes[0] <= triggerTimeLimit) {
      // 显示彩蛋
      easterEgg.classList.add('visible');
      
      // 1秒后隐藏彩蛋
      setTimeout(() => {
        easterEgg.classList.remove('visible');
      }, 1000);
      // 清空点击记录
      clickTimes = [];
    }

    // 超过2秒后清空点击记录
    if (currentTime - clickTimes[0] > triggerTimeLimit) {
      clickTimes.shift();
    }
    
    // 启动烟花效果
    fireworks.launch(1);

  });

  // 监听输入框的变化
  textInput.addEventListener('input', () => {
    // 当用户输入文字时，更新文字掉落效果
    textList = textInput.value.trim().split(/\s+/).filter(Boolean);   // 按空格拆分文本
    currentTextIndex = 0;  // 重置索引
  });
});
