import { useState, useEffect } from "react";

const C = {
  primary: "#9D5C7A", primaryLight: "#C48BAA", primaryBg: "#F9F0F5",
  positive: "#52B788", positiveBg: "#EAF7F1",
  accent: "#E8A920", accentBg: "#FEF7E4",
  danger: "#E05C5C", dangerBg: "#FEF0F0",
  bg: "#FDF8F9", card: "#FFFFFF",
  text: "#2D2340", muted: "#8B7D96", border: "#EDE0EB",
};

const HABITS = [
  { id: "air", label: "Minum 2.5L Air", icon: "💧" },
  { id: "olahraga", label: "Olahraga", icon: "🏃‍♀️" },
  { id: "noGorengManis", label: "No Gorengan & Manis", icon: "🚫" },
  { id: "skincare", label: "Skincare", icon: "✨" },
  { id: "guasha", label: "Gua Sha / Face Yoga", icon: "💆‍♀️" },
  { id: "mandi2x", label: "Mandi 2x", icon: "🚿" },
  { id: "ngaji", label: "Ngaji", icon: "📖" },
  { id: "study", label: "Belajar/Study", icon: "📚" },
  { id: "tidur7", label: "Tidur min 7 Jam", icon: "😴" },
  { id: "stopMakan3Jam", label: "Stop Makan 3 Jam Sebelum Tidur", icon: "🕙" },
];

const EXERCISE = {
  0: { label: "Full Rest", note: "Mental Health: Cegah burnout!", e: "😴" },
  1: { label: "Mat Pilates (Lower Body)", note: "Toning: Rampingkan paha & betis.", e: "🧘‍♀️" },
  2: { label: "Rest & Walk", note: "Recovery: Otot pulih, lemak terbakar.", e: "🚶‍♀️" },
  3: { label: "HIIT Low Impact", note: "Fat Burn: Metabolisme naik 24 jam.", e: "🔥" },
  4: { label: "Rest & Walk", note: "Anti-Cortisol: Kurangi stres & bengkak.", e: "🚶‍♀️" },
  5: { label: "Leg Slimming (Pilates)", note: "Targeting: Otot paha dalam kencang.", e: "💪" },
  6: { label: "Stretching & Face Yoga", note: "Drainage: Buang cairan di pipi.", e: "🌸" },
};

const ECATS = [
  { id: "makan",   label: "Makan Pokok",       budget: 450000 },
  { id: "warkop",  label: "Warkop & Cafe",      budget: 120000 },
  { id: "transpor",label: "Transpor & Data",    budget: 230000 },
  { id: "wants",   label: "Wants & Lain-lain",  budget: 100000 },
  { id: "kuliah",  label: "Kebutuhan Kuliah",   budget: 50000  },
  { id: "kesehatan",label:"Kesehatan/Beauty",   budget: 50000  },
];

const ISRC = ["MAMA", "Beasiswa/YVDMI", "Bu Rina", "Lainnya"];
const KEYS = { h: "wuli_h", e: "wuli_e", j: "wuli_j", w: "wuli_w" };
const MNAMES      = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MNAMES_LONG = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DOW         = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

const todayStr  = () => new Date().toISOString().slice(0, 10);
const monthStr  = () => new Date().toISOString().slice(0, 7);
const yearStr   = () => String(new Date().getFullYear());
const fmtRp     = (n) => `Rp${Math.round(Number(n) || 0).toLocaleString("id-ID")}`;
const fmtDate   = (d) => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
const fmtDateS  = (d) => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const fmtMonth  = (m) => new Date(m + "-01T00:00:00").toLocaleDateString("id-ID", { month: "long", year: "numeric" });
const dimOf     = (ym) => { const [y,m] = ym.split("-").map(Number); return new Date(y, m, 0).getDate(); };

const prevDay   = (d) => { const dt = new Date(d+"T00:00:00"); dt.setDate(dt.getDate()-1); return dt.toISOString().slice(0,10); };
const nextDay   = (d) => { const dt = new Date(d+"T00:00:00"); dt.setDate(dt.getDate()+1); return dt.toISOString().slice(0,10); };
const prevMonth = (m) => { const [y,mo] = m.split("-").map(Number); return mo===1?`${y-1}-12`:`${y}-${String(mo-1).padStart(2,"0")}`; };
const nextMonth = (m) => { const [y,mo] = m.split("-").map(Number); return mo===12?`${y+1}-01`:`${y}-${String(mo+1).padStart(2,"0")}`; };

/* ─── Shared UI helpers ──────────────────────────────────────────────────── */
function Ring({ pct, size=100, stroke=9, color }) {
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ - (Math.min(pct,100)/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", display:"block", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color||C.primary} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 0.5s ease" }}/>
    </svg>
  );
}

function Overlay({ onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
      <div style={{ background:"#fff", borderRadius:20, padding:"20px 18px", width:"100%", maxWidth:320, position:"relative", zIndex:1 }}>
        {children}
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, children }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width:34, height:34, borderRadius:"50%", border:"none", flexShrink:0,
      background: disabled ? "transparent" : C.bg,
      cursor: disabled ? "default" : "pointer",
      fontSize:20, color: disabled ? C.border : C.text,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>{children}</button>
  );
}

