// Global State
let currentUnit = 'C';
let currentLanguage = 'en';
let currentWeatherData = null;

// Translations Dictionary for Full UI
const translations = {
  en: {
    feelsLike: "Feels Like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    uvIndex: "UV Index",
    pressure: "Pressure",
    sunrise: "Sunrise",
    sunset: "Sunset",
    hourlyTitle: "Hourly Forecast (Next 24 Hours)",
    weeklyTitle: "7-Day Extended Forecast",
    searchPlaceholder: "Search city (e.g. Karachi, Lahore, Tokyo)...",
    directionText: "Direction"
  },
  ur: {
    feelsLike: "محسوس ہوتا ہے",
    humidity: "نمی",
    windSpeed: "ہوا کی رفتار",
    uvIndex: "یو وی انڈیکس",
    pressure: "ہوا کا دباؤ",
    sunrise: "طلوعِ آفتاب",
    sunset: "غروبِ آفتاب",
    hourlyTitle: "گھنٹہ وار پیشن گوئی",
    weeklyTitle: "ہفتہ وار پیشن گوئی",
    searchPlaceholder: "شہر تلاش کریں...",
    directionText: "سَمت"
  }
};

// Weather Database
const weatherDatabase = {
  karachi: {
    name: 'Karachi', country: 'PK', tempC: 36, condition: 'Sunny & Hot', urduCondition: 'شدید دھوپ اور گرمی',
    feelsLikeC: 40, highC: 38, lowC: 28, windSpeed: 18, windDir: 'SW', humidity: 70,
    uv: 9.0, uvStatus: 'Very High', pressure: 1012, sunrise: '06:15 AM', sunset: '06:32 PM', theme: 'sunny',
    advice: {
      en: "⚠️ Extreme heat outside! Avoid unnecessary outdoor activities and stay hydrated.",
      ur: "⚠️ باہر شدید گرمی ہے! بلا ضرورت باہر نکلنے سے گریز کریں اور پانی کا زیادہ استعمال کریں۔"
    }
  },
  lahore: {
    name: 'Lahore', country: 'PK', tempC: 28, condition: 'Hazy Sun', urduCondition: 'دھندلا سورج',
    feelsLikeC: 30, highC: 31, lowC: 22, windSpeed: 12, windDir: 'NE', humidity: 55,
    uv: 5.2, uvStatus: 'Moderate', pressure: 1014, sunrise: '06:02 AM', sunset: '06:18 PM', theme: 'sunny',
    advice: {
      en: "🌤️ Pleasant weather, but slight haze. Wear a mask if you have allergies.",
      ur: "🌤️ دن کا موسم اچھا ہے مگر ہلکی دھند ہے۔ الرجی والے افراد ماسک استعمال کریں۔"
    }
  },
  islamabad: {
    name: 'Islamabad', country: 'PK', tempC: 20, condition: 'Light Rain', urduCondition: 'ہلکی بارش',
    feelsLikeC: 19, highC: 22, lowC: 15, windSpeed: 14, windDir: 'N', humidity: 85,
    uv: 3.0, uvStatus: 'Low', pressure: 1016, sunrise: '06:05 AM', sunset: '06:21 PM', theme: 'rainy',
    advice: {
      en: "🌧️ Rainy weather outside. Keep an umbrella with you if you are heading out!",
      ur: "🌧️ باہر بارش ہو رہی ہے۔ اگر باہر جا رہے ہیں تو چھتری ساتھ رکھیں۔"
    }
  },
  london: {
    name: 'London', country: 'GB', tempC: 12, condition: 'Chilly Rain', urduCondition: 'ٹھنڈی بارش',
    feelsLikeC: 10, highC: 14, lowC: 8, windSpeed: 22, windDir: 'W', humidity: 88,
    uv: 1.5, uvStatus: 'Low', pressure: 1008, sunrise: '06:45 AM', sunset: '07:10 PM', theme: 'rainy',
    advice: {
      en: "🧥 Cold and wet weather! Dress warmly and wear a waterproof jacket.",
      ur: "🧥 موسم ٹھنڈا اور بارشی ہے۔ گرم کپڑے اور واٹر پروف جیکیٹ پہنیں۔"
    }
  },
  dubai: {
    name: 'Dubai', country: 'AE', tempC: 41, condition: 'Extreme Heat', urduCondition: 'شدید ترین گرمی',
    feelsLikeC: 46, highC: 43, lowC: 32, windSpeed: 15, windDir: 'SE', humidity: 40,
    uv: 10.5, uvStatus: 'Extreme', pressure: 1009, sunrise: '06:10 AM', sunset: '06:40 PM', theme: 'sunny',
    advice: {
      en: "🔥 Dangerous heatwave! Avoid direct sunlight and outdoor exertion.",
      ur: "🔥 لو اور شدید گرمی کی لہر! براہ راست دھوپ میں جانے سے مکمل پرہیز کریں۔"
    }
  }
};

