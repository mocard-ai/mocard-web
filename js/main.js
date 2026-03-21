/**
 * MoCard - Shared JavaScript
 * - Hamburger menu toggle
 * - FAQ Accordion
 * - App CTA（立即使用）：手機直接開新分頁；電腦/平板顯示 QR Code 彈窗
 */

const APP_URL = 'https://mocard-app.web.app/';
const MOBILE_BREAKPOINT = 768;

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAccordion();
  initAppCta();
});

function initAppCta() {
  createAppCtaModal();
  document.querySelectorAll('.header-cta, .cta-button, .article-cta-btn').forEach(function(el) {
    if (el.tagName !== 'A') return;
    el.href = APP_URL;
    el.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        window.open(APP_URL, '_blank', 'noopener,noreferrer');
      } else {
        showAppCtaModal();
      }
    });
  });
}

function createAppCtaModal() {
  if (document.getElementById('app-cta-modal')) return;
  var modal = document.createElement('div');
  modal.id = 'app-cta-modal';
  modal.className = 'app-cta-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'app-cta-modal-title');
  modal.innerHTML = '<div class="app-cta-modal-backdrop"></div>' +
    '<div class="app-cta-modal-content">' +
      '<button type="button" class="app-cta-modal-close" aria-label="關閉">&times;</button>' +
      '<h2 id="app-cta-modal-title">請用手機開啟</h2>' +
      '<p class="app-cta-modal-text">請用手機掃描下方 QR Code，用手機瀏覽器開啟 MoCard</p>' +
      '<div class="app-cta-qr-placeholder"><img src="images/qrcode.png" alt="MoCard QR Code"><p class="app-cta-qr-hint">此處預留放置 QR Code</p></div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.app-cta-modal-backdrop').addEventListener('click', hideAppCtaModal);
  modal.querySelector('.app-cta-modal-close').addEventListener('click', hideAppCtaModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hideAppCtaModal();
  });
}

function showAppCtaModal() {
  var m = document.getElementById('app-cta-modal');
  if (m) { m.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
}

function hideAppCtaModal() {
  var m = document.getElementById('app-cta-modal');
  if (m) { m.classList.remove('is-open'); document.body.style.overflow = ''; }
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', menu.classList.contains('is-open'));
  });

  // Close menu when clicking a link (for in-page nav)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
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
