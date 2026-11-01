'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const cookieName = 'forge_privacy_choice';
  const cookieBanner = $('#cookie-banner');
  const analyticsConsent = $('#metrica-consent');
  const analyticsSettings = $('#cookie-analytics-settings');
  const acceptButton = $('#cookie-accept');
  const rejectButton = $('#cookie-reject');
  const settingsButton = $('#cookie-settings');
  const noticeVersion = '2026-10-16-v4';

  function readCookieChoice() {
    try {
      const match = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(cookieName + '='));
      if (!match) return null;
      const value = match.slice(cookieName.length + 1);
      if (value === 'v4-accepted') return {analytics:true,acknowledged:true};
      if (['v2-essential','v3-essential','v4-essential'].includes(value)) return {analytics:false,acknowledged:true};
    } catch {}
    return null;
  }
  let savedCookieChoice = readCookieChoice();
  function reflectAnalyticsChoice(choice) {
    const analytics = choice?.analytics !== false;
    analyticsConsent.checked = analytics;
    document.documentElement.dataset.analyticsEnabled = String(analytics);
    // Notice acknowledgement and affirmative PDn consent are distinct states.
    document.documentElement.dataset.analyticsConsent = analytics ? (choice?.acknowledged ? 'acknowledged' : 'not-acknowledged') : 'denied';
    document.dispatchEvent(new CustomEvent('viking:privacy-choice', {detail:{analytics,acknowledged:choice?.acknowledged === true,version:noticeVersion}}));
  }
  function showCookieBanner(settings = false) {
    savedCookieChoice = readCookieChoice();
    analyticsConsent.checked = savedCookieChoice?.analytics !== false;
    analyticsSettings.hidden = !settings;
    rejectButton.hidden = !settings;
    acceptButton.textContent = settings ? 'СОХРАНИТЬ' : 'ПРИНЯТЬ';
    cookieBanner.hidden = false;
    settingsButton.setAttribute('aria-expanded','true');
  }
  function closeCookieBanner() {
    const restoreFocus = cookieBanner.contains(document.activeElement);
    cookieBanner.hidden = true;
    settingsButton.setAttribute('aria-expanded','false');
    if (restoreFocus) settingsButton.focus({preventScroll:true});
  }
  function saveCookieChoice(analytics) {
    savedCookieChoice = {analytics:analytics === true,acknowledged:true};
    const value = savedCookieChoice.analytics ? 'v4-accepted' : 'v4-essential';
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    try {document.cookie = cookieName + '=' + value + '; Max-Age=15552000; Path=/; SameSite=Lax' + secure;} catch {}
    reflectAnalyticsChoice(savedCookieChoice);
    closeCookieBanner();
  }
  acceptButton.addEventListener('click',() => saveCookieChoice(analyticsConsent.checked));
  rejectButton.addEventListener('click',() => saveCookieChoice(false));
  settingsButton.setAttribute('aria-controls','cookie-banner');
  settingsButton.setAttribute('aria-expanded','false');
  settingsButton.addEventListener('click',() => showCookieBanner(true));
  reflectAnalyticsChoice(savedCookieChoice);
  if (!savedCookieChoice?.acknowledged) showCookieBanner();
})();
