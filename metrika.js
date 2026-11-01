'use strict';
(() => {
  const counterId = 113656267;
  const scriptUrl = 'https://mc.yandex.ru/metrika/tag.js?id=' + counterId;
  const cookieName = 'forge_privacy_choice';
  let tag = null;
  let active = false;
  let started = false;
  let reloading = false;
  const queueKey = 'viking_pending_goals_v1';
  const programs = ['strength', 'conditioning', 'fitness'];
  const placements = ['hero', 'header', 'footer', 'contacts', 'program-page', 'coach-dialog', 'studio-dialog', 'trial', 'page'];
  const sections = ['programs', 'coaches', 'community', 'studio', 'first-visit', 'trial', 'contacts'];
  // Per-event schemas prevent contact details and arbitrary text from reaching Metrica.
  const goals = {
    trial_cta_click: { placement: placements, program: programs },
    trial_form_open: { program: programs },
    trial_form_start: { program: programs },
    training_goal_selected: { program: programs },
    trial_schedule_changed: { field: ['date', 'time'], program: programs },
    trial_form_validation_error: { field: ['phone', 'date', 'time', 'program', 'consent', 'other'] },
    trial_form_preview_completed: { program: programs, delivery: ['frontend-stub'] },
    trial_calendar_download: { program: programs },
    trial_form_restart: { program: programs },
    trial_form_abandon: { program: programs },
    program_filter_selected: { program: ['all', ...programs] },
    program_details_open: { program: programs },
    program_page_view: { program: programs },
    coach_profile_open: { coach: ['marcus', 'elena', 'jordan'] },
    studio_preview_open: {},
    member_story_view: { story: [1,2,3,4,5,6,7,8], direction: ['next', 'previous'] },
    faq_open: { item: [1,2,3,4,5,6,7,8], program: programs },
    section_view: { section: sections },
    navigation_section_click: { section: sections, placement: placements },
    mobile_menu_open: {},
    contacts_map_click: {},
    legal_document_open: { document: ['privacy', 'consent', 'cookies', 'metrica-consent'] },
    cookie_settings_open: {},
    cookie_notice_accept: {}
  };
  let pending = [];
  function sanitize(details) {
    if (!details || !Object.hasOwn(goals, details.name)) return null;
    const parameters = {};
    for (const [key, values] of Object.entries(goals[details.name])) if (values.includes(details[key])) parameters[key] = details[key];
    return { name: details.name, parameters };
  }
  function persist() {
    try {
      if (pending.length) sessionStorage.setItem(queueKey, JSON.stringify(pending.map(({name, parameters, createdAt}) => ({name, parameters, createdAt}))));
      else sessionStorage.removeItem(queueKey);
    } catch { /* Tracking must not depend on storage being available. */ }
  }
  function restore() {
    try {
      const raw = sessionStorage.getItem(queueKey);
      sessionStorage.removeItem(queueKey);
      if (!allowed() || !raw || raw.length > 20000) return;
      const entries = JSON.parse(raw);
      if (!Array.isArray(entries)) return;
      for (const entry of entries.slice(-40)) {
        const clean = sanitize({ ...entry.parameters, name: entry.name });
        if (clean && Number.isFinite(entry.createdAt) && Date.now() - entry.createdAt >= 0 && Date.now() - entry.createdAt < 60000) pending.push({ ...clean, createdAt: entry.createdAt });
      }
    } catch {}
  }
  function send(goal) {
    try { window.ym(counterId, 'reachGoal', goal.name, goal.parameters, goal.callback); }
    catch { goal.callback?.(); }
  }
  function flush() {
    if (!active || !allowed() || reloading) return;
    const ready = pending;
    pending = [];
    persist();
    for (const goal of ready) if (Date.now() - goal.createdAt < 60000) send(goal);
  }
  function track(details) {
    if (!allowed() || reloading) return;
    const clean = sanitize(details);
    if (!clean) return;
    const goal = { ...clean, createdAt: Date.now(), callback: typeof details.callback === 'function' ? details.callback : undefined };
    if (active) send(goal);
    else { pending.push(goal); pending = pending.slice(-40); persist(); }
  }

  function allowed() {
    const preference = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(cookieName + '='));
    const value = preference?.slice(cookieName.length + 1);
    // Analytics starts by default. An explicit visitor refusal remains binding.
    return !['v2-essential','v3-essential','v4-essential'].includes(value);
  }
  function state(value) {
    document.documentElement.dataset.metrikaState = value;
  }
  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(part => part.trim().split('=')[0]).filter(name => /^_ym_/.test(name));
    const hostParts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < hostParts.length - 1; i++) domains.push(hostParts.slice(i).join('.'));
    const paths = new Set(['/']);
    const parts = location.pathname.split('/').filter(Boolean);
    for (let i = 1; i <= parts.length; i++) paths.add('/' + parts.slice(0,i).join('/') + '/');
    for (const name of names) for (const path of paths) for (const domain of domains) {
      document.cookie = name + '=; Max-Age=0; Path=' + path + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    }
  }
  function stop() {
    const mustReload = started;
    active = false;
    pending = [];
    persist();
    if (started && typeof window.ym === 'function') {
      try { window.ym(counterId, 'destruct'); } catch {}
    }
    if (tag) { tag.onload = tag.onerror = null; tag.remove(); tag = null; }
    clearAnalyticsCookies();
    state('disabled');
    // A clean reload also removes a vendor script that was already executing.
    // The stored refusal prevents it from loading again on the next document.
    if (mustReload && !reloading) { reloading = true; location.reload(); }
  }
  function start() {
    if (!allowed() || active || tag || reloading) return;
    started = true;
    state('loading');
    window.dataLayer = window.dataLayer || [];
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = window.ym.l || Date.now();
    tag = document.createElement('script');
    tag.id = 'viking-metrika-tag';
    tag.async = true;
    tag.src = scriptUrl;
    tag.onload = () => {
      if (!allowed() || reloading) { stop(); return; }
      if (active) return;
      try {
        window.ym(counterId, 'init', {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: 'dataLayer',
          referrer: document.referrer,
          url: location.href,
          accurateTrackBounce: true,
          trackLinks: true
        });
        active = true;
        state('active');
        flush();
      } catch { state('error'); }
    };
    tag.onerror = () => {
      if (tag) tag.remove();
      tag = null;
      state('error');
    };
    document.head.append(tag);
  }
  function reconcile() {
    const enabled = allowed();
    document.documentElement.dataset.analyticsEnabled = String(enabled);
    if (enabled) start();
    else stop();
  }
  document.addEventListener('viking:privacy-choice', reconcile);
  window.addEventListener('pageshow', reconcile);
  window.addEventListener('focus', reconcile);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) reconcile(); });

  restore();
  persist();
  document.addEventListener('viking:marketing-event', event => track(event.detail));
  // marketing.js can run first if this async script is slow to download.
  window.vikingTrackGoal = track;
  for (const details of window.vikingEarlyGoals || []) track(details);
  window.vikingEarlyGoals = [];
  reconcile();
})();