// Weather Vector Graphics
function getWeatherSVG(theme) {
  if (theme === 'rainy') {
    return `<svg class="w-full h-full text-sky-300 drop-shadow-lg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3">
      <path d="M20 32 a12 12 0 0 1 22 -6 a10 10 0 0 1 12 10 a8 8 0 0 1 -8 8 h-26 a10 10 0 0 1 0 -12" fill="rgba(255,255,255,0.2)"/>
      <line x1="24" y1="48" x2="20" y2="56" stroke-linecap="round" stroke="cyan" />
      <line x1="34" y1="48" x2="30" y2="56" stroke-linecap="round" stroke="cyan" />
      <line x1="44" y1="48" x2="40" y2="56" stroke-linecap="round" stroke="cyan" />
    </svg>`;
  } else if (theme === 'cloudy') {
    return `<svg class="w-full h-full text-slate-200 drop-shadow-lg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3">
      <path d="M18 36 a10 10 0 0 1 18 -5 a8 8 0 0 1 10 8 a6 6 0 0 1 -6 6 h-22 a8 8 0 0 1 0 -9" fill="rgba(255,255,255,0.3)"/>
    </svg>`;
  }
  return `<svg class="w-full h-full text-amber-400 drop-shadow-lg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3">
    <circle cx="32" cy="32" r="14" fill="rgba(251, 191, 36, 0.4)" />
    <line x1="32" y1="6" x2="32" y2="12" stroke-linecap="round" />
    <line x1="32" y1="52" x2="32" y2="58" stroke-linecap="round" />
    <line x1="6" y1="32" x2="12" y2="32" stroke-linecap="round" />
    <line x1="52" y1="32" x2="58" y2="32" stroke-linecap="round" />
  </svg>`;
}

function formatTemp(valInC) {
  return currentUnit === 'F' ? Math.round((valInC * 9) / 5 + 32) : Math.round(valInC);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData('Karachi');
  initCanvas();
  startClock();
  updateDateDisplay();
});

function fetchWeatherData(cityName) {
  const key = cityName.toLowerCase();
  const data = weatherDatabase[key] || {
    name: cityName, country: 'PK', tempC: 30, condition: 'Clear Sky', urduCondition: 'صاف آسمان',
    feelsLikeC: 32, highC: 33, lowC: 24, windSpeed: 14, windDir: 'NW', humidity: 50,
    uv: 6.0, uvStatus: 'Moderate', pressure: 1013, sunrise: '06:00 AM', sunset: '06:30 PM', theme: 'sunny',
    advice: {
      en: "✨ Weather seems normal. Perfect day for your routine outdoor work!",
      ur: "✨ موسم معمول کے مطابق ہے۔ روزمرہ کاموں کے لیے بہترین دن ہے۔"
    }
  };

  currentWeatherData = data;
  renderUI();
}

function renderUI() {
  if (!currentWeatherData) return;
  const d = currentWeatherData;
  const t = translations[currentLanguage];

  const isUrdu = currentLanguage === 'ur';
  document.getElementById('app-body').dir = isUrdu ? 'rtl' : 'ltr';

  // Basic Information
  document.getElementById('city-name-display').innerText = d.name;
  document.getElementById('country-badge').innerText = d.country;
  document.getElementById('temperature-num').innerText = formatTemp(d.tempC);
  document.getElementById('unit-indicator').innerText = `°${currentUnit}`;

  // Condition & Advice Text
  document.getElementById('weather-condition-text').innerText = isUrdu ? d.urduCondition : d.condition;
  document.getElementById('weather-condition-text').className = isUrdu ? 'text-xl font-bold urdu-font text-center mt-1' : 'text-xl font-bold text-center mt-1';

  const adviceEl = document.getElementById('weather-advice-box');
  if (adviceEl) {
    adviceEl.innerText = isUrdu ? d.advice.ur : d.advice.en;
    adviceEl.className = isUrdu ? 'text-sm font-medium urdu-font leading-relaxed' : 'text-sm font-medium leading-relaxed';
  }

  // Label Updates
  updateLabel('label-feels-like', t.feelsLike, isUrdu);
  updateLabel('label-humidity', t.humidity, isUrdu);
  updateLabel('label-wind', t.windSpeed, isUrdu);
  updateLabel('label-uv', t.uvIndex, isUrdu);
  updateLabel('label-pressure', t.pressure, isUrdu);
  updateLabel('label-sunrise', t.sunrise, isUrdu);
  updateLabel('label-sunset', t.sunset, isUrdu);
  updateLabel('label-hourly-title', t.hourlyTitle, isUrdu);
  updateLabel('label-weekly-title', t.weeklyTitle, isUrdu);

  const searchInput = document.getElementById('city-search-input');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Key Metrics Values
  document.getElementById('feels-like-val').innerText = `${formatTemp(d.feelsLikeC)}°${currentUnit}`;
  document.getElementById('temp-high-val').innerText = `${formatTemp(d.highC)}°${currentUnit}`;
  document.getElementById('temp-low-val').innerText = `${formatTemp(d.lowC)}°${currentUnit}`;
  document.getElementById('wind-speed-val').innerText = d.windSpeed;
  document.getElementById('wind-dir-text').innerText = `${d.windDir} ${t.directionText}`;
  document.getElementById('humidity-val').innerText = d.humidity;
  document.getElementById('humidity-progress').style.width = `${d.humidity}%`;
  document.getElementById('uv-val').innerText = d.uv;
  document.getElementById('uv-status-badge').innerText = d.uvStatus;
  document.getElementById('pressure-val').innerText = d.pressure;
  document.getElementById('sunrise-time-val').innerText = d.sunrise;
  document.getElementById('sunset-time-val').innerText = d.sunset;

  // Theme & SVG Graphic
  document.getElementById('weather-vector-container').innerHTML = getWeatherSVG(d.theme);
  document.getElementById('app-body').className = `theme-${d.theme} min-h-screen text-white relative overflow-x-hidden flex flex-col justify-between transition-all duration-700`;

  renderHourlyForecast(d.tempC);
  renderWeeklyForecast(d.tempC);
}

