/*
  ============================================================
  HEXAGON EXCHANGE — EASY CONFIGURATION
  Change your business details HERE.
  ============================================================
*/
 
const CONFIG = {
  businessName: "HEXAGON Exchange",
  whatsappNumber: "2348134600671",
  email: "osamudiamen025@gmail.com",
  tagline: "Secure. Sweet. Synaptic."
};
 
 
/* ---------------- DO NOT EDIT BELOW UNLESS NEEDED ---------------- */
 
document.title = `${CONFIG.businessName} | ${CONFIG.tagline}`;
 
document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = `https://wa.me/${CONFIG.whatsappNumber}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
 
document.querySelectorAll("[data-email]").forEach(link => {
  link.href = `mailto:${CONFIG.email}`;
});
 
document.querySelectorAll("[data-whatsapp-display]").forEach(el => {
  el.textContent = "+234 813-460-0671";
});
 
document.querySelectorAll("[data-email-display]").forEach(el => {
  el.textContent = CONFIG.email;
});
 
document.getElementById("year").textContent = new Date().getFullYear();

/*
  ============================================================
  HEADER HEIGHT SYNC
  ============================================================
*/
function setHeaderHeightVar() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}
setHeaderHeightVar();
window.addEventListener("resize", setHeaderHeightVar);
window.addEventListener("load", setHeaderHeightVar);

const headerEl = document.querySelector(".site-header");
if (headerEl && "ResizeObserver" in window) {
  new ResizeObserver(setHeaderHeightVar).observe(headerEl);
}

/*
  ============================================================
  THEME TOGGLE
  ============================================================
*/
const THEME_KEY = "hexagon-theme";
const themeToggle = document.querySelector(".theme-toggle");
const systemLight = window.matchMedia("(prefers-color-scheme: light)");

function currentTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return systemLight.matches ? "light" : "dark";
}

function syncThemeUI() {
  if (!themeToggle) return;
  const theme = currentTheme();
  const next = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.setAttribute("content", theme === "dark" ? "#0B0B0C" : "#FAF9F6");
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncThemeUI();
  });
  systemLight.addEventListener("change", syncThemeUI);
  syncThemeUI();
}

/*
  ============================================================
  MOBILE MENU
  ============================================================
*/
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
 
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
 
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  const isOpen = navLinks.classList.contains("open");
  if (!isOpen) return;

  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggleButton = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggleButton) {
    closeMenu();
  }
});
 
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
 
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

/*
  ============================================================
  SCROLL-SPY
  ============================================================
*/
const navSectionLinks = new Map();
document.querySelectorAll(".nav-links a[href^='#']").forEach(link => {
  const targetId = link.getAttribute("href").slice(1);
  navSectionLinks.set(targetId, link);
});

const spySections = document.querySelectorAll("main section[id]");

const scrollSpyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = navSectionLinks.get(entry.target.id);
    if (!link) return;

    if (entry.isIntersecting) {
      navSectionLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

spySections.forEach(section => scrollSpyObserver.observe(section));
 
 
/*
  ============================================================
  RATE WIDGET
  ============================================================
*/
 
(function() {
  const REFRESH_INTERVAL = 60;
  const HISTORY_LENGTH = 3;
 
  const BUY_ADJUSTMENT = 13;
  const SELL_ADJUSTMENT = 23;
  const NIGERIA_PREMIUM_OFFSET = 37;
 
  const BTC_SPREAD_EXTRA = 2;
  const BTC_BUY_ADJUSTMENT = BUY_ADJUSTMENT + BTC_SPREAD_EXTRA;
  const BTC_SELL_ADJUSTMENT = SELL_ADJUSTMENT + BTC_SPREAD_EXTRA;
 
  const MONIERATE_API_KEY = "ac67fa0699395abbfa8739ed009c6f6510ae120735ec64bb81f38ce56495f98b";
  const MONIERATE_PROVIDER = "busha";
  const MONIERATE_URL = `https://api.monierate.com/core/providers/${MONIERATE_PROVIDER}`;

  // Live Vercel proxy — verified working
  const RATE_PROXY_URL = "https://hexagon-rate-proxy.vercel.app/api/coingecko";
 
  const buyRateEl = document.getElementById('buyRate');
  const sellRateEl = document.getElementById('sellRate');
  const usdtBuyValueEl = document.getElementById('usdt-buy-value');
  const usdtSellValueEl = document.getElementById('usdt-sell-value');
  const sparklineUsdtEl = document.getElementById('sparkline-usdt');
 
  const btcBuyRateEl = document.getElementById('btcBuyRate');
  const btcSellRateEl = document.getElementById('btcSellRate');
  const btcBuyValueEl = document.getElementById('btc-buy-value');
  const btcSellValueEl = document.getElementById('btc-sell-value');
  const sparklineBtcEl = document.getElementById('sparkline-btc');
 
  const rateBarEl = document.getElementById('rate-bar');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const countdownEl = document.getElementById('countdown');
 
  let countdownInterval = null;
  let secondsLeft = REFRESH_INTERVAL;
 
  const usdtHistory = [];
 
  function formatNaira(amount) {
    return Number(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
 
  function flashRate(el) {
    if (el) {
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    }
  }
 
  function pushHistory(history, value) {
    history.push(value);
    if (history.length > HISTORY_LENGTH) {
      history.shift();
    }
  }
 
  function getTrend(history) {
    if (history.length < 2) return 'flat';
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'flat';
  }
 
  function applyTrendClass(elements, trend) {
    elements.forEach((el) => {
      if (!el) return;
      el.classList.remove('trend-up', 'trend-down');
      if (trend === 'up') el.classList.add('trend-up');
      if (trend === 'down') el.classList.add('trend-down');
    });
  }
 
  function drawSparkline(svgEl, history, trend) {
    if (!svgEl) return;
 
    svgEl.classList.remove('trend-up', 'trend-down', 'trend-flat');
    svgEl.classList.add(`trend-${trend}`);
 
    if (history.length < 2) {
      svgEl.innerHTML = '';
      return;
    }
 
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
 
    const points = history.map((value, index) => {
      const x = (index / (history.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 18 - 1;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
 
    svgEl.innerHTML = `<path d="M${points.join(' L')}" />`;
  }
 
  function updateRates(usdtMid) {
    pushHistory(usdtHistory, usdtMid);
    const trend = getTrend(usdtHistory);
 
    const ourUsdtBuyPrice = usdtMid - BUY_ADJUSTMENT;
    const ourUsdtSellPrice = usdtMid + SELL_ADJUSTMENT;
 
    buyRateEl.textContent = formatNaira(ourUsdtSellPrice);
    sellRateEl.textContent = formatNaira(ourUsdtBuyPrice);
    applyTrendClass([usdtBuyValueEl, usdtSellValueEl], trend);
    drawSparkline(sparklineUsdtEl, usdtHistory, trend);
    flashRate(buyRateEl);
    flashRate(sellRateEl);
 
    const ourBtcBuyPrice = usdtMid - BTC_BUY_ADJUSTMENT;
    const ourBtcSellPrice = usdtMid + BTC_SELL_ADJUSTMENT;
 
    btcBuyRateEl.textContent = formatNaira(ourBtcSellPrice);
    btcSellRateEl.textContent = formatNaira(ourBtcBuyPrice);
    applyTrendClass([btcBuyValueEl, btcSellValueEl], trend);
    drawSparkline(sparklineBtcEl, usdtHistory, trend);
    flashRate(btcBuyRateEl);
    flashRate(btcSellRateEl);
 
    rateBarEl.classList.remove('is-error');
    lastUpdatedEl.textContent =
      `Last updated: ${new Date().toLocaleTimeString('en-NG')}`;
  }
 
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
 
    secondsLeft = REFRESH_INTERVAL;
    countdownEl.textContent = `Next update in ${secondsLeft}s`;
 
    countdownInterval = setInterval(() => {
      secondsLeft--;
      countdownEl.textContent = `Next update in ${secondsLeft}s`;
 
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        fetchRate();
      }
    }, 1000);
  }
 
  async function fetchCoinGeckoRate() {
    const response = await fetch(RATE_PROXY_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });
 
    if (!response.ok) {
      throw new Error(`Rate proxy HTTP ${response.status}`);
    }
 
    const data = await response.json();
    const usdtMid = data.tether ? parseFloat(data.tether.ngn) : NaN;
 
    if (!Number.isFinite(usdtMid)) {
      throw new Error('Invalid rate from proxy');
    }
 
    return usdtMid;
  }
 
  async function fetchMonierateRate() {
    const response = await fetch(MONIERATE_URL, {
      headers: { api_key: MONIERATE_API_KEY }
    });
 
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Monierate error body:", errorText);
      throw new Error(`Rate API HTTP ${response.status}`);
    }
 
    const data = await response.json();
    const rates = (data.data && data.data.latest_rates) || [];
    const usdtNgn = rates.find((entry) => entry.pair === "usdtngn");
    const usdtMid = usdtNgn ? parseFloat(usdtNgn.rate_mid) : NaN;
 
    if (!Number.isFinite(usdtMid)) {
      throw new Error('Invalid rate from Monierate');
    }
 
    return usdtMid;
  }
 
  async function fetchRate() {
    try {
      const rawRate = await fetchCoinGeckoRate();
      const usdtMid = rawRate + NIGERIA_PREMIUM_OFFSET;
 
      updateRates(usdtMid);
      startCountdown();
 
    } catch (error) {
      console.error('Rate fetch failed:', error);
 
      rateBarEl.classList.add('is-error');
      countdownEl.textContent = 'Rate unavailable — retrying...';
 
      setTimeout(fetchRate, 10000);
    }
  }
 
  fetchRate();
})();
