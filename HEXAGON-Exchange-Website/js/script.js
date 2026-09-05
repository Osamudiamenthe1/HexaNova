const CONFIG = {
    businessName: "HEXAGON Exchange",
    whatsappNumber: "2348134600671",
    email: "osamudiamen025@gmail.com",
    tagline: "Secure. Sweet. Synaptic."
};

// Keep header height in sync so fixed header never chops scrolled-to sections
function setHeaderHeightVar() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}
setHeaderHeightVar();
window.addEventListener("resize", setHeaderHeightVar);
window.addEventListener("load", setHeaderHeightVar);

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

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
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

document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav") && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
    }
});

// Scroll reveal animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

// Rate widget
(function() {
    const REFRESH_INTERVAL = 60;
    const HISTORY_LENGTH = 20;
    const BUY_ADJUSTMENT = 37;
    const SELL_ADJUSTMENT = 47;
    const BTC_SPREAD_EXTRA = 3; // ₦3 extra spread for BTC/USDT row

    const MONIERATE_API_KEY = "ac67fa0699395abbfa8739ed009c6f6510ae120735ec64bb81f38ce56495f98b";
    const MONIERATE_PROVIDER = "busha";
    const MONIERATE_URL = `https://api.monierate.com/core/providers/${MONIERATE_PROVIDER}`;

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
    const btcHistory = [];

    function formatNaira(amount) {
        return Number(amount).toLocaleString('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function pushHistory(history, value) {
        history.push(value);
        if (history.length > HISTORY_LENGTH) history.shift();
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
        elements.forEach(el => {
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
        // Centered: y from 3 to 17 (14px span)
        const topY = 3, bottomY = 17, span = bottomY - topY;
        const points = history.map((value, index) => {
            const x = (index / (history.length - 1)) * 60;
            const normalized = (value - min) / range;
            const y = bottomY - normalized * span;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        });
        svgEl.innerHTML = `<path d="M${points.join(' L')}" />`;
    }

    function updateRates(usdtMid) {
        // USDT/NGN
        pushHistory(usdtHistory, usdtMid);
        const usdtTrend = getTrend(usdtHistory);
        const usdtBuyPrice = usdtMid + SELL_ADJUSTMENT;
        const usdtSellPrice = usdtMid - BUY_ADJUSTMENT;
        buyRateEl.textContent = formatNaira(usdtBuyPrice);
        sellRateEl.textContent = formatNaira(usdtSellPrice);
        applyTrendClass([usdtBuyValueEl, usdtSellValueEl], usdtTrend);
        drawSparkline(sparklineUsdtEl, usdtHistory, usdtTrend);

        // BTC/USDT (follows USDT rate with extra spread)
        const btcMid = usdtMid;
        pushHistory(btcHistory, btcMid);
        const btcTrend = getTrend(btcHistory);
        const btcBuyPrice = btcMid + SELL_ADJUSTMENT + BTC_SPREAD_EXTRA;
        const btcSellPrice = btcMid - BUY_ADJUSTMENT - BTC_SPREAD_EXTRA;
        btcBuyRateEl.textContent = formatNaira(btcBuyPrice);
        btcSellRateEl.textContent = formatNaira(btcSellPrice);
        applyTrendClass([btcBuyValueEl, btcSellValueEl], btcTrend);
        drawSparkline(sparklineBtcEl, btcHistory, btcTrend);

        rateBarEl.classList.remove('is-error');
        lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString('en-NG')}`;
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

    async function fetchMonierateRates() {
        const response = await fetch(MONIERATE_URL, {
            headers: { api_key: MONIERATE_API_KEY }
        });
        if (!response.ok) throw new Error(`Rate API HTTP ${response.status}`);
        const data = await response.json();
        const rates = (data.data && data.data.latest_rates) || [];
        const usdtNgn = rates.find(entry => entry.pair === "usdtngn");
        const usdtMid = usdtNgn ? parseFloat(usdtNgn.rate_mid) : NaN;
        if (!Number.isFinite(usdtMid)) throw new Error('Invalid rate from Monierate');
        return { usdtMid };
    }

    async function fetchRate() {
        try {
            const { usdtMid } = await fetchMonierateRates();
            updateRates(usdtMid);
            startCountdown();
        } catch (error) {
            console.error('Monierate rate failed:', error);
            rateBarEl.classList.add('is-error');
            countdownEl.textContent = 'Rate unavailable — retrying...';
            setTimeout(fetchRate, 10000);
        }
    }

    fetchRate();
})();

// Scrollspy: neon highlight for the nav link matching the visible section
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove("active"));
            link.classList.add("active");
        }
    });
}, {
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0
});

sections.forEach(section => spyObserver.observe(section));