/* ─── Calendar Popup ─────────────────────────────────────────────────────── */
function CalendarPopup({ mode, period, onSelect, onClose }) {
  const today = todayStr(), thisMonth = monthStr(), thisYear = yearStr();

  const [navMonth, setNavMonth]   = useState(mode==="day" ? period.slice(0,7) : thisMonth);
  const [navYear,  setNavYear]    = useState(mode==="month" ? period.slice(0,4) : (mode==="year" ? period : thisYear));
  const [decStart, setDecStart]   = useState(Math.floor(Number(mode==="year"?period:thisYear)/10)*10);

  const jumpToday = () => { onSelect(mode==="day"?today:mode==="month"?thisMonth:thisYear); onClose(); };

  /* Day mode ── month grid */
  if (mode === "day") {
    const [y, m] = navMonth.split("-").map(Number);
    // Monday-first: getDay() returns 0=Sun … adjust to Mon=0
    const rawDow = new Date(y, m-1, 1).getDay();
    const firstDow = (rawDow + 6) % 7; // Mon=0 … Sun=6
    const dim = new Date(y, m, 0).getDate();
    const cells = [...Array(firstDow).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
    while (cells.length % 7 !== 0) cells.push(null);
    const canNext = navMonth < thisMonth;

    return (
      <Overlay onClose={onClose}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          <NavBtn onClick={() => setNavMonth(prevMonth(navMonth))}>‹</NavBtn>
          <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:C.text }}>{fmtMonth(navMonth)}</div>
          <NavBtn onClick={() => canNext && setNavMonth(nextMonth(navMonth))} disabled={!canNext}>›</NavBtn>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:4 }}>
          {DOW.map(d => (
            <div key={d} style={{ textAlign:"center", fontSize:10, color:C.muted, padding:"3px 0", fontWeight:600 }}>{d}</div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i}/>;
            const dk = `${navMonth}-${String(d).padStart(2,"0")}`;
            const isSel    = dk === period;
            const isFuture = dk > today;
            const isTd     = dk === today;
            return (
              <button key={dk} disabled={isFuture} onClick={() => { onSelect(dk); onClose(); }} style={{
                padding:"7px 2px", borderRadius:8, border:"none",
                cursor: isFuture ? "default" : "pointer",
                background: isSel ? C.primary : isTd ? C.primaryBg : "transparent",
                color: isSel ? "#fff" : isFuture ? C.border : isTd ? C.primary : C.text,
                fontSize:13, fontWeight: isSel||isTd ? 700 : 400,
              }}>{d}</button>
            );
          })}
        </div>

        <button onClick={jumpToday} style={{ marginTop:14, width:"100%", padding:"10px", borderRadius:10, border:`1.5px solid ${C.primary}`, background:"transparent", color:C.primary, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          Hari Ini
        </button>
      </Overlay>
    );
  }

  /* Month mode ── 12-month grid */
  if (mode === "month") {
    const canNext = navYear < thisYear;
    return (
      <Overlay onClose={onClose}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          <NavBtn onClick={() => setNavYear(String(Number(navYear)-1))}>‹</NavBtn>
          <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:C.text }}>{navYear}</div>
          <NavBtn onClick={() => canNext && setNavYear(String(Number(navYear)+1))} disabled={!canNext}>›</NavBtn>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
          {MNAMES.map((mn, i) => {
            const mk = `${navYear}-${String(i+1).padStart(2,"0")}`;
            const isSel    = mk === period;
            const isFuture = mk > thisMonth;
            return (
              <button key={mk} disabled={isFuture} onClick={() => { onSelect(mk); onClose(); }} style={{
                padding:"11px 4px", borderRadius:10, border:"none",
                cursor: isFuture ? "default" : "pointer",
                background: isSel ? C.primary : "transparent",
                color: isSel ? "#fff" : isFuture ? C.border : C.text,
                fontSize:13, fontWeight: isSel ? 700 : 400,
              }}>{mn}</button>
            );
          })}
        </div>

        <button onClick={jumpToday} style={{ marginTop:14, width:"100%", padding:"10px", borderRadius:10, border:`1.5px solid ${C.primary}`, background:"transparent", color:C.primary, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          Bulan Ini
        </button>
      </Overlay>
    );
  }

  /* Year mode ── decade grid */
  const years = Array.from({length:10}, (_,i) => decStart+i);
  const canNext = decStart+10 <= Number(thisYear);
  return (
    <Overlay onClose={onClose}>
      <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
        <NavBtn onClick={() => setDecStart(d => d-10)}>‹</NavBtn>
        <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:C.text }}>{decStart}–{decStart+9}</div>
        <NavBtn onClick={() => canNext && setDecStart(d => d+10)} disabled={!canNext}>›</NavBtn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
        {years.map(y => {
          const ys      = String(y);
          const isSel    = ys === period;
          const isFuture = y > Number(thisYear);
          return (
            <button key={ys} disabled={isFuture} onClick={() => { onSelect(ys); onClose(); }} style={{
              padding:"11px 2px", borderRadius:10, border:"none",
              cursor: isFuture ? "default" : "pointer",
              background: isSel ? C.primary : "transparent",
              color: isSel ? "#fff" : isFuture ? C.border : C.text,
              fontSize:13, fontWeight: isSel ? 700 : 400,
            }}>{y}</button>
          );
        })}
      </div>

      <button onClick={jumpToday} style={{ marginTop:14, width:"100%", padding:"10px", borderRadius:10, border:`1.5px solid ${C.primary}`, background:"transparent", color:C.primary, fontWeight:700, fontSize:13, cursor:"pointer" }}>
        Tahun Ini
      </button>
    </Overlay>
  );
}

