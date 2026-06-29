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
  { id: "makan", label: "Makan & Warkop", budget: 570000 },
  { id: "transpor", label: "Transpor & Data", budget: 230000 },
  { id: "wants", label: "Wants & Lain-lain", budget: 100000 },
  { id: "kuliah", label: "Kebutuhan Kuliah", budget: 50000 },
  { id: "kesehatan", label: "Kesehatan/Beauty", budget: 50000 },
];

const ISRC = ["MAMA", "Beasiswa/YVDMI", "Bu Rina", "Lainnya"];

const KEYS = { h: "wuli_h", e: "wuli_e", j: "wuli_j", w: "wuli_w" };

const todayStr = () => new Date().toISOString().slice(0, 10);
const monthStr = () => new Date().toISOString().slice(0, 7);
const fmtRp = (n) => `Rp${Math.round(Number(n) || 0).toLocaleString("id-ID")}`;
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

function Ring({ pct, size = 100, stroke = 9, color }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color || C.primary} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [habits, setHabits] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [journal, setJournal] = useState({});
  const [wishlist, setWishlist] = useState({ kebutuhan: [], mauBeli: [], selfReward: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    for (const [k, sk] of [[setHabits, KEYS.h], [setExpenses, KEYS.e], [setJournal, KEYS.j], [setWishlist, KEYS.w]]) {
      try { const r = localStorage.getItem(sk); if (r) k(JSON.parse(r)); } catch { }
    }
    setReady(true);
  }, []);

  const persist = (sk, data, setter) => {
    setter(data);
    try { localStorage.setItem(sk, JSON.stringify(data)); } catch { }
  };

  const sh = (d) => persist(KEYS.h, d, setHabits);
  const se = (d) => persist(KEYS.e, d, setExpenses);
  const sj = (d) => persist(KEYS.j, d, setJournal);
  const sw = (d) => persist(KEYS.w, d, setWishlist);

  const TABS = [
    { id: "today", label: "Hari Ini", icon: "☀️" },
    { id: "duit", label: "Duit", icon: "💰" },
    { id: "jurnal", label: "Jurnal", icon: "📝" },
    { id: "wishlist", label: "List", icon: "⭐" },
  ];

  if (!ready) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "system-ui,sans-serif", color: C.primary }}>
      Memuat data...
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "system-ui,-apple-system,sans-serif", position: "relative" }}>
      <div style={{ paddingBottom: 72 }}>
        {tab === "today" && <TodayTab habits={habits} save={sh} expenses={expenses} journal={journal} />}
        {tab === "duit" && <DuitTab expenses={expenses} save={se} />}
        {tab === "jurnal" && <JurnalTab journal={journal} save={sj} todayHabits={habits[todayStr()] || {}} />}
        {tab === "wishlist" && <WishlistTab wishlist={wishlist} save={sw} />}
      </div>
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, background: "#fff", borderTop: `1px solid ${C.border}`,
        display: "flex", zIndex: 100,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, border: "none", background: "none", padding: "10px 0 8px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: tab === t.id ? C.primary : C.muted,
            fontSize: 11, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", transition: "color 0.2s",
          }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TodayTab({ habits, save, expenses, journal }) {
  const tk = todayStr();
  const ex = EXERCISE[new Date().getDay()];
  const th = habits[tk] || {};
  const done = HABITS.filter(h => th[h.id]).length;
  const pct = Math.round((done / HABITS.length) * 100);
  const todaySpend = expenses.filter(e => e.date === tk && e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
  const rating = journal[tk]?.rating;

  const toggle = async (id) => {
    await save({ ...habits, [tk]: { ...th, [id]: !th[id] } });
  };

  const vibe = pct === 100 ? "Perfect day! 🎉" : pct >= 70 ? "Hampir full, dikit lagi! 💪" : pct >= 40 ? "Semangat terus! ✨" : "Yuk mulai hari ini! 🌸";

  return (
    <div>
      <div style={{ background: C.primary, padding: "28px 20px 20px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.75 }}>{fmtDate(tk)}</div>
        <div style={{ fontSize: 21, fontWeight: 700, marginTop: 2 }}>Hai, Wuli! 👋</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Ring pct={pct} size={110} stroke={10} color="#F4C430" />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{pct}%</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{done}/{HABITS.length}</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{vibe}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", flex: 1 }}>
                <div style={{ fontSize: 10, opacity: 0.75 }}>Pengeluaran hari ini</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtRp(todaySpend)}</div>
              </div>
              {rating && (
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>Rating</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{rating}/10</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: "14px 14px 0", background: "#fff", borderRadius: 14, padding: "14px 16px", borderLeft: `4px solid ${C.primary}` }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Olahraga Hari Ini</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginTop: 6 }}>{ex.e} {ex.label}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{ex.note}</div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Habit Checklist</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {HABITS.map(h => {
            const isDone = !!th[h.id];
            return (
              <div key={h.id} onClick={() => toggle(h.id)} style={{
                background: isDone ? C.positiveBg : "#fff",
                border: `1.5px solid ${isDone ? C.positive : C.border}`,
                borderRadius: 12, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.15s",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: isDone ? C.positive : "transparent",
                  border: `2px solid ${isDone ? C.positive : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  {isDone && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                </div>
                <span style={{ fontSize: 19 }}>{h.icon}</span>
                <span style={{ fontSize: 14, fontWeight: isDone ? 600 : 400, color: isDone ? C.positive : C.text }}>{h.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function DuitTab({ expenses, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "expense", amount: "", category: "makan", note: "", source: "MAMA" });
  const tk = todayStr();
  const tm = monthStr();

  const mExp = expenses.filter(e => e.date.startsWith(tm) && e.type === "expense");
  const mInc = expenses.filter(e => e.date.startsWith(tm) && e.type === "income");
  const totalOut = mExp.reduce((s, e) => s + Number(e.amount), 0);
  const totalIn = mInc.reduce((s, e) => s + Number(e.amount), 0);
  const todayTx = expenses.filter(e => e.date === tk).sort((a, b) => b.id - a.id);

  const addEntry = async () => {
    if (!form.amount) return;
    const entry = { id: Date.now(), date: tk, type: form.type, amount: Number(String(form.amount).replace(/[^0-9]/g, "")), category: form.type === "expense" ? form.category : form.source, note: form.note };
    await save([entry, ...expenses]);
    setForm({ type: "expense", amount: "", category: "makan", note: "", source: "MAMA" });
    setShowAdd(false);
  };

  const catSpend = (cid) => mExp.filter(e => e.category === cid).reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <div style={{ background: "#2D2340", padding: "28px 20px 20px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.65 }}>Bulan Ini — {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</div>
        <div style={{ fontSize: 21, fontWeight: 700, marginTop: 2 }}>Laporan Keuangan 💰</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[
            { label: "Pemasukan", val: totalIn, color: C.positive },
            { label: "Pengeluaran", val: totalOut, color: "#E05C5C" },
            { label: "Saldo", val: totalIn - totalOut, color: totalIn - totalOut >= 0 ? "#F4C430" : "#E05C5C" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px" }}>
              <div style={{ fontSize: 10, opacity: 0.65 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginTop: 3 }}>{fmtRp(s.val)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Budget Kategori</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ECATS.map(cat => {
            const spent = catSpend(cat.id);
            const pct = Math.min(Math.round((spent / cat.budget) * 100), 100);
            const over = spent > cat.budget;
            return (
              <div key={cat.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: over ? C.danger : C.muted }}>{fmtRp(spent)} / {fmtRp(cat.budget)}</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: over ? C.danger : C.primary, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Transaksi Hari Ini</div>
        {todayTx.length === 0
          ? <div style={{ background: "#fff", borderRadius: 12, padding: "18px", textAlign: "center", color: C.muted, fontSize: 14 }}>Belum ada catatan. Yuk catat!</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayTx.map(e => (
              <div key={e.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{e.type === "income" ? "📥" : "💸"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{e.note || e.category}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{e.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: e.type === "income" ? C.positive : C.danger, textAlign: "right" }}>
                    {e.type === "income" ? "+" : "-"}{fmtRp(e.amount)}
                  </div>
                  <button onClick={() => save(expenses.filter(x => x.id !== e.id))} style={{ fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", padding: 0, display: "block", marginLeft: "auto" }}>hapus</button>
                </div>
              </div>
            ))}
          </div>
        }
        <div style={{ height: 80 }} />
      </div>

      <button onClick={() => setShowAdd(true)} style={{
        position: "fixed", bottom: 80, right: "calc(50% - 210px)",
        width: 52, height: 52, borderRadius: "50%",
        background: C.primary, color: "#fff", border: "none",
        fontSize: 28, cursor: "pointer", boxShadow: "0 4px 16px rgba(157,92,122,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}>+</button>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={() => setShowAdd(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 430, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 18 }}>Catat Transaksi</div>
            <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 4, marginBottom: 16 }}>
              {["expense", "income"].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                  background: form.type === t ? (t === "income" ? C.positive : C.danger) : "transparent",
                  color: form.type === t ? "#fff" : C.muted, fontWeight: 600, fontSize: 13, transition: "all 0.2s",
                }}>{t === "expense" ? "Pengeluaran" : "Pemasukan"}</button>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Nominal</label>
              <input type="number" inputMode="numeric" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 20, fontWeight: 700, color: C.text, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>{form.type === "expense" ? "Kategori" : "Sumber"}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {(form.type === "expense" ? ECATS.map(c => ({ id: c.id, label: c.label })) : ISRC.map(s => ({ id: s, label: s }))).map(opt => {
                  const isActive = (form.type === "expense" ? form.category : form.source) === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setForm(f => ({ ...f, [form.type === "expense" ? "category" : "source"]: opt.id }))} style={{
                      padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${isActive ? C.primary : C.border}`,
                      background: isActive ? C.primaryBg : "#fff", color: isActive ? C.primary : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>{opt.label}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Keterangan</label>
              <input type="text" placeholder="Contoh: makan aero + pens" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.text, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", color: C.muted, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Batal</button>
              <button onClick={addEntry} style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: form.type === "income" ? C.positive : C.primary, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JurnalTab({ journal, save, todayHabits }) {
  const tk = todayStr();
  const existing = journal[tk] || { olahraga: "", makan: "", study: "", catatan: "", rating: 7 };
  const [draft, setDraft] = useState(existing);
  const [saved, setSaved] = useState(false);

  const upd = (f, v) => setDraft(d => ({ ...d, [f]: v }));

  const doSave = async () => {
    await save({ ...journal, [tk]: draft });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const doneBadges = HABITS.filter(h => todayHabits[h.id]).map(h => h.icon);

  return (
    <div>
      <div style={{ background: C.positive, padding: "28px 20px 20px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{fmtDate(tk)}</div>
        <div style={{ fontSize: 21, fontWeight: 700, marginTop: 2 }}>Jurnal Harian 📝</div>
        {doneBadges.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 12 }}>
            {doneBadges.map((icon, i) => <span key={i} style={{ fontSize: 20 }}>{icon}</span>)}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 14px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>Rating Hari Ini</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <input type="range" min={1} max={10} step={1} value={draft.rating} onChange={e => upd("rating", Number(e.target.value))} style={{ flex: 1, accentColor: C.primary }} />
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: C.primary, flexShrink: 0 }}>{draft.rating}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}>
            <span>😔 Jelek</span><span>Keren banget 🤩</span>
          </div>
        </div>

        {[
          { f: "olahraga", label: "Olahraga", placeholder: "Ngapain aja? Berapa menit? Gimana rasanya?", icon: "🏃‍♀️" },
          { f: "makan", label: "Pola Makan", placeholder: "Makan apa aja? Ada yang cheat meal?", icon: "🍽️" },
          { f: "study", label: "Study & Kegiatan", placeholder: "Progress hari ini? Ada yang bikin bangga?", icon: "📚" },
          { f: "catatan", label: "Perasaan & Catatan", placeholder: "Mau nulis apa aja boleh, bebas...", icon: "💭" },
        ].map(({ f, label, placeholder, icon }) => (
          <div key={f} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>{icon}</span> {label}
            </div>
            <textarea value={draft[f]} onChange={e => upd(f, e.target.value)} placeholder={placeholder} rows={3}
              style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, color: C.text, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#FAFAFA", lineHeight: 1.6 }}
            />
          </div>
        ))}

        <button onClick={doSave} style={{ padding: 16, borderRadius: 14, border: "none", background: saved ? C.positive : C.primary, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "background 0.3s" }}>
          {saved ? "✓ Tersimpan!" : "Simpan Jurnal"}
        </button>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function WishlistTab({ wishlist, save }) {
  const [section, setSection] = useState("kebutuhan");
  const [newItem, setNewItem] = useState("");

  const SECS = [
    { id: "kebutuhan", label: "Kebutuhan", color: C.danger, icon: "📦" },
    { id: "mauBeli", label: "Mau Beli", color: C.primary, icon: "🛍️" },
    { id: "selfReward", label: "Self-Reward", color: C.accent, icon: "🎁" },
  ];

  const cur = SECS.find(s => s.id === section);
  const items = wishlist[section] || [];
  const doneCount = items.filter(i => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const add = async () => {
    if (!newItem.trim()) return;
    await save({ ...wishlist, [section]: [...items, { id: Date.now(), text: newItem.trim(), done: false }] });
    setNewItem("");
  };

  const toggle = async (id) => {
    await save({ ...wishlist, [section]: items.map(i => i.id === id ? { ...i, done: !i.done } : i) });
  };

  const del = async (id) => {
    await save({ ...wishlist, [section]: items.filter(i => i.id !== id) });
  };

  return (
    <div>
      <div style={{ background: C.accent, padding: "28px 20px 20px" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#2D2340" }}>List & Goals ⭐</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {SECS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: section === s.id ? "#fff" : "rgba(255,255,255,0.3)",
              color: section === s.id ? s.color : "#2D2340",
              fontWeight: section === s.id ? 700 : 500, fontSize: 12, transition: "all 0.2s",
            }}>{s.icon} {s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Ring pct={pct} size={54} stroke={6} color={cur?.color} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: cur?.color }}>{pct}%</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{cur?.label}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{doneCount} dari {items.length} selesai</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input type="text" placeholder={`Tambah ${cur?.label.toLowerCase()}...`} value={newItem}
            onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
            style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={add} style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: cur?.color, color: "#fff", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>+</button>
        </div>

        {items.length === 0
          ? <div style={{ background: "#fff", borderRadius: 12, padding: "20px", textAlign: "center", color: C.muted, fontSize: 14 }}>Belum ada item. Yuk tambahin!</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, opacity: item.done ? 0.6 : 1 }}>
                <div onClick={() => toggle(item.id)} style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: item.done ? cur?.color : "transparent",
                  border: `2px solid ${item.done ? cur?.color : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  {item.done && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: C.text, textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
                <button onClick={() => del(item.id)} style={{ fontSize: 16, color: "#ccc", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>✕</button>
              </div>
            ))}
          </div>
        }
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}