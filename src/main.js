/* -------------------------------------------------------------------------
   Language (EN / AR)
   Each translatable node carries data-en / data-ar (and data-en-ph /
   data-ar-ph for placeholders). Switching sets <html lang/dir> and swaps
   text in place. Choice is remembered in localStorage.
   ------------------------------------------------------------------------- */
const STORAGE_KEY = 'ama-lang-v2'
const root = document.documentElement

function applyLang(lang) {
  const isAr = lang === 'ar'
  root.lang = lang
  root.dir = isAr ? 'rtl' : 'ltr'

  for (const el of document.querySelectorAll('[data-en]')) {
    const next = el.dataset[isAr ? 'ar' : 'en']
    if (next != null) el.textContent = next
  }
  for (const el of document.querySelectorAll('[data-en-ph]')) {
    const next = isAr ? el.dataset.arPh : el.dataset.enPh
    if (next != null) el.setAttribute('placeholder', next)
  }

  const label = document.querySelector('.lang-toggle .lang-label')
  if (label) label.textContent = isAr ? 'EN' : 'عربي'

  document.title = isAr
    ? 'شركة المبدع الماسي - استيراد المعدات الصناعية والبحرية'
    : 'Al-Moobda Al-Masi - Industrial & Marine Equipment Importer'

  try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* storage blocked */ }
}

function initLang() {
  let saved = null
  try { saved = localStorage.getItem(STORAGE_KEY) } catch { /* storage blocked */ }
  const fromUrl = new URLSearchParams(location.search).get('lang')
  const chosen = fromUrl === 'ar' || fromUrl === 'en' ? fromUrl : saved
  applyLang(chosen === 'en' ? 'en' : 'ar')

  const toggle = document.querySelector('.lang-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      applyLang(root.lang === 'ar' ? 'en' : 'ar')
    })
  }
}

/* -------------------------------------------------------------------------
   Scroll reveal (IntersectionObserver, not a scroll listener)
   ------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal')
  if (!items.length) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    for (const el of items) el.classList.add('in')
    return
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })

  for (const el of items) io.observe(el)
}

/* -------------------------------------------------------------------------
   Header elevation on scroll (sentinel + IntersectionObserver)
   ------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header')
  const sentinel = document.querySelector('.scroll-sentinel')
  if (!header || !sentinel || !('IntersectionObserver' in window)) return

  const io = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting)
  }, { threshold: 0 })
  io.observe(sentinel)
}

/* -------------------------------------------------------------------------
   Stat count-up (runs once when the strip enters the viewport)
   ------------------------------------------------------------------------- */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]')
  if (!nums.length) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const render = (el, value) => {
    if (el.firstChild) el.firstChild.textContent = String(value)
  }

  if (reduce || !('IntersectionObserver' in window)) {
    for (const el of nums) render(el, Number(el.dataset.count))
    return
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target
      io.unobserve(el)
      const target = Number(el.dataset.count)
      const duration = 1100
      const start = performance.now()
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        render(el, Math.round(target * eased))
        if (t < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  }, { threshold: 0.5 })

  for (const el of nums) io.observe(el)
}

/* -------------------------------------------------------------------------
   Mobile navigation
   ------------------------------------------------------------------------- */
function initMobileNav() {
  const btn = document.querySelector('.menu-btn')
  const nav = document.querySelector('.mobile-nav')
  if (!btn || !nav) return

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open')
    btn.setAttribute('aria-expanded', String(open))
  })
  for (const link of nav.querySelectorAll('a')) {
    link.addEventListener('click', () => {
      nav.classList.remove('open')
      btn.setAttribute('aria-expanded', 'false')
    })
  }
}

/* -------------------------------------------------------------------------
   Contact form (mockup: inline confirmation, no backend)
   ------------------------------------------------------------------------- */
function initActiveNav() {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')]
  if (!links.length || !('IntersectionObserver' in window)) return
  const map = new Map()
  for (const link of links) {
    const id = link.getAttribute('href').slice(1)
    const section = document.getElementById(id)
    if (section) map.set(section, link)
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const link = map.get(entry.target)
      if (!link) continue
      if (entry.isIntersecting) {
        for (const item of links) item.removeAttribute('aria-current')
        link.setAttribute('aria-current', 'true')
      }
    }
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 })
  for (const section of map.keys()) io.observe(section)
}

function initForm() {
  const form = document.querySelector('.contact-form')
  const status = document.querySelector('.form-status')
  if (!form || !status) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const isAr = root.lang === 'ar'
    status.textContent = isAr
      ? 'شكرًا لك. هذا نموذج تجريبي، لذا لم يتم إرسال الرسالة بعد.'
      : 'Thanks. This is a mockup form, so no message was sent yet.'
    status.style.color = 'var(--p-600)'
    form.reset()
  })
}

/* ------------------------------------------------------------------------- */
function boot() {
  initLang()
  initHeader()
  initReveal()
  initCounters()
  initMobileNav()
  initActiveNav()
  initForm()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
