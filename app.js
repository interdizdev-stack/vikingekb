'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function reportAction(name, details = {}) {
  const event = { name, ...details };
  document.dispatchEvent(new CustomEvent('viking:marketing-event', { detail: event }));
  if (!window.vikingTrackGoal) window.vikingEarlyGoals = [...(window.vikingEarlyGoals || []), event].slice(-40);
}
const programs = {
  strength: { name: 'ВИКИНГ Сила', label: 'НАБРАТЬ МЫШЦЫ', duration: 55, subtitle: 'СИЛА, КОТОРАЯ ОСТАЁТСЯ С ТОБОЙ.', description: 'Продуманная силовая программа на основе главных движений. Учись осознанно работать с весами, совершенствуй технику и чувствуй себя увереннее со штангой.', features: ['Разминка и подготовка к нагрузке с тренером', 'Постепенный прогресс в приседаниях, наклонах, жимах и тягах', 'Малые группы и индивидуальная работа над техникой', 'Нагрузка с учётом твоего опыта'], goal: 'Набрать мышечную массу и стать сильнее', coach: 'Артём Соколов', rhythm: 'Понедельник, среда и пятница' },
  conditioning: { name: 'ВИКИНГ Пульс', label: 'СЖЕЧЬ ЛИШНЕЕ', duration: 45, subtitle: 'ОТКРОЙ В СЕБЕ ВТОРОЕ ДЫХАНИЕ.', description: 'Энергичное сочетание интервалов, элементов бокса и нагрузки на всё тело. Тренируйся в своём темпе: тренер подберёт интенсивность, а команда поможет не сбавлять ход.', features: ['Динамическая разминка и активация мышц', 'Силовые круги и кардиоинтервалы', 'Элементы бокса и работа с оборудованием', 'Интенсивность для любого уровня подготовки'], goal: 'Развить выносливость и работоспособность', coach: 'Дмитрий Орлов', rhythm: 'Вторник, четверг и суббота' },
  fitness: { name: 'ВИКИНГ Опора', label: 'ДВИГАТЬСЯ ЛЕГЧЕ', duration: 50, subtitle: 'СВОБОДА ДВИЖЕНИЯ. СИЛА КАЖДЫЙ ДЕНЬ.', description: 'Заложи основу для движения в жизни и спорте. Функциональная сила, мобильность и стабильность корпуса — в дружелюбном формате, где базовые навыки доступны каждому.', features: ['Оценка движений и разминка с тренером', 'Базовые силовые движения и упражнения с весом тела', 'Мобильность, баланс и стабильность корпуса', 'Поддержка для новичков и тех, кто возвращается к занятиям'], goal: 'Развить функциональную силу и уверенность', coach: 'Елена Волкова', rhythm: 'Понедельник, вторник, четверг и воскресенье' }
};
const coaches = {
  marcus: { name: 'АРТЁМ СОКОЛОВ', role: 'СТАРШИЙ ТРЕНЕР / СИЛА И ФИЗПОДГОТОВКА', intro: 'Двенадцать лет помогает превращать намерения в устойчивые привычки. Артём объясняет сложное просто: научный подход к тренировкам сочетается с терпеливой и понятной работой в зале.', education: 'Российский университет спорта «ГЦОЛИФК», направление «Физическая культура».', certs: ['Диплом профпереподготовки «Персональный тренер» (Россия)', 'Повышение квалификации «Силовая подготовка» (Россия)'], philosophy: '«Лучший повтор — тот, который ты делаешь осознанно. С этого и начнём».', program: 'strength' },
  elena: { name: 'ЕЛЕНА ВОЛКОВА', role: 'ТРЕНЕР ПО ДВИЖЕНИЮ / ФУНКЦИОНАЛЬНАЯ СИЛА', intro: 'Елена помогает двигаться уверенно. За восемь лет тренерской практики она научилась превращать работу над базой в устойчивый прогресс — и для новичков, и для опытных участников.', education: 'НГУ имени П. Ф. Лесгафта, Санкт-Петербург, направление «Физическая культура».', certs: ['Диплом профпереподготовки «Фитнес-тренер» (Россия)', 'Повышение квалификации «Функциональный тренинг» (Россия)'], philosophy: '«Сила — это уверенность, что тело справится с задачей».', program: 'fitness' },
  jordan: { name: 'ДМИТРИЙ ОРЛОВ', role: 'ТРЕНЕР ПО ВЫНОСЛИВОСТИ / ФИЗПОДГОТОВКА', intro: 'Дмитрий — это десять лет опыта и заразительная любовь к тренировкам. Его занятия сочетают продуманную нагрузку, понятные объяснения и энергию, которая заряжает весь зал.', education: 'Российский университет спорта «ГЦОЛИФК», направление «Физическая культура».', certs: ['Диплом профпереподготовки «Тренер по физической подготовке» (Россия)', 'Повышение квалификации «Общая физическая подготовка» (Россия)'], philosophy: '«Не нужно никого догонять. Просто продолжай приходить ради себя».', program: 'conditioning' }
};
const stories = [
  { name: 'АННА МОРОЗОВА', program: 'УЧАСТНИЦА ПРОГРАММЫ «ВИКИНГ СИЛА»', quote: 'Я пришла стать сильнее.<br>И встретила людей,<br>которые в меня поверили.', description: 'От неуверенности в тренажёрном зале — к первым самостоятельным подходам. Маленькие шаги, поддержка тренера и команда, которая радуется каждой победе.', stats: [['12', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['3×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/photos/photo-1550345332-09e3ac987658.webp', alt: 'Участница силовой тренировки со штангой' },
  { name: 'АНДРЕЙ КУЗНЕЦОВ', program: 'УЧАСТНИК ПРОГРАММЫ «ВИКИНГ ПУЛЬС»', quote: 'Сложнее всего было<br>решиться и прийти.<br>Теперь это любимый час.', description: 'Андрей сменил редкие тренировки на регулярный ритм. С поддержкой тренера и команды он нашёл больше энергии и желание возвращаться в зал.', stats: [['16', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['2×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/photos/photo-1636581563867-1ecab574858f.webp', alt: 'Атлет укрепляет уверенность на тренировке с элементами бокса' },
  { name: 'ИВАН ЛЕБЕДЕВ', program: 'УЧАСТНИК ПРОГРАММЫ «ВИКИНГ ОПОРА»', quote: 'Перестал сравнивать.<br>Начал приходить.<br>И всё изменилось.', description: 'Начав с основ, Иван нашёл опору для роста. Свобода движения, постепенное развитие силы и поддержка тренера превратили занятия в любимую привычку.', stats: [['10', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['3×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/photos/photo-1604233098531-90b71b1b17a6.webp', alt: 'Участник тренируется со штангой в силовой раме' },
  { name: 'СЕРГЕЙ ПАВЛОВ', program: 'УЧАСТНИК ПРОГРАММЫ «ВИКИНГ СИЛА»', quote: 'Теперь я понимаю,<br>зачем делаю<br>каждый подход.', description: 'Сергей пришёл без чёткого плана и начал с техники базовых движений. Понятная программа и обратная связь тренера помогли ему выстроить регулярный ритм занятий.', stats: [['14', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['3×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/members/sergey.webp', alt: 'Иллюстрация истории участника: мужчина после силовой тренировки' },
  { name: 'МАРИЯ БЕЛОВА', program: 'УЧАСТНИЦА ПРОГРАММЫ «ВИКИНГ ОПОРА»', quote: 'Пришла после перерыва.<br>Нашла свой темп.<br>И свою команду.', description: 'Мария возвращалась к тренировкам постепенно. Упражнения под её уровень и спокойная поддержка команды помогли снова почувствовать уверенность в движении.', stats: [['8', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['2×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/members/maria.webp', alt: 'Иллюстрация истории участницы: девушка в зоне функциональных тренировок' },
  { name: 'АЛЕКСЕЙ ВОРОНОВ', program: 'УЧАСТНИК ПРОГРАММЫ «ВИКИНГ СИЛА»', quote: 'Не жду понедельника.<br>Просто прихожу<br>и работаю над собой.', description: 'Алексей выбрал два занятия в неделю, которые вписались в рабочий график. Без гонки за чужими результатами — с вниманием к технике и собственному прогрессу.', stats: [['20', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['2×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/members/alexey.webp', alt: 'Иллюстрация истории участника: мужчина рядом со стойкой гантелей' },
  { name: 'ЕКАТЕРИНА ФЁДОРОВА', program: 'УЧАСТНИЦА ПРОГРАММЫ «ВИКИНГ ПУЛЬС»', quote: 'Здесь можно выдохнуть.<br>Собраться.<br>И сделать ещё один круг.', description: 'Екатерина нашла в интервальных занятиях любимый способ переключиться после рабочего дня. Динамичный формат и общая энергия группы помогают сохранять регулярность.', stats: [['10', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['3×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/members/ekaterina.webp', alt: 'Иллюстрация истории участницы: женщина после интервальной тренировки' },
  { name: 'ОЛЬГА ТИХОНОВА', program: 'УЧАСТНИЦА ПРОГРАММЫ «ВИКИНГ ОПОРА»', quote: 'Думала, будет сложно.<br>Оказалось —<br>начинать можно спокойно.', description: 'Ольга начала с простых движений и посильной нагрузки. Внимание тренера и доброжелательная атмосфера помогли ей сделать занятия устойчивой привычкой.', stats: [['16', 'НЕДЕЛЬ РЕГУЛЯРНЫХ ЗАНЯТИЙ'], ['2×', 'ТРЕНИРОВКИ В НЕДЕЛЮ']], image: 'assets/members/olga.webp', alt: 'Иллюстрация истории участницы: женщина в зоне функциональной подготовки' }
];

const menuButton = $('.menu-toggle');
function closeMenu() { $('#mobile-nav').hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; $('#mobile-nav').hidden = open; menuButton.setAttribute('aria-expanded', String(!open)); menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню'); });
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
$$('.filter').forEach(button => button.addEventListener('click', () => { const goal = button.dataset.filter; $$('.filter').forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); }); $$('.program-card').forEach(card => { card.hidden = goal !== 'all' && card.dataset.goal !== goal; if (!card.hidden) { card.classList.remove('reveal'); void card.offsetWidth; card.classList.add('reveal'); } }); }));

const booking = $('#booking-dialog');
const detail = $('#detail-dialog');
let currentPlan = null;
const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
$('#trial-date').min = localDate(tomorrow);
$('#trial-date').value = localDate(tomorrow);
const maxDate = new Date(tomorrow); maxDate.setDate(maxDate.getDate() + 60);
$('#trial-date').max = localDate(maxDate);
function refreshTrial() { const program = programs[$('#trial-program').value]; $('#trial-summary-text').textContent = `${program.duration} минут с тренером · Приходи за 15 минут до начала`; const selectedDate = new Date(`${$('#trial-date').value}T12:00:00`); const weekend = [0, 6].includes(selectedDate.getDay()); const time = $('#trial-time'); const previous = time.value; const slots = weekend ? [['09:00', '09:00 — Утренняя команда'], ['12:00', '12:00 — Дневная перезагрузка'], ['16:00', '16:00 — Дневная команда']] : [['07:00', '07:00 — Ранний старт'], ['12:00', '12:00 — Дневная перезагрузка'], ['18:30', '18:30 — После работы']]; time.replaceChildren(...slots.map(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; return option; })); if (slots.some(([value]) => value === previous)) time.value = previous; }
function openBooking(program) { if (program && programs[program]) $('#trial-program').value = program; $('#booking-main').hidden = false; $('#booking-result').hidden = true; refreshTrial(); resetBookingConsent(); closeMenu(); if (detail.open) detail.close(); if (!booking.open) { booking.showModal(); reportAction('trial_form_open', { program: $('#trial-program').value }); } }
$$('.book-trigger').forEach(button => button.addEventListener('click', () => openBooking()));
$('#trial-program').addEventListener('change', refreshTrial);
$('#trial-date').addEventListener('change', refreshTrial);
$$('dialog .dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { const bounds = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close(); }));

$('#trial-form').addEventListener('submit', event => {
  event.preventDefault();
  const phone = $('#trial-phone');
  phone.setCustomValidity(isValidPhone(phone.value) ? '' : 'Укажи российский номер: +7 или 8 и ещё 10 цифр.');
  if (!event.currentTarget.reportValidity()) return;
  if (!$('#personal-consent').checked) return;
  const program = programs[$('#trial-program').value];
  const planned = { program: $('#trial-program').value, date: $('#trial-date').value, time: $('#trial-time').value };
  const date = new Date(planned.date + 'T' + planned.time + ':00');
  if (Number.isNaN(date.getTime()) || date <= new Date()) {
    $('#trial-date').setCustomValidity('Выбери дату в будущем.');
    $('#trial-date').reportValidity();
    return;
  }
  $('#trial-date').setCustomValidity('');
  // Demo only: no fetch, request, contact storage, or consent record is created.
  currentPlan = planned;
  $('#result-description').textContent = program.name + ' · ' + date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }) + ' в ' + currentPlan.time + '. ' + program.duration + ' минут. Тренер: ' + program.coach + '.';
  resetBookingConsent();
  $('#booking-main').hidden = true;
  $('#booking-result').hidden = false;
  $('#booking-success-title').focus();
  reportAction('trial_form_preview_completed', { program: planned.program, delivery: 'frontend-stub' });
});
$('#trial-date').addEventListener('input', () => $('#trial-date').setCustomValidity(''));
$('#edit-plan').addEventListener('click', () => { $('#booking-result').hidden = true; $('#booking-main').hidden = false; resetBookingConsent(); $('#trial-program').focus(); });
function icalDate(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
$('#calendar-download').addEventListener('click', () => {
  if (!currentPlan) return;
  const program = programs[currentPlan.program];
  const start = new Date(`${currentPlan.date}T${currentPlan.time}:00`);
  const end = new Date(start.getTime() + program.duration * 60000);
  const uid = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `viking-${Date.now()}`;
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VIKING//Trial Planner//RU', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${uid}@viking-trial`, `DTSTAMP:${icalDate(new Date())}`, `DTSTART:${icalDate(start)}`, `DTEND:${icalDate(end)}`, `SUMMARY:Пробное занятие — ${program.name}`, 'DESCRIPTION:Тренировка в клубе «ВИКИНГ». Администратор свяжется с вами для подтверждения времени.', 'STATUS:TENTATIVE', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'viking-probnoe-zanyatie.ics'; document.body.append(link); link.click(); link.remove(); reportAction('trial_calendar_download', { program: currentPlan.program }); setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function showDetail(html, trialProgram, source = 'studio') { $('#detail-content').dataset.source = source; $('#detail-content').dataset.program = trialProgram; $('#detail-content').innerHTML = html; if (trialProgram) { const button = $('#detail-content .button'); button.dataset.marketing = 'trial-cta'; button.addEventListener('click', () => openBooking(trialProgram)); } detail.showModal(); }
$$('.coach-more').forEach(button => button.addEventListener('click', () => { const c = coaches[button.dataset.coach]; showDetail(`<div class="eyebrow">${c.role}</div><h2 id="detail-title">${c.name}</h2><p>${c.intro}</p><h3>ОБРАЗОВАНИЕ И ОПЫТ</h3><p>${c.education}</p><div class="credentials">${c.certs.map(cert => `<span>${cert}</span>`).join('')}</div><h3>ТРЕНЕРСКАЯ ФИЛОСОФИЯ</h3><p>${c.philosophy}</p><button class="button">ЗАБРОНИРОВАТЬ ТРЕНИРОВКУ</button>`, c.program, 'coach'); }));
$('#open-film').addEventListener('click', () => { showDetail('<div class="eyebrow">ДОБРО ПОЖАЛОВАТЬ НА ТВОЮ ТЕРРИТОРИЮ СИЛЫ</div><h2 id="detail-title">ЭТО «ВИКИНГ».</h2><img class="film-image" src="assets/photos/photo-1590487988256-9ed24133863e.webp" alt="Внутренний вид силовой студии в индустриальном стиле"><h3>ПРИХОДИ СОБОЙ. УХОДИ СИЛЬНЕЕ.</h3><p>Знакомься с залом, тренером и своей командой. Тренировки в малых группах дарят энергию общих усилий и внимание, которого ты заслуживаешь.</p><ul><li>Продуманные зоны силы и выносливости</li><li>Тренер рядом от разминки до последнего повтора</li><li>Дружелюбная атмосфера для любого уровня подготовки</li></ul><button class="button">ЗАБРОНИРОВАТЬ ТРЕНИРОВКУ</button>', 'fitness'); });
let storyIndex = 0;
let storyLoading = false;
function renderStory(index) {
  const story = stories[index];
  $('#story-image').src = story.image;
  $('#story-image').alt = story.alt;
  $('#story-quote').innerHTML = story.quote.replaceAll('<br>', ' <br>');
  $('#story-description').textContent = story.description;
  $('#story-name').textContent = story.name;
  $('#story-program').textContent = story.program;
  $('#story-results').innerHTML = story.stats.map(([value, caption]) => `<div><strong>${value}</strong><span>${caption}</span></div>`).join('');
  $('#story-index').textContent = `${String(index + 1).padStart(2, '0')} / ${String(stories.length).padStart(2, '0')}`;
}
async function changeStory(direction) {
  if (storyLoading) return;
  const nextIndex = (storyIndex + direction + stories.length) % stories.length;
  storyLoading = true;
  $('.story-layout').setAttribute('aria-busy', 'true');
  $('#story-prev').disabled = $('#story-next').disabled = true;
  $('#story-status').hidden = true;
  try {
    // Keep the current photograph and text paired until the next image is ready.
    const photograph = new Image();
    photograph.src = stories[nextIndex].image;
    await photograph.decode();
    storyIndex = nextIndex;
    renderStory(storyIndex);
    reportAction('member_story_view', { story: storyIndex + 1, direction: direction > 0 ? 'next' : 'previous' });
  } catch {
    $('#story-status').textContent = 'Не удалось загрузить фотографию. Попробуй ещё раз.';
    $('#story-status').hidden = false;
  } finally {
    storyLoading = false;
    $('.story-layout').setAttribute('aria-busy', 'false');
    $('#story-prev').disabled = $('#story-next').disabled = false;
  }
}
$('#story-prev').addEventListener('click', () => changeStory(-1));
$('#story-next').addEventListener('click', () => changeStory(1));
renderStory(0);
$('#year').textContent = new Date().getFullYear();
refreshTrial();

if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'start_forge_trial_plan', title: 'Открыть форму бронирования в ВИКИНГ',
      description: 'Открыть форму заявки на тренировку и выбрать программу. Дальнейшее заполнение и отправка выполняются посетителем.',
      inputSchema: { type: 'object', properties: { program: { type: 'string', enum: ['strength', 'conditioning', 'fitness'] } }, required: ['program'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) { if (!input || typeof input !== 'object' || !Object.hasOwn(programs, input.program) || Object.keys(input).some(key => key !== 'program')) throw new Error('Выбери программу: сила (strength), пульс (conditioning) или опора (fitness).'); openBooking(input.program); return { plannerOpened: booking.open, selectedProgram: $('#trial-program').value, reservationCreated: false }; }
    }, { signal: lifecycle.signal })).catch(() => {});
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  } catch { /* The interface remains available when browser tools are unsupported. */ }
}

// Booking contact validation stays in memory and is cleared after submission/closing.
function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return /^[78]\d{10}$/.test(digits) && /^[+\d\s()\-]+$/.test(value);
}
function resetBookingConsent() {
  $('#trial-phone').value = '';
  $('#trial-phone').setCustomValidity('');
  $('#phone-error').textContent = '';
  $('#personal-consent').checked = false;
  $('#booking-submit').disabled = true;
}
$('#trial-phone').addEventListener('input', () => {
  $('#trial-phone').setCustomValidity('');
  $('#phone-error').textContent = '';
});
$('#trial-phone').addEventListener('blur', () => {
  const phone = $('#trial-phone');
  if (!phone.value) return;
  if (!isValidPhone(phone.value)) {
    $('#phone-error').textContent = 'Нужно 11 цифр. Начни номер с +7 или 8.';
    return;
  }
  const digits = phone.value.replace(/\D/g, '');
  phone.value = '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
  $('#phone-error').textContent = '';
});
$('#personal-consent').addEventListener('change', () => {
  $('#booking-submit').disabled = !$('#personal-consent').checked;
});
booking.addEventListener('close', resetBookingConsent);
resetBookingConsent();


// Program landing pages link to the same booking form with a selected goal.
const requestedProgram = new URLSearchParams(location.search).get('program');
if (requestedProgram && Object.hasOwn(programs, requestedProgram)) {
  document.addEventListener('DOMContentLoaded', () => openBooking(requestedProgram), { once: true });
}
