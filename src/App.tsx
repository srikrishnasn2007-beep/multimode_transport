import { useMemo, useState } from "react";
import {
  ArrowDownUp, ArrowRight, Bus, CalendarClock, Check, ChevronDown,
  Clock3, Footprints, MapPin, Menu, Navigation, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, TrainFront, Wallet, Zap
} from "lucide-react";
import "./index.css";

type Mode = "walk" | "bus" | "metro";
type Leg = { mode: Mode; title: string; detail: string; duration: string; time: string };
type Journey = {
  id: string; label: string; labelTone: string; title: string; duration: string;
  arrival: string; price: number; comfort: number; transfers: number; walking: string;
  waiting: string; summary: string; legs: Leg[]; line: string; line2?: string;
};

const journeys: Journey[] = [
  {
    id: "balanced", label: "BEST BALANCE", labelTone: "mint", title: "Metro + short walk",
    duration: "42 min", arrival: "9:12 AM", price: 35, comfort: 86, transfers: 1,
    walking: "850 m", waiting: "6 min", summary: "A good mix of speed, low cost and fewer interruptions.",
    line: "Green Line", line2: "Walk",
    legs: [
      { mode: "walk", title: "Walk to Banashankari Metro", detail: "Via the pedestrian route", duration: "8 min", time: "8:22 AM" },
      { mode: "metro", title: "Green Line · towards Madavara", detail: "Board at Banashankari · alight at Majestic", duration: "25 min", time: "8:30 AM" },
      { mode: "walk", title: "Walk to destination", detail: "Final-mile walk", duration: "9 min", time: "8:55 AM" },
    ],
  },
  {
    id: "cheap", label: "LOWEST FARE", labelTone: "blue", title: "BMTC direct + walk",
    duration: "56 min", arrival: "9:26 AM", price: 15, comfort: 72, transfers: 0,
    walking: "620 m", waiting: "11 min", summary: "Lowest estimated fare with a simple, direct bus journey.",
    line: "BMTC bus",
    legs: [
      { mode: "walk", title: "Walk to bus stop", detail: "Nearest suitable stop (demo)", duration: "5 min", time: "8:30 AM" },
      { mode: "bus", title: "BMTC bus · sample route", detail: "Board at origin stop · alight near destination", duration: "40 min", time: "8:35 AM" },
      { mode: "walk", title: "Walk to destination", detail: "Final-mile walk", duration: "11 min", time: "9:15 AM" },
    ],
  },
  {
    id: "comfort", label: "MOST COMFORTABLE", labelTone: "purple", title: "Metro with fewer transfers",
    duration: "48 min", arrival: "9:18 AM", price: 40, comfort: 93, transfers: 0,
    walking: "1.1 km", waiting: "4 min", summary: "Fewer changes and a more predictable ride; more walking at the ends.",
    line: "Green Line",
    legs: [
      { mode: "walk", title: "Walk to metro station", detail: "Station access route (demo)", duration: "10 min", time: "8:30 AM" },
      { mode: "metro", title: "Green Line · sample journey", detail: "Stay on the same line", duration: "29 min", time: "8:40 AM" },
      { mode: "walk", title: "Walk to destination", detail: "Final-mile walk", duration: "9 min", time: "9:09 AM" },
    ],
  },
];

function IconForMode({ mode }: { mode: Mode }) {
  if (mode === "bus") return <Bus size={17} />;
  if (mode === "metro") return <TrainFront size={17} />;
  return <Footprints size={17} />;
}