/* ─── Period Nav bar (shared across tabs) ────────────────────────────────── */
function PeriodNav({ mode, onModeChange, period, onPeriodChange }) {
  const [showCal, setShowCal] = useState(false);
  const today = todayStr(), thisMonth = monthStr(), thisYear = yearStr();
  const atMax = mode==="day" ? period>=today : mode==="month" ? period>=thisMonth : period>=thisYear;

  const label = mode==="day" ? fmtDateS(period) : mode==="month" ? fmtMonth(period) : `Tahun ${period}`;
  const doPrev = () => onPeriodChange(mode==="day" ? prevDay(period) : mode==="month" ? prevMonth(period) : String(Number(period)-1));
  const doNext = () => { if (!atMax) onPeriodChange(mode==="day" ? nextDay(period) : mode==="month" ? nextMonth(period) : String(Number(period)+1)); };

  const handleModeBtn = (m) => {
    onModeChange(m);
    onPeriodChange(m==="day" ? today : m==="month" ? thisMonth : thisYear);
  };

  return (
    <>
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}` }}>
        {/* Mode selector */}
        <div style={{ display:"flex", gap:4, padding:"8px 12px 0" }}>
          {[["day","Hari"],["month","Bulan"],["year","Tahun"]].map(([m,lbl]) => (
            <button key={m} onClick={() => handleModeBtn(m)} style={{
              flex:1, padding:"6px 0", borderRadius:8, border:"none", cursor:"pointer",
              background: mode===m ? C.primary : "transparent",
              color: mode===m ? "#fff" : C.muted, fontWeight:600, fontSize:12,
            }}>{lbl}</button>
          ))}
        </div>

        {/* Prev / Date label (tap to open calendar) / Next */}
        <div style={{ display:"flex", alignItems:"center", padding:"6px 8px 10px", gap:4 }}>
          <button onClick={doPrev} style={{ width:34, height:34, borderRadius:"50%", border:"none", background:C.bg, cursor:"pointer", fontSize:20, color:C.text, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>‹</button>

          <button onClick={() => setShowCal(true)} style={{
            flex:1, border:"none", background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"4px 0",
          }}>
            <span style={{ fontSize:14 }}>📅</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</span>
          </button>

          <button onClick={doNext} disabled={atMax} style={{ width:34, height:34, borderRadius:"50%", border:"none", background: atMax?"transparent":C.bg, cursor: atMax?"default":"pointer", fontSize:20, color: atMax?C.border:C.text, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>›</button>
        </div>
      </div>

      {showCal && (
        <CalendarPopup mode={mode} period={period} onSelect={onPeriodChange} onClose={() => setShowCal(false)} />
      )}
    </>
  );
}

/* ─── usePeriod hook ─────────────────────────────────────────────────────── */
function usePeriod(defaultMode="day") {
  const [mode,   setMode]   = useState(defaultMode);
  const [period, setPeriod] = useState(defaultMode==="day"?todayStr():defaultMode==="month"?monthStr():yearStr());
  const handleModeChange = (m) => {
    setMode(m);
    setPeriod(m==="day"?todayStr():m==="month"?monthStr():yearStr());
  };
  return { mode, period, setPeriod, handleModeChange };
}

/* ─── App root ───────────────────────────────────────────────────────────── */
export default function App() {
  const [tab,      setTab]      = useState("today");
  const [habits,   setHabits]   = useState({});
  const [expenses, setExpenses] = useState([]);
  const [journal,  setJournal]  = useState({});
  const [wishlist, setWishlist] = useState({ kebutuhan:[], mauBeli:[], selfReward:[] });
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    for (const [k, sk] of [[setHabits,KEYS.h],[setExpenses,KEYS.e],[setJournal,KEYS.j],[setWishlist,KEYS.w]]) {
      try { const r = localStorage.getItem(sk); if (r) k(JSON.parse(r)); } catch {}
    }
    setReady(true);
  }, []);

  const persist = (sk, data, setter) => {
    setter(data);
    try { localStorage.setItem(sk, JSON.stringify(data)); } catch {}
  };

  const sh = (d) => persist(KEYS.h, d, setHabits);
  const se = (d) => persist(KEYS.e, d, setExpenses);
  const sj = (d) => persist(KEYS.j, d, setJournal);
  const sw = (d) => persist(KEYS.w, d, setWishlist);

  const TABS = [
    { id:"today",   label:"Hari Ini", icon:"☀️" },
    { id:"duit",    label:"Duit",     icon:"💰" },
    { id:"jurnal",  label:"Jurnal",   icon:"📝" },
    { id:"wishlist",label:"List",     icon:"⭐" },
  ];

  if (!ready) return (
    <div style={{ height:"100svh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, color:C.primary, fontSize:16 }}>
      Memuat data...
    </div>
  );

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100svh", background:C.bg, position:"relative" }}>
      <div style={{ paddingBottom:"calc(64px + env(safe-area-inset-bottom, 0px))" }}>
        {tab==="today"    && <TodayTab   habits={habits}   save={sh} expenses={expenses} journal={journal}/>}
        {tab==="duit"     && <DuitTab    expenses={expenses} save={se}/>}
        {tab==="jurnal"   && <JurnalTab  journal={journal} save={sj} habits={habits}/>}
        {tab==="wishlist" && <WishlistTab wishlist={wishlist} save={sw}/>}
      </div>
      <nav style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430, background:"#fff", borderTop:`1px solid ${C.border}`,
        display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom, 0px)",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, border:"none", background:"none", padding:"10px 0 8px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            color: tab===t.id ? C.primary : C.muted,
            fontSize:11, fontWeight: tab===t.id ? 700 : 400, cursor:"pointer",
          }}>
            <span style={{ fontSize:21 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── TAB: HARI INI ─────────────────────────────────────────────────────── */
function TodayTab({ habits, save, expenses, journal }) {
  const { mode, period, setPeriod, handleModeChange } = usePeriod("day");
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 24px)";
  const isToday = mode==="day" && period===todayStr();

  const toggle = (id) => {
    if (!isToday) return;
    const th = habits[period] || {};
    save({ ...habits, [period]: { ...th, [id]: !th[id] } });
  };

  /* Day view */
  if (mode === "day") {
    const th    = habits[period] || {};
    const done  = HABITS.filter(h => th[h.id]).length;
    const pct   = Math.round((done/HABITS.length)*100);
    const spend = expenses.filter(e => e.date===period && e.type==="expense").reduce((s,e)=>s+Number(e.amount),0);
    const rating= journal[period]?.rating;
    const ex    = EXERCISE[new Date(period+"T00:00:00").getDay()];
    const vibe  = pct===100?"Perfect day! 🎉":pct>=70?"Hampir full, dikit lagi! 💪":pct>=40?"Semangat terus! ✨":"Yuk mulai hari ini! 🌸";

    return (
      <div>
        <div style={{ background:C.primary, paddingTop:safeTop, paddingRight:20, paddingBottom:20, paddingLeft:20, color:"#fff" }}>
          <div style={{ fontSize:12, opacity:0.75 }}>{fmtDate(period)}</div>
          <div style={{ fontSize:20, fontWeight:700, marginTop:2 }}>{isToday?"Hai, Wuli! 👋":"Catatan Hari Itu"}</div>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:16 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <Ring pct={pct} size={96} stroke={9} color="#F4C430"/>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:20, fontWeight:800 }}>{pct}%</div>
                <div style={{ fontSize:10, opacity:0.8 }}>{done}/{HABITS.length}</div>
              </div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{vibe}</div>
              <div style={{ marginTop:8, display:"flex", gap:6 }}>
                <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"7px 10px", flex:1, minWidth:0 }}>
                  <div style={{ fontSize:10, opacity:0.75 }}>Pengeluaran</div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{fmtRp(spend)}</div>
                </div>
                {rating && (
                  <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"7px 10px", flexShrink:0 }}>
                    <div style={{ fontSize:10, opacity:0.75 }}>Rating</div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{rating}/10</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>

        {isToday && (
          <div style={{ margin:"12px 14px 0", background:"#fff", borderRadius:14, padding:"12px 14px", borderLeft:`4px solid ${C.primary}` }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.8 }}>Olahraga Hari Ini</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginTop:4 }}>{ex.e} {ex.label}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{ex.note}</div>
          </div>
        )}

        <div style={{ padding:"12px 14px 0" }}>
          {!isToday && <div style={{ fontSize:12, color:C.muted, textAlign:"center", marginBottom:8 }}>Hanya hari ini yang bisa diedit</div>}
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Habit Checklist</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {HABITS.map(h => {
              const isDone = !!th[h.id];
              return (
                <div key={h.id} onClick={() => toggle(h.id)} style={{
                  background: isDone?C.positiveBg:"#fff", border:`1.5px solid ${isDone?C.positive:C.border}`,
                  borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:10,
                  cursor: isToday?"pointer":"default",
                }}>
                  <div style={{ width:21, height:21, borderRadius:"50%", flexShrink:0, background:isDone?C.positive:"transparent", border:`2px solid ${isDone?C.positive:C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {isDone && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:18 }}>{h.icon}</span>
                  <span style={{ fontSize:13, fontWeight:isDone?600:400, color:isDone?C.positive:C.text, flex:1 }}>{h.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ height:16 }}/>
        </div>
      </div>
    );
  }

  /* Month view */
  if (mode === "month") {
    const days = Array.from({ length:dimOf(period) }, (_,i) => {
      const dk = `${period}-${String(i+1).padStart(2,"0")}`;
      const h  = habits[dk] || {};
      const dn = HABITS.filter(hb => h[hb.id]).length;
      return { dk, done:dn, pct:Math.round((dn/HABITS.length)*100), rating:journal[dk]?.rating };
    });
    return (
      <div>
        <div style={{ background:C.primary, paddingTop:safeTop, paddingRight:20, paddingBottom:20, paddingLeft:20, color:"#fff" }}>
          <div style={{ fontSize:20, fontWeight:700 }}>Habits Bulanan 📅</div>
        </div>
        <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>
        <div style={{ padding:"12px 14px 0" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {days.map(({ dk, done, pct, rating }) => {
              const d = new Date(dk+"T00:00:00");
              return (
                <div key={dk} style={{ background:"#fff", borderRadius:12, padding:"9px 14px", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:50, fontSize:11, color:C.muted, flexShrink:0 }}>
                    {d.toLocaleDateString("id-ID",{ weekday:"short", day:"numeric" })}
                  </div>
                  <div style={{ flex:1, height:6, background:C.border, borderRadius:99 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:pct===100?C.positive:C.primary, borderRadius:99 }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text, width:30, textAlign:"right" }}>{done}/{HABITS.length}</div>
                  {rating ? <div style={{ fontSize:11, color:C.accent, width:20, textAlign:"right" }}>{rating}★</div> : <div style={{ width:20 }}/>}
                </div>
              );
            })}
          </div>
          <div style={{ height:16 }}/>
        </div>
      </div>
    );
  }

  /* Year view */
  const months = Array.from({ length:12 }, (_,i) => {
    const mk  = `${period}-${String(i+1).padStart(2,"0")}`;
    const dim = dimOf(mk);
    let total = 0;
    for (let d=1; d<=dim; d++) total += HABITS.filter(hb => (habits[`${mk}-${String(d).padStart(2,"0")}`]||{})[hb.id]).length;
    const possible = dim * HABITS.length;
    return { mk, pct: possible ? Math.round((total/possible)*100) : 0 };
  });
  return (
    <div>
      <div style={{ background:C.primary, paddingTop:safeTop, paddingRight:20, paddingBottom:20, paddingLeft:20, color:"#fff" }}>
        <div style={{ fontSize:20, fontWeight:700 }}>Habits Tahunan 📊</div>
      </div>
      <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {months.map(({ mk, pct }, i) => (
            <div key={mk} style={{ background:"#fff", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{MNAMES[i]}</div>
              <div style={{ position:"relative", display:"inline-block" }}>
                <Ring pct={pct} size={46} stroke={5} color={pct>=70?C.positive:C.primary}/>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:C.text }}>{pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TAB: DUIT ─────────────────────────────────────────────────────────── */
function DuitTab({ expenses, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type:"expense", amount:"", category:"makan", note:"", source:"MAMA" });
  const { mode, period, setPeriod, handleModeChange } = usePeriod("month");
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 24px)";
  const tk = todayStr();

  const byPeriod = (type) => expenses.filter(e =>
    (mode==="day" ? e.date===period : e.date.startsWith(period)) && e.type===type
  );
  const mExp = byPeriod("expense"), mInc = byPeriod("income");
  const totalOut = mExp.reduce((s,e)=>s+Number(e.amount),0);
  const totalIn  = mInc.reduce((s,e)=>s+Number(e.amount),0);
  const catSpend = (cid) => mExp.filter(e=>e.category===cid).reduce((s,e)=>s+Number(e.amount),0);
  const srcTotal = (src) => mInc.filter(e=>e.category===src).reduce((s,e)=>s+Number(e.amount),0);

  const addEntry = () => {
    if (!form.amount) return;
    const entry = { id:Date.now(), date:tk, type:form.type,
      amount: Number(String(form.amount).replace(/[^0-9]/g,"")),
      category: form.type==="expense" ? form.category : form.source, note:form.note };
    save([entry,...expenses]);
    setForm({ type:"expense", amount:"", category:"makan", note:"", source:"MAMA" });
    setShowAdd(false);
  };

  const yearMonthly = mode==="year" ? Array.from({ length:12 }, (_,i) => {
    const mk  = `${period}-${String(i+1).padStart(2,"0")}`;
    const inc = expenses.filter(e=>e.date.startsWith(mk)&&e.type==="income").reduce((s,e)=>s+Number(e.amount),0);
    const exp = expenses.filter(e=>e.date.startsWith(mk)&&e.type==="expense").reduce((s,e)=>s+Number(e.amount),0);
    return { mk, inc, exp };
  }) : null;

  const txList = [...mExp,...mInc].sort((a,b)=>b.id-a.id);

  return (
    <div>
      <div style={{ background:"#2D2340", paddingTop:safeTop, paddingRight:20, paddingBottom:18, paddingLeft:20, color:"#fff" }}>
        <div style={{ fontSize:13, opacity:0.6 }}>Laporan Keuangan 💰</div>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          {[
            { label:"Pemasukan",  val:totalIn,          color:C.positive },
            { label:"Pengeluaran",val:totalOut,          color:"#E05C5C"  },
            { label:"Saldo",      val:totalIn-totalOut,  color:totalIn-totalOut>=0?"#F4C430":"#E05C5C" },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 8px", minWidth:0 }}>
              <div style={{ fontSize:10, opacity:0.65 }}>{s.label}</div>
              <div style={{ fontSize:11, fontWeight:700, color:s.color, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{fmtRp(s.val)}</div>
            </div>
          ))}
        </div>
      </div>

      <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>

      {/* Income by source */}
      <div style={{ padding:"12px 14px 0" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Pemasukan per Sumber</div>
        <div style={{ background:"#fff", borderRadius:12, overflow:"hidden" }}>
          {ISRC.map((src,i) => {
            const amt = srcTotal(src);
            return (
              <div key={src} style={{ padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:i>0?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:13, color:C.text }}>{src}</span>
                <span style={{ fontSize:13, fontWeight:700, color:amt>0?C.positive:C.muted }}>{fmtRp(amt)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year: monthly table */}
      {mode==="year" && yearMonthly && (
        <div style={{ padding:"12px 14px 0" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Ringkasan per Bulan</div>
          <div style={{ background:"#fff", borderRadius:12, overflow:"hidden" }}>
            <div style={{ display:"flex", padding:"8px 14px", borderBottom:`1px solid ${C.border}` }}>
              {["Bln","Masuk","Keluar","Saldo"].map((h,i) => (
                <span key={h} style={{ flex:i===0?"0 0 34px":1, fontSize:10, fontWeight:700, color:C.muted, textAlign:i>0?"right":"left" }}>{h}</span>
              ))}
            </div>
            {yearMonthly.map(({ mk, inc, exp }, i) => {
              const saldo = inc-exp;
              return (
                <div key={mk} style={{ display:"flex", alignItems:"center", padding:"9px 14px", borderTop:i>0?`1px solid ${C.border}`:"none" }}>
                  <span style={{ flex:"0 0 34px", fontSize:12, fontWeight:600, color:C.text }}>{MNAMES[i]}</span>
                  <span style={{ flex:1, fontSize:11, color:C.positive, textAlign:"right" }}>{fmtRp(inc)}</span>
                  <span style={{ flex:1, fontSize:11, color:C.danger,   textAlign:"right" }}>{fmtRp(exp)}</span>
                  <span style={{ flex:1, fontSize:11, fontWeight:700, color:saldo>=0?C.positive:C.danger, textAlign:"right" }}>{fmtRp(saldo)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget bars */}
      {mode!=="year" && (
        <div style={{ padding:"12px 14px 0" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Budget Kategori</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {ECATS.map(cat => {
              const spent = catSpend(cat.id);
              const pct   = Math.min(Math.round((spent/cat.budget)*100),100);
              const over  = spent > cat.budget;
              return (
                <div key={cat.id} style={{ background:"#fff", borderRadius:12, padding:"11px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, gap:8 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.text, flex:1 }}>{cat.label}</span>
                    <span style={{ fontSize:11, color:over?C.danger:C.muted, flexShrink:0 }}>{fmtRp(spent)}/{fmtRp(cat.budget)}</span>
                  </div>
                  <div style={{ height:5, background:C.border, borderRadius:99 }}>
                    <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:over?C.danger:C.primary }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div style={{ padding:"12px 14px 0" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Riwayat Transaksi</div>
        {txList.length===0
          ? <div style={{ background:"#fff", borderRadius:12, padding:"18px", textAlign:"center", color:C.muted, fontSize:14 }}>Belum ada catatan.</div>
          : (
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {txList.map(e => (
                <div key={e.id} style={{ background:"#fff", borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{e.type==="income"?"📥":"💸"}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.note||e.category}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{e.category} · {e.date}</div>
                  </div>
                  <div style={{ flexShrink:0, textAlign:"right" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:e.type==="income"?C.positive:C.danger }}>
                      {e.type==="income"?"+":"-"}{fmtRp(e.amount)}
                    </div>
                    <button onClick={() => save(expenses.filter(x=>x.id!==e.id))} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0, display:"block", marginLeft:"auto" }}>hapus</button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        <div style={{ height:80 }}/>
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{
        position:"fixed", bottom:"calc(72px + env(safe-area-inset-bottom, 0px))", right:16,
        width:52, height:52, borderRadius:"50%", background:C.primary, color:"#fff", border:"none",
        fontSize:28, cursor:"pointer", boxShadow:"0 4px 16px rgba(157,92,122,0.35)",
        display:"flex", alignItems:"center", justifyContent:"center", zIndex:50,
      }}>+</button>

      {/* Add transaction sheet */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={() => setShowAdd(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }}/>
          <div style={{ background:"#fff", borderRadius:"22px 22px 0 0", padding:`22px 20px calc(36px + env(safe-area-inset-bottom, 0px))`, width:"100%", maxWidth:430, position:"relative", zIndex:1 }}>
            <div style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:16 }}>Catat Transaksi</div>
            <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:4, marginBottom:14 }}>
              {["expense","income"].map(t => (
                <button key={t} onClick={() => setForm(f=>({...f,type:t}))} style={{
                  flex:1, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer",
                  background: form.type===t?(t==="income"?C.positive:C.danger):"transparent",
                  color: form.type===t?"#fff":C.muted, fontWeight:600, fontSize:13,
                }}>{t==="expense"?"Pengeluaran":"Pemasukan"}</button>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>Nominal</label>
              <input type="number" inputMode="numeric" placeholder="0" value={form.amount}
                onChange={e => setForm(f=>({...f,amount:e.target.value}))}
                style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:22, fontWeight:700, color:"#1A1A2E", background:"#FFFFFF", boxSizing:"border-box", outline:"none" }}
              />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:6 }}>{form.type==="expense"?"Kategori":"Sumber"}</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(form.type==="expense"?ECATS.map(c=>({id:c.id,label:c.label})):ISRC.map(s=>({id:s,label:s}))).map(opt => {
                  const isActive = (form.type==="expense"?form.category:form.source)===opt.id;
                  return (
                    <button key={opt.id} onClick={() => setForm(f=>({...f,[form.type==="expense"?"category":"source"]:opt.id}))} style={{
                      padding:"6px 12px", borderRadius:20, border:`1.5px solid ${isActive?C.primary:C.border}`,
                      background:isActive?C.primaryBg:"#fff", color:isActive?C.primary:C.muted, fontSize:12, fontWeight:600, cursor:"pointer",
                    }}>{opt.label}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>Keterangan</label>
              <input type="text" placeholder="Contoh: makan siang, kopi, dll" value={form.note}
                onChange={e => setForm(f=>({...f,note:e.target.value}))}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, color:"#1A1A2E", background:"#FFFFFF", boxSizing:"border-box", outline:"none" }}
              />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, padding:14, borderRadius:12, border:`1.5px solid ${C.border}`, background:"#fff", color:C.muted, fontWeight:600, cursor:"pointer", fontSize:14 }}>Batal</button>
              <button onClick={addEntry} style={{ flex:2, padding:14, borderRadius:12, border:"none", background:form.type==="income"?C.positive:C.primary, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── TAB: JURNAL ───────────────────────────────────────────────────────── */
function JurnalTab({ journal, save, habits }) {
  const { mode, period, setPeriod, handleModeChange } = usePeriod("day");
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 24px)";

  const [draft, setDraft] = useState(() => journal[todayStr()] || { olahraga:"", makan:"", study:"", catatan:"", rating:7 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mode === "day") {
      setDraft(journal[period] || { olahraga:"", makan:"", study:"", catatan:"", rating:7 });
      setSaved(false);
    }
  }, [period, mode]);

  const upd = (f, v) => setDraft(d => ({ ...d, [f]:v }));
  const doSave = () => {
    save({ ...journal, [period]:draft });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  /* Month view */
  if (mode === "month") {
    const dim = dimOf(period);
    const entries = [];
    for (let d=dim; d>=1; d--) {
      const dk = `${period}-${String(d).padStart(2,"0")}`;
      if (journal[dk]) entries.push({ dk, j:journal[dk] });
    }
    return (
      <div>
        <div style={{ background:C.positive, paddingTop:safeTop, paddingRight:20, paddingBottom:18, paddingLeft:20, color:"#fff" }}>
          <div style={{ fontSize:20, fontWeight:700 }}>Jurnal Bulanan 📅</div>
        </div>
        <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>
        <div style={{ padding:"12px 14px 0" }}>
          {entries.length===0
            ? <div style={{ background:"#fff", borderRadius:12, padding:"20px", textAlign:"center", color:C.muted, fontSize:14 }}>Belum ada jurnal bulan ini.</div>
            : entries.map(({ dk, j }) => (
              <div key={dk} style={{ background:"#fff", borderRadius:14, padding:"13px 16px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmtDate(dk)}</span>
                  {j.rating && <span style={{ fontSize:13, fontWeight:700, color:C.primary }}>{j.rating}/10 ⭐</span>}
                </div>
                {j.olahraga && <div style={{ fontSize:12, color:C.muted, marginBottom:3 }}>🏃‍♀️ {j.olahraga}</div>}
                {j.makan    && <div style={{ fontSize:12, color:C.muted, marginBottom:3 }}>🍽️ {j.makan}</div>}
                {j.study    && <div style={{ fontSize:12, color:C.muted, marginBottom:3 }}>📚 {j.study}</div>}
                {j.catatan  && <div style={{ fontSize:12, color:C.muted }}>💭 {j.catatan}</div>}
              </div>
            ))
          }
          <div style={{ height:16 }}/>
        </div>
      </div>
    );
  }

  /* Year view */
  if (mode === "year") {
    const months = Array.from({ length:12 }, (_,i) => {
      const mk  = `${period}-${String(i+1).padStart(2,"0")}`;
      const dim = dimOf(mk);
      let count=0, rSum=0, rCnt=0;
      for (let d=1; d<=dim; d++) {
        const dk = `${mk}-${String(d).padStart(2,"0")}`;
        if (journal[dk]) { count++; if (journal[dk].rating) { rSum+=journal[dk].rating; rCnt++; } }
      }
      return { mk, count, avg: rCnt ? (rSum/rCnt).toFixed(1) : null };
    });
    return (
      <div>
        <div style={{ background:C.positive, paddingTop:safeTop, paddingRight:20, paddingBottom:18, paddingLeft:20, color:"#fff" }}>
          <div style={{ fontSize:20, fontWeight:700 }}>Jurnal Tahunan 📊</div>
        </div>
        <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>
        <div style={{ padding:"12px 14px" }}>
          <div style={{ background:"#fff", borderRadius:12, overflow:"hidden" }}>
            {months.map(({ mk, count, avg }, i) => (
              <div key={mk} style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:10, borderTop:i>0?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:13, color:C.text, width:80, flexShrink:0 }}>{MNAMES_LONG[i]}</span>
                <span style={{ fontSize:13, fontWeight:600, color:count>0?C.primary:C.border, flex:1 }}>{count} jurnal</span>
                {avg && <span style={{ fontSize:12, color:C.accent }}>avg {avg} ★</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Day view */
  const doneBadges = HABITS.filter(h => (habits[period]||{})[h.id]).map(h => h.icon);
  return (
    <div>
      <div style={{ background:C.positive, paddingTop:safeTop, paddingRight:20, paddingBottom:18, paddingLeft:20, color:"#fff" }}>
        <div style={{ fontSize:20, fontWeight:700 }}>Jurnal Harian 📝</div>
        {doneBadges.length>0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:10 }}>
            {doneBadges.map((icon,i) => <span key={i} style={{ fontSize:20 }}>{icon}</span>)}
          </div>
        )}
      </div>

      <PeriodNav mode={mode} onModeChange={handleModeChange} period={period} onPeriodChange={setPeriod}/>

      <div style={{ padding:"12px 14px 0", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ background:"#fff", borderRadius:14, padding:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:10 }}>Rating Hari Ini</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input type="range" min={1} max={10} step={1} value={draft.rating} onChange={e => upd("rating",Number(e.target.value))} style={{ flex:1, accentColor:C.primary }}/>
            <div style={{ width:44, height:44, borderRadius:"50%", background:C.primaryBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.primary, flexShrink:0 }}>{draft.rating}</div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginTop:4 }}>
            <span>😔 Jelek</span><span>Keren banget 🤩</span>
          </div>
        </div>

        {[
          { f:"olahraga", label:"Olahraga",          placeholder:"Ngapain aja? Berapa menit? Gimana rasanya?", icon:"🏃‍♀️" },
          { f:"makan",    label:"Pola Makan",         placeholder:"Makan apa aja? Ada yang cheat meal?",         icon:"🍽️" },
          { f:"study",    label:"Study & Kegiatan",   placeholder:"Progress hari ini? Ada yang bikin bangga?",   icon:"📚" },
          { f:"catatan",  label:"Perasaan & Catatan", placeholder:"Mau nulis apa aja boleh, bebas...",           icon:"💭" },
        ].map(({ f, label, placeholder, icon }) => (
          <div key={f} style={{ background:"#fff", borderRadius:14, padding:"13px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8, display:"flex", gap:7, alignItems:"center" }}>
              <span style={{ fontSize:17 }}>{icon}</span> {label}
            </div>
            <textarea value={draft[f]} onChange={e => upd(f,e.target.value)} placeholder={placeholder} rows={3}
              style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 12px", fontSize:14, color:C.text, resize:"vertical", outline:"none", boxSizing:"border-box", background:"#FAFAFA", lineHeight:1.6 }}
            />
          </div>
        ))}

        <button onClick={doSave} style={{ padding:15, borderRadius:14, border:"none", background:saved?C.positive:C.primary, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          {saved?"✓ Tersimpan!":"Simpan Jurnal"}
        </button>
        <div style={{ height:16 }}/>
      </div>
    </div>
  );
}

/* ─── TAB: WISHLIST ─────────────────────────────────────────────────────── */
function WishlistTab({ wishlist, save }) {
  const [section,  setSection]  = useState("kebutuhan");
  const [newItem,  setNewItem]  = useState("");
  const safeTop = "calc(env(safe-area-inset-top, 0px) + 24px)";

  const SECS = [
    { id:"kebutuhan", label:"Kebutuhan",  color:C.danger,  icon:"📦" },
    { id:"mauBeli",   label:"Mau Beli",   color:C.primary, icon:"🛍️" },
    { id:"selfReward",label:"Self-Reward",color:C.accent,  icon:"🎁" },
  ];

  const cur       = SECS.find(s => s.id===section);
  const items     = wishlist[section] || [];
  const doneCount = items.filter(i => i.done).length;
  const pct       = items.length ? Math.round((doneCount/items.length)*100) : 0;

  const add    = () => { if (!newItem.trim()) return; save({ ...wishlist, [section]:[...items,{ id:Date.now(), text:newItem.trim(), done:false }] }); setNewItem(""); };
  const toggle = (id) => save({ ...wishlist, [section]:items.map(i => i.id===id?{...i,done:!i.done}:i) });
  const del    = (id) => save({ ...wishlist, [section]:items.filter(i => i.id!==id) });

  return (
    <div>
      <div style={{ background:C.accent, paddingTop:safeTop, paddingRight:20, paddingBottom:18, paddingLeft:20 }}>
        <div style={{ fontSize:12, opacity:0.7, color:"#2D2340", marginBottom:2 }}>{fmtDate(todayStr())}</div>
        <div style={{ fontSize:20, fontWeight:700, color:"#2D2340" }}>List & Goals ⭐</div>
        <div style={{ display:"flex", gap:7, marginTop:12, flexWrap:"wrap" }}>
          {SECS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding:"7px 13px", borderRadius:20, border:"none", cursor:"pointer",
              background: section===s.id?"#fff":"rgba(255,255,255,0.3)",
              color: section===s.id?s.color:"#2D2340",
              fontWeight: section===s.id?700:500, fontSize:12,
            }}>{s.icon} {s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"12px 14px 0" }}>
        <div style={{ background:"#fff", borderRadius:12, padding:"11px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <Ring pct={pct} size={52} stroke={5} color={cur?.color}/>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:cur?.color }}>{pct}%</div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{cur?.label}</div>
            <div style={{ fontSize:12, color:C.muted }}>{doneCount} dari {items.length} selesai</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <input type="text" placeholder={`Tambah ${cur?.label.toLowerCase()}...`} value={newItem}
            onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key==="Enter"&&add()}
            style={{ flex:1, padding:"11px 13px", borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.text, background:"#fff", outline:"none" }}
          />
          <button onClick={add} style={{ padding:"11px 16px", borderRadius:12, border:"none", background:cur?.color, color:"#fff", fontWeight:700, fontSize:18, cursor:"pointer" }}>+</button>
        </div>

        {items.length===0
          ? <div style={{ background:"#fff", borderRadius:12, padding:"20px", textAlign:"center", color:C.muted, fontSize:14 }}>Belum ada item. Yuk tambahin!</div>
          : (
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {items.map(item => (
                <div key={item.id} style={{ background:"#fff", borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, opacity:item.done?0.6:1 }}>
                  <div onClick={() => toggle(item.id)} style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, background:item.done?cur?.color:"transparent", border:`2px solid ${item.done?cur?.color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    {item.done && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
                  </div>
                  <span style={{ flex:1, fontSize:14, color:C.text, textDecoration:item.done?"line-through":"none" }}>{item.text}</span>
                  <button onClick={() => del(item.id)} style={{ fontSize:16, color:"#ccc", background:"none", border:"none", cursor:"pointer", padding:"0 2px" }}>✕</button>
                </div>
              ))}
            </div>
          )
        }
        <div style={{ height:16 }}/>
      </div>
    </div>
  );
}
