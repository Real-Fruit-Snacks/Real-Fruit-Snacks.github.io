(() => {
  "use strict";

  const PHASES = [
    { idx: 0, slug: "lx-001", code: "LX 001", label: "Blackout", scheme: "dark", tool: "pwn-broker" },
    { idx: 1, slug: "lx-127", code: "LX 127", label: "Glacial Steel", scheme: "dark", tool: "port-sync" },
    { idx: 2, slug: "lx-263", code: "LX 263", label: "Beacon Horizon", scheme: "dark", tool: "screen-mark" },
    { idx: 3, slug: "lx-389", code: "LX 389", label: "Maritime Flame", scheme: "dark", tool: "carify" },
    { idx: 4, slug: "lx-455", code: "LX 455", label: "Warm Frost", scheme: "light", tool: "certapi" },
    { idx: 5, slug: "lx-512", code: "LX 512", label: "Alabaster Day", scheme: "light", tool: "open-file" }
  ];

  const TOOLS = {
    "screen-mark": {
      no: "#01",
      language: "Rust",
      platform: "Windows, Linux",
      description: "Screenshot capture and annotation in pure Rust.",
      inText: "Ctrl+PrintScreen",
      outText: "screen-mark_2026-11-05_091412.png",
      site: "https://real-fruit-snacks.github.io/screen-mark/",
      repo: "https://github.com/Real-Fruit-Snacks/screen-mark"
    },
    "port-sync": {
      no: "#02",
      language: "Rust",
      platform: "Windows",
      description: "Keeps qBittorrent's port synced to Proton VPN.",
      inText: "Port pair 51037->51037",
      outText: "listening port updated: 48213 -> 51037",
      site: "https://real-fruit-snacks.github.io/port-sync/",
      repo: "https://github.com/Real-Fruit-Snacks/port-sync"
    },
    "carify": {
      no: "#03",
      language: "sh, PowerShell",
      platform: "Windows, macOS, Linux",
      description: "Convert video for Uconnect USB playback, via ffmpeg.",
      inText: "HEVC 10-bit · 1080p · AC3 5.1",
      outText: "H.264 8-bit · 720p · AAC stereo",
      site: "https://real-fruit-snacks.github.io/carify/",
      repo: "https://github.com/Real-Fruit-Snacks/carify"
    },
    "certapi": {
      no: "#04",
      language: "C#",
      platform: "Windows",
      description: "mTLS API client for the Windows certificate store.",
      inText: "a client certificate in CurrentUser\\My",
      outText: "200 OK; the key never left the store",
      site: "https://real-fruit-snacks.github.io/certapi/",
      repo: "https://github.com/Real-Fruit-Snacks/certapi"
    },
    "identity-gen": {
      no: "#05",
      language: "HTML",
      platform: "Browser",
      description: "Offline generator for throwaway signup identities.",
      inText: "a signup form that wants too much",
      outText: "a stand-in: name, handle, passphrase",
      site: "https://real-fruit-snacks.github.io/identity-gen/",
      repo: "https://github.com/Real-Fruit-Snacks/identity-gen"
    },
    "amazon-order-sync": {
      no: "#06",
      language: "Rust",
      platform: "Windows, Linux",
      description: "Syncs your Amazon orders into local Markdown notes.",
      inText: "Amazon's order history",
      outText: "one Order-<id>.md per order",
      site: "https://real-fruit-snacks.github.io/amazon-order-sync/",
      repo: "https://github.com/Real-Fruit-Snacks/amazon-order-sync"
    },
    "powershell-toolbox": {
      no: "#07",
      language: "PowerShell",
      platform: "Windows",
      description: "A grab-bag of my PowerShell scripts, each one standalone.",
      inText: "every repo your gh login sees",
      outText: "one at a time: keep, archive or delete",
      site: "https://real-fruit-snacks.github.io/powershell-toolbox/",
      repo: "https://github.com/Real-Fruit-Snacks/powershell-toolbox"
    },
    "pwn-broker": {
      no: "#08",
      language: "Python",
      platform: "Kali Linux",
      description: "Keeps a box's targets, notes, creds and tools in order.",
      inText: "pwn-broker new",
      outText: "2026-11-16_htb_forest.finished.tar.gz",
      site: "https://real-fruit-snacks.github.io/pwn-broker/",
      repo: "https://github.com/Real-Fruit-Snacks/pwn-broker"
    },
    "pwn-shop": {
      no: "#09",
      language: "Python",
      platform: "Kali Linux",
      description: "Tool packages for pwn-broker, built from upstream releases.",
      inText: "an upstream release, pinned by SHA-256",
      outText: "kerbrute-1.0.3-1.zip",
      site: "https://real-fruit-snacks.github.io/pwn-shop/",
      repo: "https://github.com/Real-Fruit-Snacks/pwn-shop"
    },
    "pwn-playbooks": {
      no: "#10",
      language: "Markdown",
      platform: "Kali Linux",
      description: "Playbooks for pwn-broker: read into the note, fill in, run.",
      inText: ":Pb smb in the note window",
      outText: "Playbook: SMB enumeration, to fill in",
      site: "https://real-fruit-snacks.github.io/pwn-playbooks/",
      repo: "https://github.com/Real-Fruit-Snacks/pwn-playbooks"
    },
    "pwn-report": {
      no: "#11",
      language: "Python",
      platform: "Kali Linux",
      description: "Private, evidence-linked reports from pwn-broker archives.",
      inText: "2026-11-16_htb_forest.finished.tar.gz",
      outText: "report.md, every file with its SHA-256",
      site: "https://real-fruit-snacks.github.io/pwn-report/",
      repo: "https://github.com/Real-Fruit-Snacks/pwn-report"
    },
    "open-file": {
      no: "#12",
      language: "TypeScript",
      platform: "Browser",
      description: "Learn and play chess in your browser, offline.",
      inText: "a blunder in one of your games",
      outText: "a puzzle made from it",
      site: "https://real-fruit-snacks.github.io/open-file/",
      repo: "https://github.com/Real-Fruit-Snacks/open-file"
    },
    "one-billion-pixels": {
      no: "#13",
      language: "TypeScript",
      platform: "Browser",
      description: "Excavate one billion pixels in your browser, offline.",
      inText: "a single empty origin square",
      outText: "one billion pixels carved offline",
      site: "https://real-fruit-snacks.github.io/one-billion-pixels/",
      repo: "https://github.com/Real-Fruit-Snacks/one-billion-pixels"
    },
    "hash-bait": {
      no: "#14",
      language: "Rust",
      platform: "Windows, Linux",
      description: "Drop poisoned shortcuts on SMB shares to coerce NTLM hashes.",
      inText: "//dc1/public + responder IP",
      outText: "poisoned .url/.scf/.xml, NetNTLMv2",
      site: "https://real-fruit-snacks.github.io/hash-bait/",
      repo: "https://github.com/Real-Fruit-Snacks/hash-bait"
    },
    "cred-spray": {
      no: "#15",
      language: "Python",
      platform: "Windows, Linux",
      description: "Bounded, protocol-aware credential spraying.",
      inText: "scan.xml + credentials.txt",
      outText: "results.json, 7 explicit statuses",
      site: "https://real-fruit-snacks.github.io/cred-spray/",
      repo: "https://github.com/Real-Fruit-Snacks/cred-spray"
    },
    "ad-sweep": {
      no: "#16",
      language: "Rust",
      platform: "Windows, Linux",
      description: "Runs isolated Active Directory enumeration with NetExec.",
      inText: "10.0.0.1-2 + credentials.txt",
      outText: "ordered results.json per target",
      site: "https://real-fruit-snacks.github.io/ad-sweep/",
      repo: "https://github.com/Real-Fruit-Snacks/ad-sweep"
    },
    "shell-tunnel": {
      no: "#17",
      language: "Go",
      platform: "Windows, Linux",
      description: "Static SSH server for bind and reverse shells, PTY and SFTP.",
      inText: "./build.sh reverse 10.10.14.5:4444",
      outText: "PTY shell, SFTP & -L/-R/-D via ssh",
      site: "https://real-fruit-snacks.github.io/shell-tunnel/",
      repo: "https://github.com/Real-Fruit-Snacks/shell-tunnel"
    }
  };

  const TOTAL_ACTIVE = Object.keys(TOOLS).length;

  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const schemeToggle = document.getElementById("schemeToggle");
  const scrubber = document.getElementById("horizon-scrubber");
  const scrubberReadout = document.getElementById("scrubberReadout");
  const heroPhaseTitle = document.getElementById("heroPhaseTitle");
  const railPhaseCode = document.getElementById("railPhaseCode");
  const railPhaseLabel = document.getElementById("railPhaseLabel");
  const railToolReadout = document.getElementById("railToolReadout");
  const horizonButtons = Array.from(document.querySelectorAll(".phase-tile"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn[data-filter]"));
  const searchInput = document.getElementById("tool-search");
  const tableRows = Array.from(document.querySelectorAll("#cueTableBody tr"));
  const visibleCount = document.getElementById("visibleCount");
  const emptyState = document.getElementById("emptyState");
  const resetFilterBtn = document.getElementById("resetFilterBtn");
  const navLinks = Array.from(document.querySelectorAll(".rail-nav a[data-nav]"));

  const proofRepo = document.getElementById("proofRepo");
  const proofCue = document.getElementById("proofCue");
  const proofLang = document.getElementById("proofLang");
  const proofDesc = document.getElementById("proofDesc");
  const proofIn = document.getElementById("proofIn");
  const proofOut = document.getElementById("proofOut");
  const proofPlatform = document.getElementById("proofPlatform");
  const cloneCmd = document.getElementById("clone-cmd");
  const proofDocsLink = document.getElementById("proofDocsLink");
  const proofRepoLink = document.getElementById("proofRepoLink");

  function getStoredScheme() {
    try {
      const val = localStorage.getItem("rfs-theme") || localStorage.getItem("color-scheme");
      return val === "light" || val === "dark" ? val : null;
    } catch {
      return null;
    }
  }

  function getRenderedScheme() {
    return getStoredScheme() === "light" ? "light" : "dark";
  }

  function setSchemeOverride(targetScheme) {
    try {
      localStorage.setItem("rfs-theme", targetScheme);
      if (targetScheme === "dark") {
        localStorage.removeItem("color-scheme");
      } else {
        localStorage.setItem("color-scheme", "light");
      }
    } catch {}
    if (metaScheme) metaScheme.content = targetScheme === "light" ? "light" : "dark";
    const tm = document.querySelector('meta[name="theme-color"]');
    if (tm) tm.content = targetScheme === "light" ? "#f5f7f9" : "#050507";
  }

  function updateDeepLink(phaseSlug, toolKey) {
    if (!window.history || !window.history.replaceState) return;
    const hash = `#cue=${phaseSlug}&tool=${toolKey}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  let currentPhaseIdx = 2;
  let currentToolKey = "screen-mark";

  function applyPhase(idx, options = {}) {
    const { persist = true, syncTool = false, updateHash = false } = options;
    const clamped = Math.max(0, Math.min(5, Number(idx)));
    const phase = PHASES[clamped];
    currentPhaseIdx = clamped;
    document.documentElement.dataset.cue = String(clamped);

    if (scrubber) {
      scrubber.value = String(clamped);
      scrubber.setAttribute("aria-valuetext", `${phase.code} ${phase.label}`);
    }
    if (scrubberReadout) scrubberReadout.textContent = `${phase.code} / 512`;
    if (heroPhaseTitle) heroPhaseTitle.textContent = `${phase.code} · ${phase.label.toUpperCase()}`;
    if (railPhaseCode) railPhaseCode.textContent = phase.code;
    if (railPhaseLabel) railPhaseLabel.textContent = phase.label;

    horizonButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(Number(btn.dataset.horizon) === clamped));
    });

    if (persist) {
      setSchemeOverride(phase.scheme);
      try {
        localStorage.setItem("rfs-cyc-cue", String(clamped));
      } catch {}
    }

    if (syncTool && phase.tool) {
      selectTool(phase.tool, { updateHash: false });
    }

    if (updateHash) {
      updateDeepLink(phase.slug, currentToolKey);
    }
  }

  function selectTool(repoKey, options = {}) {
    const { updateHash = false } = options;
    const tool = TOOLS[repoKey];
    if (!tool) return;
    currentToolKey = repoKey;

    if (proofRepo) proofRepo.textContent = repoKey;
    if (proofCue) proofCue.textContent = `${tool.no} / ${TOTAL_ACTIVE}`;
    if (proofLang) proofLang.textContent = tool.language;
    if (proofDesc) proofDesc.textContent = tool.description;
    if (proofIn) proofIn.textContent = tool.inText;
    if (proofOut) proofOut.textContent = tool.outText;
    if (proofPlatform) proofPlatform.textContent = tool.platform;
    if (cloneCmd) cloneCmd.textContent = `git clone ${tool.repo}.git`;
    if (railToolReadout) railToolReadout.textContent = `${tool.no} · ${repoKey}`;

    if (proofRepoLink) proofRepoLink.href = tool.repo;
    if (proofDocsLink) {
      if (tool.site) {
        proofDocsLink.hidden = false;
        proofDocsLink.href = tool.site;
      } else {
        proofDocsLink.hidden = true;
      }
    }

    tableRows.forEach((row) => {
      const selected = row.dataset.repo === repoKey;
      row.classList.toggle("is-selected", selected);
      const btn = row.querySelector(".tool-select-btn");
      if (btn) btn.setAttribute("aria-pressed", String(selected));
    });

    if (updateHash) {
      updateDeepLink(PHASES[currentPhaseIdx].slug, repoKey);
    }
  }

  /* Deep-linkable hash cue parsing (#cue=lx-389&tool=carify or #lx-127) */
  function parseHashState() {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return null;

    const params = new URLSearchParams(raw.includes("=") ? raw : "");
    const cueParam = (params.get("cue") || raw).toLowerCase();
    const toolParam = params.get("tool");

    const matchedPhase = PHASES.find((p) => p.slug === cueParam);
    const matchedTool = toolParam && TOOLS[toolParam] ? toolParam : null;
    if (!matchedPhase && !matchedTool) return null;

    return {
      phaseIdx: matchedPhase ? matchedPhase.idx : null,
      toolKey: matchedTool || (matchedPhase ? matchedPhase.tool : null)
    };
  }

  window.addEventListener("hashchange", () => {
    const state = parseHashState();
    if (!state) return;
    if (state.phaseIdx !== null) {
      applyPhase(state.phaseIdx, { persist: true, syncTool: false, updateHash: false });
    }
    if (state.toolKey) {
      selectTool(state.toolKey, { updateHash: false });
    }
  });

  /* Two-state Dark / Alabaster Day toggle with circular View Transition */
  if (schemeToggle) {
    schemeToggle.addEventListener("click", () => {
      const target = getRenderedScheme() === "dark" ? "light" : "dark";
      const nextCue = target === "dark" ? 2 : 5;
      const applyToggle = () => {
        setSchemeOverride(target);
        applyPhase(nextCue, { persist: false, syncTool: true, updateHash: true });
        try {
          localStorage.setItem("rfs-cyc-cue", String(nextCue));
        } catch {}
      };
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (typeof document.startViewTransition === "function" && !reduceMotion) {
        const rect = schemeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        document.documentElement.style.setProperty("--vt-x", `${x}px`);
        document.documentElement.style.setProperty("--vt-y", `${y}px`);
        document.documentElement.style.setProperty("--vt-r", `${r}px`);
        document.startViewTransition(applyToggle);
      } else {
        applyToggle();
      }
    });
  }

  /* Cross-tab storage sync */
  window.addEventListener("storage", (event) => {
    if (event.key === "rfs-theme" || event.key === "color-scheme") {
      const val = event.newValue;
      if (metaScheme) {
        metaScheme.content = val === "light" ? "light" : "dark";
      }
    }
    if (event.key === "rfs-cyc-cue" && event.newValue !== null && /^[0-5]$/.test(event.newValue)) {
      applyPhase(Number(event.newValue), { persist: false, syncTool: true, updateHash: false });
    }
  });

  /* Scrubbable Horizon Fader */
  if (scrubber) {
    scrubber.addEventListener("input", () => {
      applyPhase(Number(scrubber.value), { persist: true, syncTool: true, updateHash: true });
    });
  }

  /* Stepped Atmospheric Tool Horizon Tiles */
  horizonButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPhase(Number(btn.dataset.horizon), { persist: true, syncTool: false, updateHash: false });
      if (btn.dataset.tool) {
        selectTool(btn.dataset.tool, { updateHash: true });
      }
    });
  });

  /* Table Row Selection */
  document.querySelectorAll(".tool-select-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectTool(btn.dataset.select, { updateHash: true });
    });
  });

  /* Rail Navigation Scrollspy */
  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const active = link.dataset.nav === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const sections = [
      { id: "top", el: document.querySelector(".cyc-hero") },
      { id: "catalog", el: document.getElementById("catalog") },
      { id: "standards", el: document.getElementById("standards") }
    ].filter((s) => s.el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const hit = sections.find((s) => s.el === visible[0].target);
          if (hit) setActiveNav(hit.id);
        }
      },
      { root: document.querySelector(".stage-main"), rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    sections.forEach((s) => observer.observe(s.el));
  }

  /* Stack Filter & Search */
  let activeFilter = "all";

  function applyFilters() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let shown = 0;

    tableRows.forEach((row) => {
      const tags = (row.dataset.tags || "").toLowerCase();
      const text = row.textContent.toLowerCase();
      const matchesFilter = activeFilter === "all" || tags.split(/\s+/).includes(activeFilter);
      const matchesQuery = !query || text.includes(query);
      const visible = matchesFilter && matchesQuery;
      row.hidden = !visible;
      if (visible) shown += 1;
    });

    if (visibleCount) visibleCount.textContent = String(shown);
    if (emptyState) emptyState.hidden = shown > 0;
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter || "all";
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      activeFilter = "all";
      if (searchInput) searchInput.value = "";
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === "all")));
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  /* Accessible Copy Button using Invoker Commands + progressive click fallback */
  const timers = new WeakMap();
  let lastAnnouncement = "";

  function reportCopy(button, ok) {
    const tip = button.nextElementSibling;
    clearTimeout(timers.get(button));
    button.removeAttribute("data-copied");
    button.removeAttribute("data-failed");

    let message = ok ? "Copied" : "Copy failed";
    if (message === lastAnnouncement) message += "\u00A0";
    lastAnnouncement = message;

    if (tip) tip.textContent = "";
    void button.offsetWidth;
    button.setAttribute(ok ? "data-copied" : "data-failed", "");
    requestAnimationFrame(() => {
      if (tip) tip.textContent = message;
    });

    timers.set(
      button,
      setTimeout(() => {
        button.removeAttribute("data-copied");
        button.removeAttribute("data-failed");
        if (tip) tip.textContent = "";
      }, 2000)
    );
  }

  async function copyFromCommand(button, target) {
    const text = target ? target.innerText.trim() : "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      reportCopy(button, true);
    } catch {
      reportCopy(button, false);
    }
  }

  if ("CommandEvent" in window) {
    document.addEventListener(
      "command",
      (event) => {
        if (event.command === "--copy") {
          copyFromCommand(event.source, event.target);
        }
      },
      true
    );
  } else {
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      const button = event.target.closest('button[command="--copy"]');
      if (!button) return;
      const target = document.getElementById(button.getAttribute("commandfor"));
      if (target) copyFromCommand(button, target);
    });
  }

  /* Boot: deep-link hash wins, else resolved data-cue synchronized with its paired tool */
  const hashState = parseHashState();
  if (hashState) {
    const startIdx = hashState.phaseIdx !== null ? hashState.phaseIdx : (getRenderedScheme() === "dark" ? 2 : 5);
    applyPhase(startIdx, { persist: false, syncTool: false, updateHash: false });
    selectTool(hashState.toolKey || PHASES[startIdx].tool, { updateHash: false });
  } else {
    const rawCue = document.documentElement.dataset.cue;
    const startIdx = rawCue !== undefined && /^[0-5]$/.test(rawCue) ? Number(rawCue) : (getRenderedScheme() === "dark" ? 2 : 5);
    applyPhase(startIdx, { persist: false, syncTool: true, updateHash: false });
  }
})();
