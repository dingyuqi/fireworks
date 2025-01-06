// 主入口函数，确保 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  setupBackgroundMusic();
  setupFireworks();
  setupEasterEgg();
  setupTextInput();
  setupPresetTexts();
});

/** 设置背景音乐 */
function setupBackgroundMusic() {
  const music = document.getElementById('backgroundMusic');

  const playMusic = () => {
    music.play().catch(() => {
      console.log('自动播放被阻止，将等待用户交互后播放。');
    });
  };

  // 页面加载时尝试播放背景音乐
  playMusic();

  // 第一次点击触发播放
  document.addEventListener('click', () => {
    if (music.paused) {
      music.play();
    }
  }, { once: true });
}

/** 初始化烟花和点击事件 */
function setupFireworks() {
  const container = document.querySelector('.fireworks');
  if (!container) {
    console.error('容器元素 .fireworks 未找到!');
    return;
  }

  const fireworks = new Fireworks.default(container);
  fireworks.updateOptions({sound:{enabled: true, files: [
        'explosion0.mp3',
        'explosion1.mp3',
        'explosion2.mp3'
      ],volume:6 }})
  const confirmButton = document.getElementById('confirmButton');

  // 点击页面触发烟花和文字
  container.addEventListener('click', (e) => {
    handleContainerClick(e, container, fireworks);
  });

  // 确认按钮事件
  confirmButton.addEventListener('click', () => {
    handleConfirmButton(container, fireworks);
  });
}

/** 设置彩蛋逻辑 */
function setupEasterEgg() {
  const container = document.querySelector('.fireworks');
  const easterEgg = document.getElementById('easterEgg');
  const clickTimes = [];
  const triggerTimeLimit = 1000; // 时间限制(毫秒)
  const requiredClicks = 5; // 所需点击次数

  container.addEventListener('click', () => {
    const currentTime = Date.now();
    clickTimes.push(currentTime);

    if (clickTimes.length >= requiredClicks && currentTime - clickTimes[0] <= triggerTimeLimit) {
      showEasterEgg(easterEgg);
      clickTimes.length = 0;
    }

    if (currentTime - clickTimes[0] > triggerTimeLimit) {
      clickTimes.shift();
    }
  });
}

/** 设置输入框和文字预置逻辑 */
function setupTextInput() {
  const textInput = document.getElementById('textInput');
  textInput.addEventListener('input', () => {
    updateTextList(textInput.value);
  });
}

/** 设置预置字符串逻辑 */
function setupPresetTexts() {
  const textInput = document.getElementById('textInput');
  const presetTexts = document.querySelectorAll('.presetText');

  presetTexts.forEach(preset => {
    preset.addEventListener('click', () => {
      textInput.value = preset.textContent;
      updateTextList(textInput.value);
    });
  });
}

/** 处理点击容器事件 */
function handleContainerClick(event, container, fireworks) {
  const { clientX: x, clientY: y } = event;

  createRipple(container, x, y);
  createText(container, x, y);
  fireworks.launch(1);
}

/** 处理确认按钮点击事件 */
function handleConfirmButton(container, fireworks) {
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  /** 更新文字列表 */
  updateTextList(textInput.value);
  createText(container, centerX, centerY);
  fireworks.launch(1);
}

function updateTextList(input) {
  textList = input.trim().split(/\s+/).filter(Boolean);
  currentTextIndex = 0;
}


/** 创建文字 */
let currentTextIndex = 0;
let textList = [];
function createText(container, x, y) {
  const text = textList[currentTextIndex] || '蛇年快乐';
  const message = document.createElement('div');
  message.className = 'text';
  message.innerText = text;
  message.style.left = `${x}px`;
  message.style.top = `${y}px`;
  message.style.color = 'rgb(200, 60, 35)';

  container.appendChild(message);

  setTimeout(() => message.remove(), 2000);
  currentTextIndex = (currentTextIndex + 1) % textList.length;
}

/** 显示彩蛋 */
function showEasterEgg(easterEgg) {
  easterEgg.classList.add('visible');
  setTimeout(() => easterEgg.classList.remove('visible'), 1000);
}

/** 创建涟漪特效 */
function createRipple(container, x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  container.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
