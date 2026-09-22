/* =========================================================
   LIVE TICKER — shared across all pages
   ========================================================= */
(function initTicker() {
  const track = document.getElementById('tickerContent');
  if (!track) return;                         // no ticker on this page

  /* Duplicate content for seamless loop */
  track.innerHTML += track.innerHTML;

  /* ---- Date + time ---- */
  function tick() {
    const now = new Date();

    const dateStr = now.toLocaleDateString('en-PK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = now.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    document.querySelectorAll('#tickDate')
      .forEach(el => el.textContent = dateStr);

    document.querySelectorAll('#tickTime')
      .forEach(el => el.textContent = timeStr);
  }

  tick();
  setInterval(tick, 1000);

  /* ---- Location ---- */
  const fallback = 'Karachi, PK';

  const setLoc = txt => {
    document.querySelectorAll('#tickLocation')
      .forEach(el => el.textContent = txt);
  };

  const cached = localStorage.getItem('cb_city');
  if (cached) return setLoc(cached);

  if (!navigator.geolocation) return setLoc(fallback);

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const r = await fetch(url);
        const d = await r.json();

        const city = d.address?.city
                  || d.address?.town
                  || d.address?.state
                  || fallback;
        const country = d.address?.country_code?.toUpperCase() || 'PK';
        const label = `${city}, ${country}`;

        setLoc(label);
        localStorage.setItem('cb_city', label);
      } catch {
        setLoc(fallback);
      }
    },
    () => setLoc(fallback),
    { timeout: 6000, maximumAge: 600000 }
  );
})();