function updateLabel(id, text, isUrdu) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = text;
    if (isUrdu) el.classList.add('urdu-font');
    else el.classList.remove('urdu-font');
  }
}

// Control Event Handlers
function handleSearchSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('city-search-input');
  if (input && input.value.trim() !== '') {
    fetchWeatherData(input.value.trim());
    input.value = '';
  }
}

function toggleTemperatureUnit(unit) {
  currentUnit = unit;
  document.getElementById('unit-c-btn').className = unit === 'C' ? 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 text-white shadow-lg transition' : 'px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition';
  document.getElementById('unit-f-btn').className = unit === 'F' ? 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 text-white shadow-lg transition' : 'px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition';
  renderUI();
}

function switchLanguage(lang) {
  currentLanguage = lang;
  document.getElementById('lang-en-btn').className = lang === 'en' ? 'px-3 py-1 rounded-xl text-xs font-bold bg-sky-500 text-white transition' : 'px-3 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition';
  document.getElementById('lang-ur-btn').className = lang === 'ur' ? 'px-3 py-1 rounded-xl text-xs font-bold bg-sky-500 text-white urdu-font transition' : 'px-3 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white urdu-font transition';
  renderUI();
}

// Dynamic Forecast Renderers
function renderHourlyForecast(baseTemp) {
  const container = document.getElementById('hourly-forecast-container');
  if (!container) return;

  const hours = ['Now', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  let html = '';

  hours.forEach((h, idx) => {
    const tempOffset = Math.sin(idx) * 2;
    const temp = Math.round(baseTemp + tempOffset);

    html += `
      <div class="glass-card p-3 rounded-2xl flex flex-col items-center min-w-[80px]">
        <span class="text-xs text-slate-300 font-medium">${h}</span>
        <i class="fa-solid fa-sun text-amber-400 my-2 text-base"></i>
        <span class="text-sm font-bold">${formatTemp(temp)}°${currentUnit}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderWeeklyForecast(baseTemp) {
  const container = document.getElementById('weekly-forecast-container');
  if (!container) return;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let html = '';

  days.forEach((day, idx) => {
    const high = Math.round(baseTemp + (idx % 3));
    const low = Math.round(baseTemp - 6 - (idx % 2));

    html += `
      <div class="glass-card p-4 rounded-2xl flex flex-col items-center justify-between gap-2">
        <span class="text-xs font-bold text-slate-300">${day}</span>
        <i class="fa-solid fa-cloud-sun text-sky-300 text-xl my-1"></i>
        <div class="text-xs font-semibold flex gap-2">
          <span class="text-amber-400">${formatTemp(high)}°</span>
          <span class="text-slate-400">${formatTemp(low)}°</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Realtime Clock & Dates
function startClock() {
  const clockEl = document.getElementById('live-time-clock');
  setInterval(() => {
    const now = new Date();
    if (clockEl) {
      clockEl.innerText = now.toLocaleTimeString();
    }
  }, 1000);
}

function updateDateDisplay() {
  const dateEl = document.getElementById('current-date-display');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('en-US', options);
  }
}

// Background Weather Particle Engine
function initCanvas() {
  const canvas = document.getElementById('weather-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    speedY: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';

    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.speedY;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}