/* Resume site — dossier v2 component
   Full-viewport responsive layout. Not fixed width.
*/

const Dossier = () => {
  const repos = window.REPOS;
  const features = window.FEATURES || {};

  const [query, setQuery] = React.useState("");
  const [activeLang, setActiveLang] = React.useState(null);
  const [activeCat, setActiveCat] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [typed, setTyped] = React.useState("");

  // Canonical category order
  const CATEGORIES = [
    { id: "c2", name: "C2 & Implants", accent: "var(--red)",
      tag: "./c2-and-implants",
      shortDesc: "encrypted implants & frameworks",
      desc: "Command-and-control frameworks, encrypted implants, and stealth loaders." },
    { id: "net", name: "Network & Tunneling", accent: "var(--teal)",
      tag: "./network-and-tunneling",
      shortDesc: "pivoting, SSH, relays",
      desc: "SSH servers, pivoting kits, relays, and custom transport layers." },
    { id: "enum", name: "Enumeration & Analysis", accent: "var(--peach)",
      tag: "./enumeration-and-analysis",
      shortDesc: "AD, creds, forensics",
      desc: "AD auditing, credential work, forensics, and fuzzing tools." },
    { id: "web", name: "Web & Dev Tools", accent: "var(--blue)",
      tag: "./web-and-dev-tools",
      shortDesc: "browser tooling & editors",
      desc: "Browser tooling, editors, PWAs, and research infrastructure." },
    { id: "games", name: "Games", accent: "var(--yellow)",
      tag: "./games",
      shortDesc: "built between engagements",
      desc: "Browser games built for fun between engagements." },
    { id: "meta", name: "Platforms & Meta", accent: "var(--mauve)",
      tag: "./platforms-and-meta",
      shortDesc: "umbrella platforms",
      desc: "Umbrella platforms and cross-cutting projects." },
  ];

  const catByName = {
    "C2 & Implants": "c2",
    "Network & Tunneling": "net",
    "Enumeration & Analysis": "enum",
    "Web & Dev Tools": "web",
    "Games": "games",
    "Platforms & Meta": "meta",
  };

  const languages = [...new Set(repos.map(r => r.lang))];

  const filtered = repos.filter(r => {
    const q = query.toLowerCase();
    const mQ = !q || r.name.toLowerCase().includes(q) ||
               r.desc.toLowerCase().includes(q) ||
               r.topics.some(t => t.includes(q));
    const mL = !activeLang || r.lang === activeLang;
    return mQ && mL;
  });

  // Live-typed tagline
  const TAGLINE = "Offensive tooling. Red team ops. OPSEC-first design.";
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(TAGLINE.slice(0, i));
      if (i >= TAGLINE.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  // Scroll-spy for sticky sub-nav
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting)
                             .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const id = visible.target.getAttribute("data-cat-id");
        if (id) setActiveCat(id);
      }
    }, { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    document.querySelectorAll("[data-cat-id]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  const jumpTo = (id) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Lock body scroll when drawer open
  React.useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selected]);

  // Close drawer on Escape
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--base)", color: "var(--text)",
      fontFamily: 'ui-sans-serif, "Inter", system-ui, sans-serif',
    }}>
      {/* Sticky header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "color-mix(in oklab, var(--base) 90%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--surface0)",
      }}>
        <div className="wrap" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 24px",
          fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
          fontSize: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="tl"><span className="r"/><span className="y"/><span className="g"/></div>
          </div>
          <div className="sticky-nav" style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {CATEGORIES.map(c => {
              const count = repos.filter(r => catByName[r.category] === c.id).length;
              if (!count) return null;
              const active = activeCat === c.id;
              return (
                <button key={c.id} onClick={()=>jumpTo(c.id)} style={{
                  background: active ? "var(--surface0)" : "transparent",
                  border: "1px solid " + (active ? "var(--surface1)" : "transparent"),
                  color: active ? "var(--text)" : "var(--overlay1)",
                  padding: "4px 10px", borderRadius: 4,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: c.accent,
                    boxShadow: active ? `0 0 8px ${c.accent}` : "none",
                    transition: "box-shadow .2s",
                  }}/>
                  {c.name} <span style={{color:"var(--overlay0)"}}>{count}</span>
                </button>
              );
            })}
          </div>
          <a href="https://github.com/Real-Fruit-Snacks" target="_blank"
            className="header-gh"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px",
              border: "1px solid var(--surface1)",
              borderRadius: 6,
              color: "var(--subtext1)",
              textDecoration: "none",
              fontSize: 11, whiteSpace: "nowrap",
              fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
              transition: "border-color .15s, color .15s, background .15s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>Real-Fruit-Snacks</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        borderBottom: "1px solid var(--surface0)",
        padding: "56px 24px 48px",
      }}>
        <div className="wrap hero-wrap" style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gap: 48,
          gridTemplateColumns: "1.2fr 1fr",
        }}>
          <div>
            <h1 style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              lineHeight: 0.98, margin: "0 0 18px",
              fontWeight: 700, letterSpacing: -2, color: "var(--text)",
            }}>
              Matt<span style={{color:"var(--mauve)"}}>.</span>
            </h1>
            <div style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "var(--subtext0)",
              lineHeight: 1.5, maxWidth: 560,
              fontFamily: 'ui-monospace, Menlo, monospace',
              minHeight: "3em",
            }}>
              <span style={{color:"var(--overlay0)"}}>{"//"} </span>
              {typed}
              <span style={{
                display: "inline-block", width: 8, height: "1.1em",
                background: "var(--mauve)", verticalAlign: "text-bottom",
                marginLeft: 2,
                animation: "blink 1s step-end infinite",
              }}/>
            </div>

            <div style={{
              marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap",
              fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12,
            }}>
              <a href="https://github.com/Real-Fruit-Snacks" target="_blank" style={{
                padding: "9px 18px", background: "var(--mauve)",
                color: "var(--crust)", borderRadius: 6, textDecoration: "none",
                fontWeight: 600,
              }}>
                → github.com/Real-Fruit-Snacks
              </a>
            </div>
          </div>

          {/* Category matrix — doubles as table of contents */}
          <div className="hero-stats" style={{
            alignSelf: "center",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            border: "1px solid var(--surface0)", borderRadius: 10,
            overflow: "hidden",
          }}>
            {CATEGORIES.map((cat, i) => {
              const count = repos.filter(r => catByName[r.category] === cat.id).length;
              return (
                <button key={cat.id}
                  onClick={() => jumpTo(cat.id)}
                  className="cat-cell"
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    background: "var(--mantle)",
                    border: "none",
                    borderBottom: i < 4 ? "1px solid var(--surface0)" : "none",
                    borderRight: i % 2 === 0 ? "1px solid var(--surface0)" : "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "inherit",
                    transition: "background .15s ease",
                  }}>
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6,
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: cat.accent, flexShrink: 0,
                    }}/>
                    <span style={{
                      fontSize: 28, fontWeight: 700, lineHeight: 1,
                      color: cat.accent,
                      fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
                    }}>{String(count).padStart(2,"0")}</span>
                  </div>
                  <div style={{
                    fontSize: 13, color: "var(--text)", fontWeight: 600,
                    marginBottom: 2, letterSpacing: -0.2,
                  }}>{cat.name}</div>
                  <div style={{
                    fontSize: 11, color: "var(--overlay1)",
                    fontFamily: 'ui-monospace, Menlo, monospace',
                  }}>{cat.shortDesc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter rail */}
      <div style={{
        position: "sticky", top: 53, zIndex: 40,
        background: "color-mix(in oklab, var(--mantle) 92%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--surface0)",
      }}>
        <div className="wrap filter-row" style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          padding: "12px 24px",
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12,
        }}>
          <div style={{
            flex: "0 0 260px", display: "flex", alignItems: "center", gap: 8,
            background: "var(--base)", border: "1px solid var(--surface0)",
            padding: "7px 12px", borderRadius: 6,
          }}>
            <span style={{color:"var(--overlay0)"}}>/</span>
            <input
              id="search-input"
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="search name, topic, description"
              style={{
                flex: 1, background:"transparent", border:"none", outline:"none",
                color: "var(--text)", fontFamily: "inherit", fontSize: 12,
              }}
            />
            {query && (
              <span onClick={()=>setQuery("")} style={{
                cursor:"pointer", color:"var(--overlay0)",
              }}>×</span>
            )}
          </div>

          <span style={{color:"var(--overlay0)"}} className="hide-sm">│</span>

          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <span onClick={()=>setActiveLang(null)} style={{
              padding: "5px 10px", borderRadius: 4, cursor: "pointer",
              background: !activeLang ? "var(--surface1)" : "transparent",
              color: !activeLang ? "var(--text)" : "var(--overlay1)",
              border: "1px solid " + (!activeLang ? "var(--surface2)" : "transparent"),
            }}>all</span>
            {languages.map(l => (
              <span key={l} onClick={()=>setActiveLang(l===activeLang?null:l)}
                className={`lang-${l}`} style={{
                  padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: l === activeLang ? "var(--surface1)" : "transparent",
                  color: l === activeLang ? "var(--text)" : "var(--overlay1)",
                  border: "1px solid " + (l === activeLang ? "var(--surface2)" : "transparent"),
                }}>
                <span className="lang-dot" style={{width:7,height:7}}/>
                {l}
              </span>
            ))}
          </div>

          <span style={{color:"var(--overlay0)", marginLeft: "auto", fontSize: 11}}>
            {filtered.length} / {repos.length}
          </span>
        </div>
      </div>

      {/* Sections by category */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 80px" }}>
        {CATEGORIES.map(cat => {
          const items = filtered.filter(r => catByName[r.category] === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id={`cat-${cat.id}`} data-cat-id={cat.id}
              style={{ paddingTop: 40, scrollMarginTop: 120 }}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 12,
                marginBottom: 6, flexWrap: "wrap",
              }}>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 11, color: "var(--overlay1)",
                  letterSpacing: 1, textTransform: "uppercase",
                }}>{String(CATEGORIES.indexOf(cat)+1).padStart(2,"0")} //</span>
                <h2 style={{
                  fontSize: "clamp(28px, 3.2vw, 40px)",
                  fontWeight: 700, letterSpacing: -1,
                  margin: 0, color: "var(--text)",
                }}>
                  {cat.name}
                  <span style={{ color: cat.accent, marginLeft: 4 }}>.</span>
                </h2>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 13, color: "var(--overlay1)",
                  marginLeft: "auto",
                }}>
                  {items.length} {items.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <div style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 13, color: "var(--subtext0)",
                marginBottom: 22, maxWidth: 680,
              }}>
                <span style={{color:"var(--overlay0)"}}>{"//"} </span>
                {cat.desc}
              </div>

              <div className="grid">
                {items.map((r, i) => (
                  <ProjectCard
                    key={r.name}
                    repo={r}
                    index={i}
                    accent={cat.accent}
                    onOpen={() => setSelected(r)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            padding: 120, textAlign: "center",
            color: "var(--overlay1)",
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}>
            <div style={{fontSize: 14, marginBottom: 10}}>no matches</div>
            <div style={{fontSize: 12, color: "var(--overlay0)"}}>try a different filter or clear the search</div>
          </div>
        )}

        <div style={{
          marginTop: 60, paddingTop: 28, textAlign: "center",
          borderTop: "1px solid var(--surface0)",
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 11, color: "var(--overlay0)",
        }}>
          — <a href="https://github.com/Real-Fruit-Snacks" target="_blank" style={{color:"var(--overlay1)"}}>github.com/Real-Fruit-Snacks</a> —
        </div>
      </main>

      {selected && (
        <ProjectDrawer
          repo={selected}
          features={features[selected.name] || []}
          accent={CATEGORIES.find(c => c.id === catByName[selected.category])?.accent}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

const ProjectCard = ({ repo, index, accent, onOpen }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="card card-enter"
      style={{ animationDelay: `${Math.min(index * 30, 400)}ms` }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* accent stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: accent,
        transform: hovered ? "scaleX(1)" : "scaleX(0.15)",
        transformOrigin: "left",
        transition: "transform .3s ease",
      }}/>

      <div style={{
        position: "absolute", top: 14, right: 16,
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 10, color: "var(--overlay0)", letterSpacing: 1,
      }}>
        {String(index+1).padStart(2,"0")}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
        fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
      }}>
        <span className={`lang-dot lang-${repo.lang}`} style={{width:10,height:10}}/>
        <span style={{
          fontSize: 18, fontWeight: 600, color: "var(--text)",
          letterSpacing: -0.3,
        }}>{repo.name}</span>
      </div>

      <div style={{
        color: "var(--subtext0)", fontSize: 13, lineHeight: 1.55,
        marginBottom: 14,
        display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {repo.desc}
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14,
      }}>
        {repo.topics.slice(0, 4).map(t => (
          <span key={t} style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 3,
            background: "color-mix(in oklab, var(--blue) 12%, transparent)",
            color: "var(--blue)",
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}>#{t}</span>
        ))}
        {repo.topics.length > 4 && (
          <span style={{
            fontSize: 10, padding: "2px 7px",
            color: "var(--overlay0)",
            fontFamily: 'ui-monospace, Menlo, monospace',
          }}>+{repo.topics.length - 4}</span>
        )}
      </div>

      <div style={{
        marginTop: "auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px dashed var(--surface1)",
        fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11,
      }}>
        <div style={{ display: "flex", gap: 12, color: "var(--overlay1)" }}>
          <span style={{display:"flex", alignItems:"center", gap:4}}>
            <span style={{color:"var(--yellow)"}}>★</span> {repo.stars}
          </span>
          <span style={{color:"var(--overlay0)"}}>{repo.lang}</span>
        </div>
        <span style={{
          color: hovered ? accent : "var(--overlay1)",
          transition: "color .2s",
        }}>
          {hovered ? "details →" : "→"}
        </span>
      </div>
    </div>
  );
};

