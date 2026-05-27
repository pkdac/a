/* ===== 导航栏滚动效果 ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== 移动端菜单切换 ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

/* 点击导航链接后自动关闭菜单 */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ===== 滚动时高亮当前 Section ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => observer.observe(s));

/* ===== Toast 提示组件 ===== */
function showToast(message) {
  // 移除已有 toast
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // 触发动画
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // 自动消失
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* ===== 订阅表单 ===== */
document.getElementById('subscribeForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = this.querySelector('input');
  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ 请输入有效的邮箱地址');
    return;
  }

  showToast('✅ 订阅成功！感谢你的关注 🎉');
  input.value = '';
});

/* ===== 联系表单 ===== */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const inputs = this.querySelectorAll('input, textarea');
  let valid = true;

  inputs.forEach(inp => {
    if (!inp.value.trim()) valid = false;
  });

  if (!valid) {
    showToast('⚠️ 请填写所有字段');
    return;
  }

  showToast('✅ 消息已发送，我会尽快回复你！');
  this.reset();
});

/* ===== 键盘快捷键 ESC 关闭菜单 ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

/* ===== 轮播图 ===== */
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const slides = carouselTrack.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

let currentIndex = 0;
let autoPlayTimer = null;
const AUTO_PLAY_INTERVAL = 4000; // ms

/* 创建底部指示器 */
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `第 ${i + 1} 张图片`);
  dot.dataset.index = i;
  carouselDots.appendChild(dot);
}

const dots = carouselDots.querySelectorAll('.dot');

/* 跳转到指定索引 */
function goToSlide(index) {
  // 循环处理
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentIndex = index;

  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  // 更新指示器
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

/* 下一张 */
function nextSlide() { goToSlide(currentIndex + 1); }

/* 上一张 */
function prevSlide() { goToSlide(currentIndex - 1); }

/* 自动播放 */
function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

/* 事件绑定：按钮 */
carouselNext.addEventListener('click', () => {
  nextSlide();
  restartAutoPlay();
});

carouselPrev.addEventListener('click', () => {
  prevSlide();
  restartAutoPlay();
});

/* 事件绑定：指示器点击 */
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    restartAutoPlay();
  });
});

/* 鼠标悬停暂停自动播放 */
const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

/* 触摸滑动支持 */
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  isDragging = true;
  stopAutoPlay();
}, { passive: true });

carousel.addEventListener('touchmove', e => {
  if (!isDragging) return;
  touchEndX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;

  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
  restartAutoPlay();
}, { passive: true });

/* 键盘左右键切换 */
document.addEventListener('keydown', e => {
  // 只在轮播可见时响应
  const rect = carousel.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (!isVisible) return;

  if (e.key === 'ArrowLeft') { prevSlide(); restartAutoPlay(); }
  if (e.key === 'ArrowRight') { nextSlide(); restartAutoPlay(); }
});

/* 启动自动播放 */
startAutoPlay();
