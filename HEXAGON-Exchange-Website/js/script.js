/*
  ============================================================
  HEXAGON EXCHANGE — EASY CONFIGURATION
  Change your business details HERE.
  ============================================================
*/
 
const CONFIG = {
  businessName: "HEXAGON Exchange",
 
  // Enter WhatsApp in international format WITHOUT + or spaces.
  // Example: "2348012345678"
  whatsappNumber: "2348134600671",
 
  // Change this to your real business email.
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
  // Always show nicely formatted number on the page
  el.textContent = "+234 813-460-0671";
});
 
document.querySelectorAll("[data-email-display]").forEach(el => {
  el.textContent = CONFIG.email;
});
 
document.getElementById("year").textContent = new Date().getFullYear();
 
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
 
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
 
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
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
  SCROLL-SPY — highlights whichever nav link matches the
  section currently in view. The glow/highlight styling itself
  already exists in your CSS as .nav-links a.active — this just
  adds/removes that class as you scroll.
  ============================================================
*/

// Map each section id (e.g. "about") to its matching nav link
const navSectionLinks = new Map();
document.querySelectorAll(".nav-links a[href^='#']").forEach(link => {
  const targetId = link.getAttribute("href").slice(1);
  navSectionLinks.set(targetId, link);
});

const spySections = document.querySelectorAll("main section[id]");

const scrollSpyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = navSectionLinks.get(entry.target.id);
    if (!link) return; // section has no matching nav link (e.g. "swift")

    if (entry.isIntersecting) {
      // Only one link should glow at a time
      navSectionLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, {
  // A section counts as "current" once it crosses roughly the
  // upper third of the screen, and stays current until the next
  // section crosses that same line — this avoids the highlight
  // flickering between sections while scrolling past boundaries.
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

spySections.forEach(section => scrollSpyObserver.observe(section));
 
 
/*
  ============================================================
  RATE WIDGET — MONIERATE (Busha provider)
  Shows USDT/NGN and BTC/USDT. BTC/USDT is NOT a real BTC price —
  it's the same USDT/NGN mid-market rate with a wider spread on
  top, as requested. Both rows share one trend/sparkline since
  they move together (BTC/USDT is just USDT/NGN shifted by a
  fixed margin).
  ============================================================
*/
 
(function() {
  const REFRESH_INTERVAL = 60;   // seconds
  const HISTORY_LENGTH = 10;     // how many past rates to keep for the sparkline
 
  // Your current pricing adjustments (USDT/NGN)
  const BUY_ADJUSTMENT = 30;     // ₦30 profit on buy
  const SELL_ADJUSTMENT = 40;    // ₦40 buffer on sell
 
  // CoinGecko gives the GLOBAL market-average USDT price, not
  // Nigeria's real P2P/street rate — this typically runs a bit
  // higher. This is your manual correction for that gap.
  //
  // HOW TO KEEP THIS ACCURATE: every so often (weekly is plenty),
  // check Busha or Binance P2P's USDT/NGN rate and compare it to
  // what CoinGecko is showing. Update this number to close the
  // gap. Example: if CoinGecko shows ₦1,377 but the real street
  // rate is ₦1,365, set this to -12. If the street rate is HIGHER
  // than CoinGecko, use a positive number instead.
  const NIGERIA_PREMIUM_OFFSET = 45; // naira, can be negative
 
  // BTC/USDT row uses the SAME underlying USDT/NGN rate, just with
  // this extra spread added on top of your usual margin.
  const BTC_SPREAD_EXTRA = 2;    // ₦2 extra spread — change to 3 if you prefer
  const BTC_BUY_ADJUSTMENT = BUY_ADJUSTMENT + BTC_SPREAD_EXTRA;
  const BTC_SELL_ADJUSTMENT = SELL_ADJUSTMENT + BTC_SPREAD_EXTRA;
 
  // ---------- Monierate API config ----------
  // Real provider-specific endpoint (parallel/P2P market rate):
  //   curl "https://api.monierate.com/core/providers/busha"
  //     -H "api_key: YOUR_API_KEY"
  const MONIERATE_API_KEY = "ac67fa0699395abbfa8739ed009c6f6510ae120735ec64bb81f38ce56495f98b";
  const MONIERATE_PROVIDER = "busha";
  const MONIERATE_URL = `https://api.monierate.com/core/providers/${MONIERATE_PROVIDER}`;
 
  // DOM elements — USDT row
  const buyRateEl = document.getElementById('buyRate');
  const sellRateEl = document.getElementById('sellRate');
  const usdtBuyValueEl = document.getElementById('usdt-buy-value');
  const usdtSellValueEl = document.getElementById('usdt-sell-value');
  const sparklineUsdtEl = document.getElementById('sparkline-usdt');
 
  // DOM elements — BTC/USDT row
  const btcBuyRateEl = document.getElementById('btcBuyRate');
  const btcSellRateEl = document.getElementById('btcSellRate');
  const btcBuyValueEl = document.getElementById('btc-buy-value');
  const btcSellValueEl = document.getElementById('btc-sell-value');
  const sparklineBtcEl = document.getElementById('sparkline-btc');
 
  // Shared elements
  const rateBarEl = document.getElementById('rate-bar');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const countdownEl = document.getElementById('countdown');
 
  let countdownInterval = null;
  let secondsLeft = REFRESH_INTERVAL;
 
  // Keeps the last N mid-market USDT/NGN rates, used to draw both
  // sparklines and decide the up/down trend color for both rows
  // (they move together since BTC/USDT is derived from this).
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
      void el.offsetWidth; // trigger reflow
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
    const range = max - min || 1; // avoid divide-by-zero if flat
 
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
 
    // ---------- USDT/NGN ----------
    const ourUsdtBuyPrice = usdtMid - BUY_ADJUSTMENT;   // what we pay buying from a customer
    const ourUsdtSellPrice = usdtMid + SELL_ADJUSTMENT; // what we charge selling to a customer
 
    // "Buy" on the site = price the CUSTOMER pays to buy from us = our sell price
    // "Sell" on the site = price the CUSTOMER gets selling to us = our buy price
    buyRateEl.textContent = formatNaira(ourUsdtSellPrice);
    sellRateEl.textContent = formatNaira(ourUsdtBuyPrice);
    applyTrendClass([usdtBuyValueEl, usdtSellValueEl], trend);
    drawSparkline(sparklineUsdtEl, usdtHistory, trend);
    flashRate(buyRateEl);
    flashRate(sellRateEl);
 
    // ---------- BTC/USDT (same base rate, wider spread) ----------
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
 
  /**
   * TEMPORARY STOPGAP: Monierate is returning 402 (Payment Required)
   * on the account, so we're pulling from CoinGecko instead for now
   * — free, no API key, and not blocked by Nigerian ISPs (unlike
   * Binance P2P, which IS blocked at the network level in Nigeria
   * and can't be used as a live data source for this reason).
   *
   * IMPORTANT CAVEAT: this is CoinGecko's global market-average
   * USDT/NGN price, NOT the Nigerian P2P/parallel-market premium
   * rate Monierate/Busha gave you. It can drift from the real
   * street rate by a noticeable amount at times. Switch this back
   * to fetchMonierateRate() (still below, untouched) once your
   * Monierate billing/account issue is resolved.
   */
  async function fetchCoinGeckoRate() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn"
    );
 
    if (!response.ok) {
      throw new Error(`CoinGecko HTTP ${response.status}`);
    }
 
    const data = await response.json();
    const usdtMid = data.tether ? parseFloat(data.tether.ngn) : NaN;
 
    if (!Number.isFinite(usdtMid)) {
      throw new Error('Invalid rate from CoinGecko');
    }
 
    return usdtMid;
  }
 
  /**
   * Fetch the current parallel-market USDT/NGN rate from Busha.
   * We only need the usdtngn pair now — BTC/USDT is derived
   * from this same number, not fetched separately.
   *
   * NOT CURRENTLY USED — see fetchCoinGeckoRate() above and the
   * comment in fetchRate() below for why.
   */
  async function fetchMonierateRate() {
    const response = await fetch(MONIERATE_URL, {
      headers: {
        api_key: MONIERATE_API_KEY
      }
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
      // Swap this back to fetchMonierateRate() once your Monierate
      // account/billing issue (402 error) is fixed.
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
 
  // Start the first fetch
  fetchRate();
})();
