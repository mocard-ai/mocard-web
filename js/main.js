/**
 * MoCard - Shared JavaScript
 * - Hamburger menu toggle
 * - FAQ Accordion
 * - App CTA（立即使用）：
 *   - 桌機／平板：QR Code 彈窗
 *   - 手機：① 為 App 內建瀏覽器時 → 「請用外部瀏覽器」bottom sheet → 結束後不開連結；
 *          ② 否則 →「加入主畫面／PWA」bottom sheet → 按「我知道了」才開連結。
 */

const APP_URL = 'https://mocard-app.web.app/';
const MOBILE_BREAKPOINT = 768;
const INAPP_GUIDE_STORAGE_KEY = 'mocard_inapp_guide_dismissed';

/**
 * 是否為 FB / IG / Threads / LINE 等 App 內建瀏覽器（UA 判斷，非 100% 可靠）。
 * Threads 內建瀏覽器常帶 Meta「Barcelona」組件與 IABMV，UA 未必含 "Threads"。
 */
function isMoCardInAppBrowser() {
  if (typeof navigator === 'undefined' || !navigator.userAgent) return false;
  var ua = navigator.userAgent;

  if (/Instagram/i.test(ua)) return true;
  if (/Line\/[0-9]/i.test(ua)) return true;
  if (/\bThreads\b|[\s;_]THREADS\b|Threads-iOS/i.test(ua)) return true;
  /* Threads in-app：UA 多為 … Mobile/… Barcelona … IABMV/1 … */
  if (/\bBarcelona\b/i.test(ua)) return true;
  if (/\bIABMV\//i.test(ua)) return true;
  if (/FBAN\/|FBAV\/|\bFBAN\b|\bFBAV\b|FB_IAB|FB_IAB_\d+|FBIDS|\bFB4A\b/i.test(ua))
    return true;

  return false;
}

/** 任一全螢幕底層／彈窗開啟時鎖住 body 捲動 */
function syncBodyScrollLock() {
  var pwa = document.getElementById('mobile-pwa-sheet');
  var qr = document.getElementById('app-cta-modal');
  var inapp = document.getElementById('inapp-browser-sheet');
  var any = false;
  if (inapp && inapp.classList.contains('is-open')) any = true;
  if (pwa && pwa.classList.contains('is-open')) any = true;
  if (qr && qr.classList.contains('is-open')) any = true;
  document.body.style.overflow = any ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAccordion();
  initAppCta();
});

function initAppCta() {
  createInAppBrowserSheet();
  createMobilePwaSheet();
  createAppCtaModal();
  document.querySelectorAll('.header-cta, .cta-button, .article-cta-btn').forEach(function (el) {
    if (el.tagName !== 'A') return;
    el.href = APP_URL;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (isMoCardInAppBrowser()) {
          showInAppBrowserSheet();
        } else {
          showMobilePwaSheet();
        }
      } else {
        showAppCtaModal();
      }
    });
  });

  /** 給 index 的 inapp-browser.js：載入後自動顯示（尊重 session 關閉記錄） */
  window.MoCardTryAutoShowInAppGuideOnLoad = function () {
    var sheet = document.getElementById('inapp-browser-sheet');
    if (!sheet) return;
    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem(INAPP_GUIDE_STORAGE_KEY) === '1';
    } catch (err) {
      dismissed = false;
    }
    if (dismissed || !isMoCardInAppBrowser()) return;
    showInAppBrowserSheet();
  };
}

/** 社群／通訊 App 內建瀏覽器時：請改以外開 */
function createInAppBrowserSheet() {
  if (document.getElementById('inapp-browser-sheet')) return;
  var root = document.createElement('div');
  root.id = 'inapp-browser-sheet';
  root.className = 'inapp-sheet';
  root.setAttribute('aria-hidden', 'true');
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-labelledby', 'inapp-sheet-title');
  root.setAttribute('aria-modal', 'true');
  root.innerHTML =
    '<div class="inapp-sheet-backdrop" data-inapp-sheet-close></div>' +
    '<div class="inapp-sheet-panel">' +
      '<button type="button" class="inapp-sheet-close" aria-label="關閉" data-inapp-sheet-close>&times;</button>' +
      '<div class="inapp-sheet-brand">' +
        '<img src="images/favicon.png" alt="MoCard">' +
      '</div>' +
      '<h2 id="inapp-sheet-title" class="inapp-sheet-title">請改用外部瀏覽器開啟</h2>' +
      '<p class="inapp-sheet-intro">為了完整使用 MoCard 功能，請依下列方式用 Safari、Chrome 等瀏覽器開啟此頁。</p>' +
      '<div class="inapp-sheet-steps">' +
        '<div class="inapp-sheet-step">' +
          '<span class="inapp-sheet-step-num" aria-hidden="true">1</span>' +
          '<p class="inapp-sheet-step-text">點擊<strong>右上角</strong>或<strong>右下角</strong>選單圖示，開啟操作選項</p>' +
        '</div>' +
        '<div class="inapp-sheet-step">' +
          '<span class="inapp-sheet-step-num" aria-hidden="true">2</span>' +
          '<p class="inapp-sheet-step-text">選擇<strong>「使用瀏覽器開啟」</strong>或<strong>「在瀏覽器中開啟」</strong></p>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  function dismiss() {
    hideInAppBrowserSheet();
  }

  root.querySelectorAll('[data-inapp-sheet-close]').forEach(function (node) {
    node.addEventListener('click', dismiss);
  });

  document.addEventListener(
    'keydown',
    function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        dismiss();
      }
    },
    { passive: true }
  );
}