const ProjectDrawer = ({ repo, features, accent, onClose }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "color-mix(in oklab, var(--crust) 75%, transparent)",
        backdropFilter: "blur(6px)",
        display: "flex", justifyContent: "flex-end",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="drawer"
        style={{
          width: "min(720px, 100vw)",
          height: "100%",
          background: "var(--base)",
          borderLeft: "1px solid var(--surface0)",
          overflow: "auto",
          animation: "slideIn .28s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {/* Drawer header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 2,
          background: "var(--mantle)",
          borderBottom: "1px solid var(--surface0)",
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12,
        }}>
          <span style={{color:"var(--overlay1)"}}>
            <span style={{color: accent, marginRight: 8}}>●</span>
            {repo.category.toLowerCase().replace(/ /g,"-")} /
            <span style={{color:"var(--text)"}}> {repo.name}</span>
          </span>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--surface1)",
            color: "var(--subtext0)", cursor: "pointer",
            padding: "4px 10px", borderRadius: 4,
            fontFamily: "inherit", fontSize: 11,
          }}>
            close · esc
          </button>
        </div>

        <div style={{ padding: "36px 40px 60px" }}>
          {/* Title */}
          <div style={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11, color: "var(--overlay1)",
            letterSpacing: 1, textTransform: "uppercase",
            marginBottom: 8,
          }}>
            {repo.lang} · {repo.license} · {repo.updated}
          </div>
          <h1 style={{
            fontSize: "clamp(34px, 5vw, 52px)",
            margin: "0 0 18px", fontWeight: 700,
            letterSpacing: -1.5, color: "var(--text)",
          }}>
            {repo.name}<span style={{color: accent}}>.</span>
          </h1>
          <p style={{
            fontSize: 16, lineHeight: 1.6,
            color: "var(--subtext0)", margin: "0 0 28px",
            maxWidth: 600,
          }}>
            {repo.desc}
          </p>

          {/* Topics */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 34,
          }}>
            {repo.topics.map(t => (
              <span key={t} className="topic">#{t}</span>
            ))}
          </div>

          {/* Features */}
          {features.length > 0 && (
            <>
              <h2 style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 12, color: "var(--overlay1)",
                letterSpacing: 1, textTransform: "uppercase",
                margin: "0 0 18px",
              }}>
                <span style={{color: accent}}>## </span>key features
              </h2>
              <ul style={{
                listStyle: "none", padding: 0, margin: "0 0 36px",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {features.map((f, i) => (
                  <li key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "12px 16px",
                    background: "var(--mantle)",
                    border: "1px solid var(--surface0)",
                    borderLeft: `2px solid ${accent}`,
                    borderRadius: 4,
                    fontSize: 14, lineHeight: 1.5,
                    color: "var(--subtext1)",
                  }}>
                    <span style={{
                      color: accent, fontFamily: 'ui-monospace, Menlo, monospace',
                      fontSize: 12, marginTop: 2, flexShrink: 0,
                    }}>{String(i+1).padStart(2,"0")}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Install */}
          <h2 style={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 12, color: "var(--overlay1)",
            letterSpacing: 1, textTransform: "uppercase",
            margin: "0 0 14px",
          }}>
            <span style={{color: accent}}>## </span>clone
          </h2>
          <pre style={{
            background: "var(--mantle)",
            border: "1px solid var(--surface0)",
            borderLeft: `3px solid var(--green)`,
            padding: "14px 18px", borderRadius: 4,
            fontSize: 13, color: "var(--text)", margin: "0 0 30px",
            fontFamily: 'ui-monospace, Menlo, monospace',
            whiteSpace: "pre-wrap", wordBreak: "break-all",
          }}>
<span style={{color:"var(--overlay0)"}}>$</span> <span style={{color:"var(--green)"}}>git clone</span> <span style={{color:"var(--sky)"}}>{repo.url}</span>
          </pre>

          <a href={repo.url} target="_blank" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 20px", borderRadius: 6,
            background: accent, color: "var(--crust)",
            textDecoration: "none", fontWeight: 600,
            fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13,
          }}>
            open on github →
          </a>
        </div>
      </div>
    </div>
  );
};

window.Dossier = Dossier;
