/**
 * 首頁：若為 App 內建瀏覽器進站，自動彈出「請用外部瀏覽器」引導（與 sheet 共用 main.js）。
 * 共用邏輯與儲存鍵請見 js/main.js 的 isMoCardInAppBrowser、MoCardTryAutoShowInAppGuideOnLoad。
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.MoCardTryAutoShowInAppGuideOnLoad === 'function') {
      window.MoCardTryAutoShowInAppGuideOnLoad();
    }
  });
})();