function showInAppBrowserSheet() {
  var sheet = document.getElementById('inapp-browser-sheet');
  if (!sheet) return;
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  syncBodyScrollLock();
  var btn = sheet.querySelector('.inapp-sheet-close');
  if (btn) btn.focus({ preventScroll: true });
}

function hideInAppBrowserSheet() {
  var sheet = document.getElementById('inapp-browser-sheet');
  if (!sheet) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  try {
    sessionStorage.setItem(INAPP_GUIDE_STORAGE_KEY, '1');
  } catch (err) {
    /* ignore */
  }
  syncBodyScrollLock();
}

function createMobilePwaSheet() {
  if (document.getElementById('mobile-pwa-sheet')) return;
  var root = document.createElement('div');
  root.id = 'mobile-pwa-sheet';
  root.className = 'mobile-pwa-sheet';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'mobile-pwa-sheet-title');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<div class="mobile-pwa-sheet-backdrop" data-mobile-pwa-dismiss tabindex="-1"></div>' +
    '<div class="mobile-pwa-sheet-panel">' +
    '<h2 id="mobile-pwa-sheet-title" class="mobile-pwa-sheet-title">註冊前可將網頁加入主畫面<br>已獲得最佳使用體驗</h2>' +
    '<div class="mobile-pwa-sheet-media">' +
    '<img src="images/chrome_pwa.GIF" alt="將網頁加入主畫面操作示意（以 Chrome 為例）" loading="lazy">' +
    '</div>' +
    '<button type="button" class="mobile-pwa-sheet-confirm">我知道了</button>' +
    '</div>';
  document.body.appendChild(root);

  root.querySelectorAll('[data-mobile-pwa-dismiss]').forEach(function (node) {
    node.addEventListener('click', function () {
      hideMobilePwaSheet();
    });
  });

  root.querySelector('.mobile-pwa-sheet-confirm').addEventListener('click', function () {
    hideMobilePwaSheet();
    window.open(APP_URL, '_blank', 'noopener,noreferrer');
  });

  document.addEventListener(
    'keydown',
    function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        hideMobilePwaSheet();
      }
    },
    { passive: true }
  );
}

function showMobilePwaSheet() {
  var sheet = document.getElementById('mobile-pwa-sheet');
  if (!sheet) return;
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  syncBodyScrollLock();
  var btn = sheet.querySelector('.mobile-pwa-sheet-confirm');
  if (btn) btn.focus({ preventScroll: true });
}

function hideMobilePwaSheet() {
  var sheet = document.getElementById('mobile-pwa-sheet');
  if (!sheet) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  syncBodyScrollLock();
}

function createAppCtaModal() {
  if (document.getElementById('app-cta-modal')) return;
  var modal = document.createElement('div');
  modal.id = 'app-cta-modal';
  modal.className = 'app-cta-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'app-cta-modal-title');
  modal.innerHTML =
    '<div class="app-cta-modal-backdrop"></div>' +
    '<div class="app-cta-modal-content">' +
    '<button type="button" class="app-cta-modal-close" aria-label="關閉">&times;</button>' +
    '<h2 id="app-cta-modal-title">請用手機開啟</h2>' +
    '<p class="app-cta-modal-text">請用手機掃描下方 QR Code，用手機瀏覽器開啟 MoCard</p>' +
    '<div class="app-cta-qr-placeholder"><img src="images/qrcode.png" alt="MoCard QR Code"><p class="app-cta-qr-hint">此處預留放置 QR Code</p></div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.app-cta-modal-backdrop').addEventListener('click', hideAppCtaModal);
  modal.querySelector('.app-cta-modal-close').addEventListener('click', hideAppCtaModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideAppCtaModal();
  });
}

function showAppCtaModal() {
  var m = document.getElementById('app-cta-modal');
  if (m) {
    m.classList.add('is-open');
    syncBodyScrollLock();
  }
}

function hideAppCtaModal() {
  var m = document.getElementById('app-cta-modal');
  if (m) {
    m.classList.remove('is-open');
    syncBodyScrollLock();
  }
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    const open = menu.classList.contains('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '開啟選單');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '開啟選單');
    }
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}
