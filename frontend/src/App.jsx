import React, { useMemo, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const NAV_ITEMS = [
  { icon: "⬡", label: "Dashboard" },
  { icon: "◈", label: "Simulation" },
  { icon: "◉", label: "Insights" },
  { icon: "◐", label: "Analytics" },
  { icon: "◫", label: "Risk Engine" },
];

const SECTION_MAP = {
  Dashboard: ["kpi", "simulator", "charts"],
  Simulation: ["simulator"],
  Insights: ["whatif", "charts"],
  Analytics: ["charts"],
  "Risk Engine": ["kpi", "whatif"],
};

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [price, setPrice] = useState(100);
  const [marketing, setMarketing] = useState(50000);
  const [customers, setCustomers] = useState(3000);
  const [prediction, setPrediction] = useState(null);
  const [discount, setDiscount] = useState(20);
  const [cost, setCost] = useState(10000);

const logout = async  () => {
  await signOut(auth);
  window.location.href = "/";
};
const callBackend = async () => {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price,
      customers,
      cost,
      marketing_spend: marketing,
      discount: discount / 100,
    }),
  });

  const data = await response.json();
  setPrediction(data);
};

useEffect(() => {
  callBackend();
}, [price, customers, marketing, cost, discount]);

  const revenue = useMemo(() => {
    return Math.round(
      price * customers * (1 - discount / 100) + marketing * 0.35 - cost
    );
  }, [price, marketing, customers, discount, cost]);

  const risk = useMemo(() => {
    let score = discount * 0.6 + marketing / 2500 - customers / 500;
    if (score < 20) score = 20;
    if (score > 95) score = 95;
    return Math.round(score);
  }, [discount, marketing, customers]);

  const riskLabel = risk < 35 ? "LOW" : risk < 70 ? "MEDIUM" : "HIGH";
  const riskColor = risk < 35 ? "#4ade80" : risk < 70 ? "#fbbf24" : "#f87171";

  const chartData = [
    { month: "Jan", revenue: Math.round(revenue * 0.5) },
    { month: "Feb", revenue: Math.round(revenue * 0.65) },
    { month: "Mar", revenue: Math.round(revenue * 0.72) },
    { month: "Apr", revenue: Math.round(revenue * 0.84) },
    { month: "May", revenue: Math.round(revenue * 0.92) },
    { month: "Jun", revenue: revenue },
  ];

  const whatIfData = [
    { scenario: "↑ Price +10%", revenue: revenue + 40000, risk: Math.min(95, risk + 6), delta: "+₹40,000" },
    { scenario: "↑ Marketing 2×", revenue: revenue + 65000, risk: Math.min(95, risk + 14), delta: "+₹65,000" },
    { scenario: "↑ Discount +5%", revenue: revenue + 22000, risk: Math.min(95, risk + 20), delta: "+₹22,000" },
  ];

  const sections = SECTION_MAP[active] || [];

  const kpiCards = [
    { label: "REVENUE", value: `₹${prediction?.revenue?.toLocaleString()}`, sub: "Projected", accent: "#22d3ee", bg: "rgba(34,211,238,0.08)" },
    { label: "PROFIT", value: `₹${prediction?.predicted_profit?.toLocaleString()}`, sub: "After costs", accent: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
    { label: "CUSTOMERS", value: customers.toLocaleString(), sub: "Active users", accent: "#f472b6", bg: "rgba(244,114,182,0.08)" },
    { label: "RISK LEVEL", value: riskLabel, sub: `Score: ${risk}/100`, accent: riskColor, bg: `rgba(${riskColor === "#4ade80" ? "74,222,128" : riskColor === "#fbbf24" ? "251,191,36" : "248,113,113"},0.08)` },
  ];

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>StrategyLab</span>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(({ icon, label }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={isActive ? "nav-btn nav-active" : "nav-btn"}
                style={styles.navBtn}
              >
                <span style={{ fontSize: "18px", opacity: 0.7 }}>{icon}</span>
                <span>{label}</span>
                {isActive && <span style={styles.navPip} />}
              </button>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
        <button
  onClick={logout}
  style={{
    marginTop: "14px",
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#ff4d4d,#ff1a1a)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  Logout
</button>
          <div style={styles.statusDot} />
          <span style={{ fontSize: "12px", opacity: 0.5, letterSpacing: "0.08em" }}>LIVE SIMULATION</span>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* PAGE HEADER */}
        <header style={styles.pageHeader}>
          <div>
            <p style={styles.breadcrumb}>StrategyLab / {active}</p>
            <h1 style={styles.pageTitle}>{active}</h1>
          </div>
          <div style={styles.headerBadge}>
            <span style={{ color: riskColor, fontWeight: 700 }}>{riskLabel}</span>
            &nbsp;RISK &nbsp;·&nbsp; ₹ {prediction?.revenue?.toLocaleString()} PROJECTED
          </div>
        </header>

        <div style={styles.content}>

          {/* KPI SECTION */}
          {sections.includes("kpi") && (
            <section style={styles.section}>
              <SectionLabel label="Key Performance Indicators" />
              <div style={styles.kpiGrid}>
                {kpiCards.map((card) => (
                  <div key={card.label} className="card hover-lift" style={{ ...styles.kpiCard, background: card.bg, borderColor: card.accent + "33" }}>
                    <p style={{ ...styles.kpiLabel, color: card.accent }}>{card.label}</p>
                    <p style={{ ...styles.kpiValue, color: card.accent }}>{card.value}</p>
                    <p style={styles.kpiSub}>{card.sub}</p>
                    <div style={{ ...styles.kpiGlow, background: card.accent + "22" }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SIMULATOR SECTION */}
          {sections.includes("simulator") && (
            <section style={styles.section}>
              <SectionLabel label="Business Simulator" />
              <div style={styles.simGrid}>
                {/* CONTROLS */}
                <div className="card" style={styles.simCard}>
                  <p style={styles.cardTitle}>Input Variables</p>
                  <div style={styles.inputGrid}>
                    <NumInput label="Price (₹)" value={price} onChange={setPrice} prefix="₹" />
                    <NumInput label="Marketing Spend" value={marketing} onChange={setMarketing} prefix="₹" />
                    <NumInput label="Customers" value={customers} onChange={setCustomers} />
                    <NumInput label="Operating Cost" value={cost} onChange={setCost} prefix="₹" />
                  </div>
                  {/* Discount Slider */}
                  <div style={{ marginTop: "8px" }}>
                    <div style={styles.sliderHeader}>
                      <span style={styles.inputLabel}>Discount Rate</span>
                      <span style={{ ...styles.sliderVal }}>{discount}%</span>
                    </div>
                    <div style={styles.trackWrap}>
                      <div style={{ ...styles.trackFill, width: `${discount}%` }} />
                      <input
                        type="range" min={0} max={100} value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="styled-range"
                        style={styles.range}
                      />
                    </div>
                    <div style={styles.trackLabels}>
                      <span>0%</span><span>50%</span><span>100%</span>
                    </div>
                  </div>
                </div>

                {/* OUTPUT */}
                <div className="card" style={styles.simCard}>
                  <p style={styles.cardTitle}>Prediction Output</p>
                  <div style={styles.outputBlock}>
                    <p style={styles.outputLabel}>PROJECTED REVENUE</p>
                    <p style={styles.outputValue}>₹{prediction?.revenue?.toLocaleString()}</p>
                  </div>
                  <div style={styles.riskBlock}>
                    <div style={styles.riskRow}>
                      <span style={styles.riskTitle}>Risk Score</span>
                      <span style={{ ...styles.riskBadge, background: riskColor + "22", color: riskColor, border: `1px solid ${riskColor}44` }}>
                        {riskLabel}
                      </span>
                    </div>
                    <div style={styles.riskTrack}>
                      <div style={{ ...styles.riskFill, width: `${risk}%`, background: `linear-gradient(90deg, ${riskColor}88, ${riskColor})` }} />
                    </div>
                    <div style={styles.riskLabels}>
                      <span>0</span><span style={{ color: riskColor, fontWeight: 700 }}>{risk}</span><span>100</span>
                    </div>
                  </div>
                  <div style={styles.metaGrid}>
                    <MetaStat label="Gross Margin" value={`${Math.max(0, Math.round(((revenue - cost) / (revenue || 1)) * 100))}%`} />
                    <MetaStat label="ROI on Marketing" value={`${Math.round((revenue / (marketing || 1)) * 100)}%`} />
                    <MetaStat label="Rev per Customer" value={`₹${customers ? Math.round(revenue / customers).toLocaleString() : 0}`} />
                    <MetaStat label="Discount Impact" value={`-₹${Math.round(price * customers * (discount / 100)).toLocaleString()}`} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* WHAT-IF SECTION */}
          {sections.includes("whatif") && (
            <section style={styles.section}>
              <SectionLabel label="What-If Analysis" />
              <div className="card" style={{ ...styles.tableCard }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["Scenario", "Projected Revenue", "Risk Score", "Revenue Delta"].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {whatIfData.map((row, i) => (
                      <tr key={i} className="table-row">
                        <td style={styles.td}><span style={styles.scenarioBadge}>{row.scenario}</span></td>
                        <td style={{ ...styles.td, color: "#22d3ee", fontWeight: 700 }}>₹{row.revenue.toLocaleString()}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.riskBadge, fontSize: "12px", background: (row.risk < 35 ? "#4ade80" : row.risk < 70 ? "#fbbf24" : "#f87171") + "22", color: row.risk < 35 ? "#4ade80" : row.risk < 70 ? "#fbbf24" : "#f87171", border: `1px solid ${row.risk < 35 ? "#4ade80" : row.risk < 70 ? "#fbbf24" : "#f87171"}44` }}>
                            {row.risk}
                          </span>
                        </td>
                        <td style={{ ...styles.td, color: "#4ade80", fontWeight: 600 }}>{row.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* CHARTS SECTION */}
          {sections.includes("charts") && (
            <section style={styles.section}>
              <SectionLabel label="Analytics & Trends" />
              <div style={styles.chartGrid}>
                <div className="card" style={styles.chartCard}>
                  <p style={styles.cardTitle}>Revenue Trend (6-Month)</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
                      <Line type="monotone" dataKey="revenue" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "#22d3ee", r: 5, strokeWidth: 2, stroke: "#0f172a" }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card" style={styles.chartCard}>
                  <p style={styles.cardTitle}>Monthly Revenue Distribution</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: "3px", height: "18px", background: "linear-gradient(180deg,#22d3ee,#a78bfa)", borderRadius: "2px" }} />
      <p style={{ margin: 0, fontSize: "11px", letterSpacing: "0.12em", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{label}</p>
    </div>
  );
}

function NumInput({ label, value, onChange, prefix }) {
  return (
    <div>
      <p style={styles.inputLabel}>{label}</p>
      <div style={styles.inputWrap}>
        {prefix && <span style={styles.inputPrefix}>{prefix}</span>}
        <input
          type="number"
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          style={{ ...styles.input, paddingLeft: prefix ? "36px" : "14px" }}
        />
      </div>
    </div>
  );
}

function MetaStat({ label, value }) {
  return (
    <div style={styles.metaStat}>
      <p style={styles.metaLabel}>{label}</p>
      <p style={styles.metaValue}>{value}</p>
    </div>
  );
}

/* ── Styles ── */

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    background: "#060b18",
    color: "#e2e8f0",
    fontFamily: "'DM Mono', 'JetBrains Mono', 'Fira Code', monospace",
  },
  sidebar: {
    width: "220px",
    flexShrink: 0,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.02)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
    paddingLeft: "8px",
  },
  logoIcon: {
    fontSize: "24px",
    background: "linear-gradient(135deg,#22d3ee,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    background: "linear-gradient(135deg,#22d3ee,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.45)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    letterSpacing: "0.04em",
    position: "relative",
    transition: "all 0.2s",
    fontFamily: "inherit",
    width: "100%",
  },
  navPip: {
    position: "absolute",
    right: "12px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22d3ee",
    boxShadow: "0 0 8px #22d3ee",
  },
  sidebarFooter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "8px",
    marginTop: "20px",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 6px #4ade80",
    animation: "pulse 2s infinite",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 32px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.015)",
    flexShrink: 0,
  },
  breadcrumb: {
    margin: "0 0 4px",
    fontSize: "11px",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
  },
  pageTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "#f1f5f9",
  },
  headerBadge: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "12px",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 600,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  kpiCard: {
    borderRadius: "16px",
    border: "1px solid",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  kpiLabel: {
    margin: "0 0 10px",
    fontSize: "10px",
    letterSpacing: "0.14em",
    fontWeight: 700,
  },
  kpiValue: {
    margin: "0 0 6px",
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  kpiSub: {
    margin: 0,
    fontSize: "11px",
    color: "rgba(255,255,255,0.35)",
  },
  kpiGlow: {
    position: "absolute",
    top: "-30px",
    right: "-30px",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    filter: "blur(30px)",
  },
  simGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  simCard: {
    borderRadius: "16px",
    padding: "28px",
  },
  cardTitle: {
    margin: "0 0 24px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  inputLabel: {
    margin: "0 0 8px",
    fontSize: "11px",
    letterSpacing: "0.08em",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
  },
  inputWrap: {
    position: "relative",
  },
  inputPrefix: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: 600,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  sliderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  sliderVal: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#22d3ee",
  },
  trackWrap: {
    position: "relative",
    height: "6px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "3px",
  },
  trackFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    background: "linear-gradient(90deg,#22d3ee,#a78bfa)",
    borderRadius: "3px",
    pointerEvents: "none",
    transition: "width 0.05s",
  },
  range: {
    position: "absolute",
    top: "-7px",
    left: 0,
    width: "100%",
    height: "20px",
    opacity: 0,
    cursor: "pointer",
    margin: 0,
  },
  trackLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    marginTop: "6px",
  },
  outputBlock: {
    padding: "24px",
    borderRadius: "12px",
    background: "rgba(34,211,238,0.06)",
    border: "1px solid rgba(34,211,238,0.15)",
    marginBottom: "20px",
  },
  outputLabel: {
    margin: "0 0 8px",
    fontSize: "10px",
    letterSpacing: "0.14em",
    fontWeight: 700,
    color: "rgba(34,211,238,0.6)",
  },
  outputValue: {
    margin: 0,
    fontSize: "38px",
    fontWeight: 700,
    color: "#22d3ee",
    letterSpacing: "-0.02em",
  },
  riskBlock: {
    marginBottom: "20px",
  },
  riskRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  riskTitle: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
  },
  riskBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  riskTrack: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  riskFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  riskLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    marginTop: "6px",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  metaStat: {
    padding: "14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  metaLabel: {
    margin: "0 0 4px",
    fontSize: "10px",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
  },
  metaValue: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "#e2e8f0",
  },
  tableCard: {
    borderRadius: "16px",
    overflow: "hidden",
    padding: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "10px",
    letterSpacing: "0.12em",
    fontWeight: 700,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#cbd5e1",
  },
  scenarioBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "13px",
    fontWeight: 600,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  chartCard: {
    borderRadius: "16px",
    padding: "24px",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
  
  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
  }
  
  .hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }

  .nav-btn:hover {
    background: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.85) !important;
  }
  .nav-active {
    background: rgba(34,211,238,0.08) !important;
    color: #22d3ee !important;
    border: 1px solid rgba(34,211,238,0.15) !important;
  }

  .table-row:hover td {
    background: rgba(255,255,255,0.02);
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] { -moz-appearance: textfield; }
  input:focus {
    border-color: rgba(34,211,238,0.4) !important;
    box-shadow: 0 0 0 3px rgba(34,211,238,0.08);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;