function App() {
  const [origin, setOrigin] = useState("Banashankari 3rd Stage");
  const [destination, setDestination] = useState("Christ University, Bengaluru");
  const [priority, setPriority] = useState("balanced");
  const [departure, setDeparture] = useState("now");
  const [selected, setSelected] = useState("balanced");
  const [showDetails, setShowDetails] = useState(true);
  const [searched, setSearched] = useState(false);
  const selectedJourney = useMemo(() => journeys.find((j) => j.id === selected) ?? journeys[0], [selected]);

  const ranked = useMemo(() => {
    if (priority === "time") return [...journeys].sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    if (priority === "price") return [...journeys].sort((a, b) => a.price - b.price);
    if (priority === "comfort") return [...journeys].sort((a, b) => b.comfort - a.comfort);
    return journeys;
  }, [priority]);

  function submitSearch() {
    setSearched(true);
    setSelected(priority === "price" ? "cheap" : priority === "comfort" ? "comfort" : "balanced");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Navigation size={21} strokeWidth={2.5} /></div>
          <div><span className="brand-name">wayfinder<span>.</span></span><span className="brand-sub">BENGALURU TRANSIT</span></div>
        </div>
        <nav className="main-nav">
          <a className="nav-active" href="#planner">Journey planner</a>
          <a href="#routes">Explore routes</a>
          <a href="#how">How it works</a>
        </nav>
        <div className="top-actions">
          <span className="city-pill"><span className="live-dot" /> Bengaluru, IN</span>
          <button className="icon-button" aria-label="Toggle menu"><Menu size={19} /></button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> PUBLIC TRANSPORT, BETTER PLANNED</div>
            <h1>Every journey has<br /><em>a smarter way.</em></h1>
            <p>Compare buses, metro and walking in one place. Find the route that fits your time, budget and comfort.</p>
            <div className="hero-trust">
              <span><Check size={14} /> Multimodal by design</span>
              <span><Check size={14} /> Three ways to compare</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of connected transport modes">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="art-node node-walk"><Footprints size={22} /><span>WALK</span></div>
            <div className="art-node node-bus"><Bus size={25} /><span>BMTC</span></div>
            <div className="art-node node-metro"><TrainFront size={25} /><span>METRO</span></div>
            <div className="art-center"><Navigation size={29} /><span>YOUR<br />JOURNEY</span></div>
            <div className="art-path path-a" /><div className="art-path path-b" /><div className="art-path path-c" />
          </div>
        </section>

        <section className="planner-card" id="planner">
          <div className="section-heading">
            <div><span className="section-kicker">PLAN A JOURNEY</span><h2>Where are you headed?</h2></div>
            <span className="demo-badge"><span /> INTERACTIVE DEMO</span>
          </div>
          <div className="search-grid">
            <label className="location-field">
              <span className="field-label"><span className="origin-dot" /> FROM</span>
              <div className="input-wrap"><MapPin size={18} /><input value={origin} onChange={(e) => setOrigin(e.target.value)} aria-label="Origin" placeholder="Enter starting point" /></div>
            </label>
            <button className="swap-button" onClick={() => { setOrigin(destination); setDestination(origin); }} aria-label="Swap origin and destination"><ArrowDownUp size={18} /></button>
            <label className="location-field">
              <span className="field-label"><span className="destination-dot" /> TO</span>
              <div className="input-wrap"><MapPin size={18} /><input value={destination} onChange={(e) => setDestination(e.target.value)} aria-label="Destination" placeholder="Where to?" /></div>
            </label>
            <label className="departure-field">
              <span className="field-label">DEPARTURE</span>
              <div className="select-wrap"><CalendarClock size={17} /><select value={departure} onChange={(e) => setDeparture(e.target.value)} aria-label="Departure time"><option value="now">Leave now</option><option value="30">In 30 minutes</option><option value="60">In 1 hour</option><option value="custom">Choose time (later)</option></select><ChevronDown size={15} /></div>
            </label>
            <button className="search-button" onClick={submitSearch}><Search size={18} /> Find my routes <ArrowRight size={17} /></button>
          </div>
          <div className="transport-included">
            <span>INCLUDED</span><span className="mode-chip"><TrainFront size={14} /> Namma Metro</span><span className="mode-chip"><Bus size={14} /> BMTC buses</span><span className="mode-chip"><Footprints size={14} /> Walking</span><span className="excluded-note">Autos & cabs excluded</span>
          </div>
        </section>

        <section className="results-section" id="routes">
          <div className="results-heading">
            <div><span className="section-kicker">YOUR OPTIONS</span><h2>{searched ? "Routes for your journey" : "A smarter way to get there"}</h2><p>{searched ? `${origin || "Origin"} → ${destination || "Destination"} · Demo results` : "Three recommendations. Three different priorities. You choose."}</p></div>
            <button className="filter-button" onClick={() => setShowDetails(!showDetails)}><SlidersHorizontal size={16} /> {showDetails ? "Hide details" : "Show details"}</button>
          </div>
          <div className="priority-tabs" role="group" aria-label="Journey preference">
            {[["balanced", "Balanced"], ["time", "Fastest"], ["price", "Lowest price"], ["comfort", "Comfort"]].map(([value, label]) => (
              <button key={value} className={priority === value ? "priority-tab active" : "priority-tab"} onClick={() => { setPriority(value); if (value === "price") setSelected("cheap"); else if (value === "comfort") setSelected("comfort"); else setSelected("balanced"); }}>{label}</button>
            ))}
          </div>
          <div className="route-layout">
            <div className="route-list">
              {ranked.map((journey, index) => (
                <button key={journey.id} className={`route-card ${selected === journey.id ? "route-selected" : ""}`} onClick={() => setSelected(journey.id)}>
                  <div className="route-card-top"><span className={`route-tag ${journey.labelTone}`}>{priority === "time" && index === 0 ? "FASTEST" : priority === "price" && index === 0 ? "LOWEST FARE" : priority === "comfort" && index === 0 ? "MOST COMFORTABLE" : journey.label}</span><span className="route-duration">{journey.duration}</span></div>
                  <h3>{journey.title}</h3>
                  <p className="route-summary">{journey.summary}</p>
                  <div className="mode-chain">{journey.legs.map((leg, i) => <span className={`mode-node ${leg.mode}`} key={i}><IconForMode mode={leg.mode} />{i < journey.legs.length - 1 && <span className="chain-line" />}</span>)}</div>
                  <div className="route-stats">
                    <span><Wallet size={15} /> ₹{journey.price}</span><span><ShieldCheck size={15} /> {journey.comfort}/100</span><span><Footprints size={15} /> {journey.walking}</span>
                  </div>
                  {showDetails && <div className="route-bottom"><span><Clock3 size={14} /> Arrive {journey.arrival}</span><span>{journey.transfers} transfers</span><span>{journey.waiting} wait</span></div>}
                </button>
              ))}
            </div>

            <aside className="journey-detail">
              <div className="detail-header"><div><span className="section-kicker">SELECTED JOURNEY</span><h3>{selectedJourney.title}</h3></div><span className="detail-time">{selectedJourney.duration}</span></div>
              <div className="detail-summary"><div className="detail-metric"><span>ARRIVAL</span><strong>{selectedJourney.arrival}</strong></div><div className="detail-metric"><span>EST. FARE</span><strong>₹{selectedJourney.price}</strong></div><div className="detail-metric"><span>COMFORT</span><strong>{selectedJourney.comfort}<small>/100</small></strong></div></div>
              <div className="timeline">
                {selectedJourney.legs.map((leg, i) => (
                  <div className="timeline-leg" key={`${selectedJourney.id}-${i}`}>
                    <div className={`timeline-icon ${leg.mode}`}><IconForMode mode={leg.mode} /></div>
                    <div className="timeline-content"><div className="timeline-time">{leg.time} <span>· {leg.duration}</span></div><strong>{leg.title}</strong><p>{leg.detail}</p></div>
                  </div>
                ))}
              </div>
              <div className="map-preview">
                <div className="map-grid" />
                <svg viewBox="0 0 420 160" preserveAspectRatio="xMidYMid slice" aria-label="Illustrative route map">
                  <path d="M-10 130 C50 120 55 30 135 55 S225 140 285 82 S370 35 440 45" className="map-road"/>
                  <path d="M10 15 L85 55 L145 20 L210 55 L270 15 L340 50 L410 12" className="map-road thin"/>
                  <path d="M15 155 L90 110 L140 140 L205 95 L280 130 L350 90 L430 120" className="map-road thin"/>
                  <path d="M35 120 C90 90 105 40 165 65 S245 115 300 75 S365 55 395 60" className="map-route"/>
                  <circle cx="35" cy="120" r="6" className="map-start"/><circle cx="395" cy="60" r="6" className="map-end"/>
                  <text x="24" y="145">START</text><text x="345" y="43">DESTINATION</text>
                </svg>
                <span className="map-caption"><MapPin size={13} /> Illustrative map · real route geometry not connected yet</span>
              </div>
              <div className="data-notice"><Sparkles size={15} /><span><strong>Prototype data</strong> · Sample routes and fares are illustrative. Connect verified BMTC/metro data for real recommendations.</span></div>
              <button className="details-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Collapse route details" : "View route details"} <ArrowRight size={16} /></button>
            </aside>
          </div>
        </section>

        <section className="how-section" id="how">
          <div><span className="section-kicker">BUILT AROUND YOUR PRIORITIES</span><h2>Not just the shortest route.<br /><em>The right route for you.</em></h2></div>
          <div className="criteria-grid">
            <div className="criterion"><div className="criterion-icon time"><Zap size={19} /></div><h3>Time</h3><p>Door-to-door duration, including walking, waiting, transfers and riding.</p></div>
            <div className="criterion"><div className="criterion-icon price"><Wallet size={19} /></div><h3>Price</h3><p>Estimated total public transport fares across every paid leg.</p></div>
            <div className="criterion"><div className="criterion-icon comfort"><ShieldCheck size={19} /></div><h3>Comfort</h3><p>A transparent score based on walking, transfers, waiting and uncertainty.</p></div>
          </div>
        </section>
        <footer><div className="brand small"><div className="brand-mark"><Navigation size={17} /></div><span className="brand-name">wayfinder<span>.</span></span></div><p>Built for better everyday journeys in Bengaluru.</p><span className="footer-disclaimer">Prototype · Demo data only</span></footer>
      </main>
    </div>
  );
}

export default App;
