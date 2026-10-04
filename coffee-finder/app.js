(function () {
  "use strict";

  const SHOPS = window.SHOPS;
  const MENTIONS = window.MENTIONS;
  const MENTION_HEADINGS = { abraco: 209, mariebelle: 209, reggio: 299 };
  MENTIONS.forEach(m => { m.photo = m.photo || { view: [m.lat, m.lng], heading: MENTION_HEADINGS[m.id] || 0 }; });

  const CRITERIA = {
    chocolate: "Chocolatey & rich",
    beans: "Bean quality",
    experience: "Unique experience"
  };

  // ---------- Settings (per-device, optional) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: keep defaults */ } }
  };
  let photoMode = store.get("cf.photoMode", "embed"); // embed | static | off
  let apiKey = store.get("cf.apiKey", "");

  // ---------- Helpers ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const total = s => s.scores.chocolate + s.scores.beans + s.scores.experience;
  const fit = s => (total(s) / 3).toFixed(1);
  const stars = n => { const f = Math.round(n); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); };
  const initials = name => name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("");

  const links = {
    directions: s => "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(s.name + ", " + s.address),
    maps: s => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.name + " " + s.address),
    pano: s => "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + s.photo.view.join(",") + "&heading=" + s.photo.heading + "&pitch=5&fov=80"
  };

  // Storefront photo: Google Street View pointed at the shop's door.
  function photoHTML(s, opts) {
    opts = opts || {};
    const ph = '<div class="ph">' + esc(initials(s.name)) + "</div>";
    let media = "";
    if (photoMode === "static" && apiKey) {
      const src = "https://maps.googleapis.com/maps/api/streetview?size=" + (opts.thumb ? "200x200" : "640x400") +
        "&location=" + encodeURIComponent(s.address) + "&fov=80&pitch=8&source=outdoor&key=" + encodeURIComponent(apiKey);
      media = '<img alt="Storefront of ' + esc(s.name) + '" src="' + src + '" loading="lazy" onerror="this.remove()">';
    } else if (photoMode !== "off" && !opts.thumb) {
      const src = "https://www.google.com/maps?layer=c&cbll=" + s.photo.view.join(",") +
        "&cbp=12," + s.photo.heading + ",,0,5&output=svembed";
      media = '<iframe title="Street View of ' + esc(s.name) + '" src="' + src + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    }
    const badge = opts.thumb || photoMode === "off" ? "" : '<span class="badge">Storefront · Google Street View</span>';
    return '<div class="photo">' + ph + media + badge + "</div>";
  }

  // ---------- Map ----------
  const map = L.map("map", { zoomControl: false, attributionControl: true, tap: true }).setView([40.733, -73.99], 14);
  const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  L.tileLayer("https://{s}.basemaps.cartocdn.com/" + (dark ? "dark_all" : "rastertiles/voyager") + "/{z}/{x}/{y}{r}.png", {
    maxZoom: 20, subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  function pinIcon(label, color, small, name) {
    const w = small ? 24 : 34, h = small ? 33 : 46;
    return L.divIcon({
      className: "",
      iconSize: [w, h], iconAnchor: [w / 2, h], popupAnchor: [0, -h + 4],
      html: '<div class="pin' + (small ? " small" : "") + '">' +
        '<svg viewBox="0 0 34 46"><path fill="' + color + '" stroke="rgba(0,0,0,.25)" d="M17 1C8.2 1 1 8 1 16.8 1 28.6 17 45 17 45s16-16.4 16-28.2C33 8 25.8 1 17 1z"/></svg>' +
        "<span>" + esc(label) + "</span>" +
        '<div class="pin-label">' + esc(name) + "</div></div>"
    });
  }

  const pinColor = getComputedStyle(document.documentElement).getPropertyValue("--pin").trim() || "#ea4335";
  const mutedColor = getComputedStyle(document.documentElement).getPropertyValue("--pin-muted").trim() || "#80868b";
  const markers = {};

  function popupHTML(s, isMention) {
    const sub = isMention ? esc(s.neighborhood) + " · near miss"
      : '<span class="stars">' + stars(fit(s)) + "</span> " + fit(s) + " fit · " + esc(s.neighborhood);
    return '<div class="pop"><div class="pop-photo">' + photoHTML(s, { thumb: false }) + '</div>' +
      '<div class="pop-body"><h4>' + esc(s.name) + '</h4><div class="meta">' + sub + "</div>" +
      (isMention ? "" : '<button class="more" data-open="' + s.id + '">See evidence &amp; details</button>') +
      "</div></div>";
  }

  SHOPS.forEach(s => {
    const m = L.marker([s.lat, s.lng], { icon: pinIcon(s.rank, pinColor, false, s.name), zIndexOffset: 500 - s.rank, riseOnHover: true })
      .addTo(map)
      .bindPopup(() => popupHTML(s, false), { maxWidth: 260, minWidth: 260, autoPanPaddingTopLeft: panelPad() });
    m.on("click", () => highlight(s.id));
    markers[s.id] = m;
  });
  MENTIONS.forEach(s => {
    const m = L.marker([s.lat, s.lng], { icon: pinIcon("", mutedColor, true, s.name) })
      .addTo(map)
      .bindPopup(() => popupHTML(s, true), { maxWidth: 260, minWidth: 260 });
    markers[s.id] = m;
  });

  map.on("popupopen", e => {
    const btn = e.popup.getElement().querySelector("[data-open]");
    if (btn) btn.addEventListener("click", () => openDetail(btn.dataset.open));
  });

  function isPhone() { return window.matchMedia("(max-width: 680px)").matches; }
  function panelPad() {
    return isPhone() ? L.point(20, 20) : L.point($("#panel").offsetWidth + 40, 20);
  }
  function fitAll() {
    const pts = SHOPS.concat(MENTIONS).map(s => [s.lat, s.lng]);
    const opts = isPhone()
      ? { paddingTopLeft: [30, 40], paddingBottomRight: [30, window.innerHeight * 0.46 + 20] }
      : { paddingTopLeft: [$("#panel").offsetWidth + 50, 80], paddingBottomRight: [90, 50] };
    map.fitBounds(pts, opts);
  }

  function highlight(id) {
    document.querySelectorAll(".pin.hot").forEach(p => p.classList.remove("hot"));
    document.querySelectorAll(".card.hot").forEach(c => c.classList.remove("hot"));
    const m = markers[id];
    if (m && m._icon) m._icon.querySelector(".pin").classList.add("hot");
    const card = document.querySelector('.card[data-id="' + id + '"]');
    if (card) card.classList.add("hot");
  }

  // ---------- Panel views ----------
  let sortKey = "rank";
  let query = "";

  function matches(s) {
    if (!query) return true;
    const hay = [s.name, s.neighborhood, s.address, s.tagline || s.why || "", (s.notes || []).join(" ")].join(" ").toLowerCase();
    return query.split(/\s+/).every(t => hay.includes(t));
  }

  function renderList() {
    const view = $("#listView");
    if (sortKey === "mentions") {
      const items = MENTIONS.filter(matches);
      view.innerHTML = '<div class="list-head"><h1>Near misses</h1><span>' + items.length + " places</span></div>" +
        '<div class="crit">Good spots that missed the top five on one of the three criteria.</div>' +
        items.map(s => '<button class="card" data-id="' + s.id + '" data-mention="1"><div>' +
          '<h2><span class="rank muted">·</span>' + esc(s.name) + "</h2>" +
          '<div class="meta">' + esc(s.neighborhood) + " · " + esc(s.address.split(",")[0]) + "</div>" +
          '<div class="tag-line">' + esc(s.why) + "</div>" +
          '<div class="notes"><a class="note" href="' + esc(s.url) + '" target="_blank" rel="noopener">Source</a></div>' +
          '</div><div class="thumb">' + photoHTML(s, { thumb: true }) + "</div></button>").join("") +
        footHTML();
    } else {
      let items = SHOPS.filter(matches).slice();
      if (sortKey === "rank") items.sort((a, b) => a.rank - b.rank);
      else items.sort((a, b) => b.scores[sortKey] - a.scores[sortKey] || a.rank - b.rank);
      const title = sortKey === "rank" ? "Top 5 coffee shops in Manhattan" : "Sorted by " + CRITERIA[sortKey].toLowerCase();
      view.innerHTML = '<div class="list-head"><h1>' + title + "</h1><span>" + items.length + " results</span></div>" +
        '<div class="crit">Picked for chocolatey, rich cups, top-quality beans and a visit worth remembering.</div>' +
        (items.length ? "" : '<div class="crit">No shops match “' + esc(query) + '”. Try “chocolate”, “siphon” or a neighborhood.</div>') +
        items.map(s => {
          const sub = sortKey === "rank" ? "" : ' · <b>' + CRITERIA[sortKey] + " " + s.scores[sortKey] + "/5</b>";
          return '<button class="card" data-id="' + s.id + '"><div>' +
            '<h2><span class="rank">' + s.rank + "</span>" + esc(s.name) + "</h2>" +
            '<div class="rating"><b>' + fit(s) + '</b><span class="stars">' + stars(fit(s)) + "</span>" + sub + "</div>" +
            '<div class="meta">Coffee shop · ' + s.price + " · " + esc(s.neighborhood) + "</div>" +
            '<div class="tag-line">' + esc(s.tagline) + "</div>" +
            '<div class="notes">' + s.notes.map(n => '<span class="note">' + esc(n) + "</span>").join("") + "</div>" +
            '</div><div class="thumb">' + photoHTML(s, { thumb: true }) + "</div></button>";
        }).join("") + footHTML();
    }
    view.querySelectorAll(".card").forEach(c => {
      c.addEventListener("click", e => {
        if (e.target.closest("a")) return;
        if (c.dataset.mention) { focusShop(c.dataset.id); } else { openDetail(c.dataset.id); }
      });
      c.addEventListener("mouseenter", () => highlight(c.dataset.id));
    });
  }

  function footHTML() {
    return '<div class="foot">Fit score is the average of three 1–5 ratings: chocolatey &amp; rich, bean quality and uniqueness. ' +
      'Each one is based on the sources listed on the shop’s page. Hours come from 2026 listings, so check before you go. ' +
      'Full notes: <a href="EVIDENCE.md" target="_blank">EVIDENCE.md</a>. ' +
      '<button type="button" data-settings>Photo settings</button></div>';
  }

  function focusShop(id) {
    const s = SHOPS.concat(MENTIONS).find(x => x.id === id);
    if (!s) return;
    map.flyTo([s.lat, s.lng], 17, { duration: 0.6 });
    setTimeout(() => markers[id].openPopup(), 650);
    highlight(id);
  }

  const svg = {
    dir: '<svg class="ico" viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>',
    pano: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-2 7h4a2 2 0 0 1 2 2v4h-2v5h-4v-5H8v-4a2 2 0 0 1 2-2zm-6 9.5C4 17 7.6 16 9 15.8v1.6c-2.2.4-3.4 1-3.4 1.1 0 .5 2.6 1.5 6.4 1.5s6.4-1 6.4-1.5c0-.2-1.2-.7-3.4-1.1v-1.6c1.4.2 5 1.2 5 2.7 0 2-4.2 3-8 3s-8-1-8-3z"/></svg>',
    maps: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
    web: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.07 16zm2.95-8H5.07a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38z"/></svg>',
    pin: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
    clock: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>',
    back: '<svg class="ico" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>'
  };

  function openDetail(id) {
    const s = SHOPS.find(x => x.id === id);
    if (!s) return;
    map.closePopup();
    const v = $("#detailView");
    v.innerHTML =
      '<div class="hero"><button class="back" aria-label="Back to results">' + svg.back + "</button>" + photoHTML(s) + "</div>" +
      '<div class="d-body">' +
        '<div class="d-title"><h1>' + esc(s.name) + "</h1>" +
          '<div class="rating"><b>' + fit(s) + '</b><span class="stars">' + stars(fit(s)) + "</span> fit for you · #" + s.rank + " pick</div>" +
          '<div class="meta">Coffee shop · ' + s.price + " · " + esc(s.neighborhood) + "</div></div>" +
        '<div class="actions">' +
          '<a class="action primary" href="' + links.directions(s) + '" target="_blank" rel="noopener"><span class="circ">' + svg.dir + "</span>Directions</a>" +
          '<a class="action" href="' + links.pano(s) + '" target="_blank" rel="noopener"><span class="circ">' + svg.pano + "</span>Street View</a>" +
          '<a class="action" href="' + links.maps(s) + '" target="_blank" rel="noopener"><span class="circ">' + svg.maps + "</span>Google Maps</a>" +
          '<a class="action" href="' + esc(s.website) + '" target="_blank" rel="noopener"><span class="circ">' + svg.web + "</span>Source</a>" +
        "</div>" +
        '<div class="section"><p style="margin:0">' + esc(s.tagline) + '</p>' +
          '<div class="notes">' + s.notes.map(n => '<span class="note">' + esc(n) + "</span>").join("") + "</div></div>" +
        '<div class="section"><h3>How it fits you</h3><div class="scores">' +
          Object.keys(CRITERIA).map(k => '<div class="score"><span>' + CRITERIA[k] + '</span><div class="bar"><i style="width:' + (s.scores[k] * 20) + '%"></i></div><span>' + s.scores[k] + "/5</span></div>").join("") +
        "</div></div>" +
        '<div class="order"><b>What to order</b>' + esc(s.order) + "</div>" +
        '<div class="section">' +
          '<div class="row">' + svg.pin + "<span>" + esc(s.address) + "</span></div>" +
          '<div class="row">' + svg.clock + "<span>" + esc(s.hours) + "</span></div></div>" +
        '<div class="section"><h3>Evidence</h3><ul class="evidence">' +
          s.evidence.map(e => "<li>" + esc(e.text) + "<br>" +
            (e.url ? '<a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.src) + " ↗</a>" : '<span class="src">' + esc(e.src) + "</span>") +
            "</li>").join("") +
        "</ul></div>" +
      "</div>";
    v.querySelector(".back").addEventListener("click", closeDetail);
    show("detail");
    $("#scroll").scrollTop = 0;
    expandSheet(true);
    highlight(id);
    const off = isPhone() ? [0, window.innerHeight * 0.25] : [-$("#panel").offsetWidth / 2, 0];
    const target = map.project([s.lat, s.lng], 16).add(off);
    map.flyTo(map.unproject(target, 16), 16, { duration: 0.6 });
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* file:// or sandbox */ }
  }

  function closeDetail() {
    show("list");
    try { history.replaceState(null, "", location.pathname); } catch (e) { /* ignore */ }
    fitAll();
  }

  function renderSettings() {
    const v = $("#settingsView");
    v.innerHTML = '<div class="settings">' +
      '<button class="back" style="position:static" aria-label="Back to results">' + svg.back + "</button>" +
      "<h1>Storefront photos</h1>" +
      "<p>Photos come from Google Street View, pointed at each shop’s door. Choose how to load them on this device.</p>" +
      '<label class="radio"><input type="radio" name="pm" id="pmEmbed" value="embed"> <span><b>Street View, no key</b><br><span class="meta">Works out of the box. You can pan the view to look around the block.</span></span></label>' +
      '<label class="radio"><input type="radio" name="pm" id="pmStatic" value="static"> <span><b>Street View photos with an API key</b><br><span class="meta">Sharper still photos, aimed at each address automatically. Needs a Google Maps Platform key with the Street View Static API turned on.</span></span></label>' +
      '<label for="apiKey">Google Maps API key</label><input type="text" id="apiKey" placeholder="AIza…" autocomplete="off" spellcheck="false">' +
      '<label class="radio"><input type="radio" name="pm" id="pmOff" value="off"> <span><b>No photos</b><br><span class="meta">Fastest on slow connections.</span></span></label>' +
      '<button class="btn" id="saveSettings">Save</button></div>';
    v.querySelector('input[value="' + photoMode + '"]').checked = true;
    v.querySelector("#apiKey").value = apiKey;
    v.querySelector(".back").addEventListener("click", () => show("list"));
    v.querySelector("#saveSettings").addEventListener("click", () => {
      photoMode = v.querySelector('input[name="pm"]:checked').value;
      apiKey = v.querySelector("#apiKey").value.trim();
      if (photoMode === "static" && !apiKey) photoMode = "embed";
      store.set("cf.photoMode", photoMode);
      store.set("cf.apiKey", apiKey);
      renderList();
      show("list");
    });
    show("settings");
  }

  function show(which) {
    $("#listView").hidden = which !== "list";
    $("#detailView").hidden = which !== "detail";
    $("#settingsView").hidden = which !== "settings";
    $("#chips").hidden = which !== "list";
  }

  function expandSheet(on) { if (isPhone()) $("#panel").classList.toggle("full", on); }

  // ---------- Wire up ----------
  $("#chips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => { c.classList.toggle("on", c === chip); c.setAttribute("aria-selected", c === chip); });
    sortKey = chip.dataset.sort;
    renderList();
    $("#scroll").scrollTop = 0;
  });
  $("#q").addEventListener("input", e => {
    query = e.target.value.trim().toLowerCase();
    $("#clearQ").hidden = !query;
    show("list");
    renderList();
  });
  $("#clearQ").addEventListener("click", () => { $("#q").value = ""; query = ""; $("#clearQ").hidden = true; renderList(); });
  $("#settingsBtn").addEventListener("click", renderSettings);
  document.addEventListener("click", e => { if (e.target.closest("[data-settings]")) renderSettings(); });
  $("#sheetHandle").addEventListener("click", () => $("#panel").classList.toggle("full"));
  $("#zoomIn").addEventListener("click", () => map.zoomIn());
  $("#zoomOut").addEventListener("click", () => map.zoomOut());
  $("#fitBtn").addEventListener("click", fitAll);

  // Hide grey near-miss labels when zoomed out so they don't collide.
  const syncZoom = () => $("#map").classList.toggle("far", map.getZoom() < 16);
  map.on("zoomend", syncZoom);

  renderList();
  fitAll();
  syncZoom();
  const start = location.hash.slice(1);
  if (SHOPS.some(s => s.id === start)) openDetail(start);
})();
