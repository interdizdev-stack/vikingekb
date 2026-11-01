'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const programBySlug = { sila: 'strength', puls: 'conditioning', opora: 'fitness' };
  const pageProgram = programBySlug[location.pathname.split('/')[2]];
  const selectedProgram = () => $('#trial-program')?.value || pageProgram;
  function emit(name, details = {}, callback) {
    const event = { name, ...details, callback };
    if (window.vikingTrackGoal) window.vikingTrackGoal(event);
    else window.vikingEarlyGoals = [...(window.vikingEarlyGoals || []), event].slice(-40);
  }
  function placement(target) {
    if (target.closest('#detail-dialog')) return $('#detail-content').dataset.source === 'coach' ? 'coach-dialog' : 'studio-dialog';
    for (const [selector, value] of [['.hero','hero'],['.header','header'],['.footer','footer'],['#contacts','contacts'],['#trial','trial']]) if (target.closest(selector)) return value;
    return pageProgram ? 'program-page' : 'page';
  }
  function trackClick(event, target, name, details = {}) {
    const link = target.closest('a');
    // Wait for reachGoal before same-tab navigation, but never delay beyond 250 ms.
    if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && !link.download && (!link.target || link.target === '_self') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && !event.defaultPrevented && document.documentElement.dataset.analyticsEnabled !== 'false') {
      event.preventDefault();
      let navigated = false;
      const navigate = () => { if (!navigated) { navigated = true; location.assign(link.href); } };
      const timeout = setTimeout(navigate, 250);
      emit(name, details, () => { clearTimeout(timeout); navigate(); });
    } else emit(name, details);
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('.book-trigger, [data-marketing="trial-cta"]')) trackClick(event, target, 'trial_cta_click', { placement: placement(target), program: pageProgram || ($('#detail-content')?.contains(target) ? $('#detail-content').dataset.program : undefined) });
    else if (target.matches('.program-detail')) trackClick(event, target, 'program_details_open', { program: target.dataset.program });
    else if (target.matches('.coach-more')) emit('coach_profile_open', { coach: target.dataset.coach });
    else if (target.matches('#open-film')) emit('studio_preview_open');
    else if (target.matches('.filter')) emit('program_filter_selected', { program: target.dataset.filter });
    else if (target.matches('.club-map-link')) trackClick(event, target, 'contacts_map_click');
    else if (target.matches('.menu-toggle') && target.getAttribute('aria-expanded') !== 'true') emit('mobile_menu_open');
    else if (target.matches('#cookie-settings')) emit('cookie_settings_open');
    else if (target.matches('#cookie-accept') && $('#metrica-consent').checked) emit('cookie_notice_accept');
    else if (target.matches('a')) {
      const url = new URL(target.href, location.href);
      if (url.origin !== location.origin) return;
      const linkedProgram = programBySlug[url.pathname.match(/^\/trenirovki\/(sila|puls|opora)\/$/)?.[1]];
      if (linkedProgram) { trackClick(event, target, 'program_details_open', { program: linkedProgram }); return; }
      const documentName = url.pathname.match(/\/(privacy|consent|cookies|metrica-consent)\.html$/)?.[1];
      if (documentName) trackClick(event, target, 'legal_document_open', { document: documentName });
      else if (['programs','coaches','community','studio','first-visit','trial','contacts'].includes(url.hash.slice(1))) emit('navigation_section_click', { section: url.hash.slice(1), placement: placement(target) });
    }
  }, true);

  let formStarted = false;
  const form = $('#trial-form');
  document.addEventListener('viking:marketing-event', event => {
    if (event.detail?.name === 'trial_form_open') formStarted = false;
  });
  function startForm() {
    if (formStarted || !$('#booking-dialog').open) return;
    formStarted = true;
    emit('trial_form_start', { program: selectedProgram() });
  }
  form?.addEventListener('input', startForm);
  form?.addEventListener('change', startForm);
  $('#trial-program')?.addEventListener('change', () => emit('training_goal_selected', { program: selectedProgram() }));
  for (const field of ['date', 'time']) $('#trial-' + field)?.addEventListener('change', () => emit('trial_schedule_changed', { field, program: selectedProgram() }));
  let lastInvalid = 0;
  form?.addEventListener('invalid', event => {
    if (Date.now() - lastInvalid < 1000) return;
    lastInvalid = Date.now();
    const field = { 'trial-phone':'phone', 'trial-date':'date', 'trial-time':'time', 'trial-program':'program', 'personal-consent':'consent' }[event.target.id] || 'other';
    emit('trial_form_validation_error', { field });
  }, true);
  $('#booking-dialog')?.addEventListener('close', () => {
    if ($('#booking-result').hidden) emit('trial_form_abandon', { program: selectedProgram() });
    formStarted = false;
  });
  $('#edit-plan')?.addEventListener('click', () => { formStarted = false; emit('trial_form_restart', { program: selectedProgram() }); });

  document.addEventListener('toggle', event => {
    const item = event.target;
    if (!item.matches?.('.faq-list details') || !item.open) return;
    emit('faq_open', { item: [...item.parentElement.querySelectorAll('details')].indexOf(item) + 1, program: pageProgram });
  }, true);
  if (pageProgram) emit('program_page_view', { program: pageProgram });
  if ('IntersectionObserver' in window) {
    const viewed = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting && !viewed.has(entry.target)) {
        viewed.add(entry.target);
        emit('section_view', { section: entry.target.closest('section').id });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.6 });
    for (const id of ['programs','coaches','community','studio','first-visit','trial','contacts']) {
      const heading = $('#' + id + ' h2');
      if (heading) observer.observe(heading);
    }
  }
})();
