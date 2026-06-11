const { useMemo, useState } = React;

const tools = [
  {
    id: 'antithrombotic',
    title: 'Antithrombotic Safety Assistant',
    label: 'Vascular medicine tool',
    subtitle: 'A clinician checklist for thrombosis on anticoagulation, LMWH/fondaparinux exposure, anti-Xa interpretation, antithrombin deficiency, PF4/HIT/VITT spectrum, APS, DOAC danger zones, and vascular medicine red flags.'
  },
  {
    id: 'af',
    title: 'AF Anticoagulation Decision Aid',
    label: 'Shared decision aid',
    subtitle: 'Structured anticoagulation discussion support for atrial fibrillation, including stroke-risk framing, bleeding-risk cautions, and warfarin-preferred situations.'
  },
  {
    id: 'hyponatremia',
    title: 'Hyponatremia Diagnostic Engine',
    label: 'GIM diagnostic tool',
    subtitle: 'A structured approach to hypotonic hyponatremia using symptoms, serum osmolality, urine osmolality, urine sodium, volume context, endocrine mimics, and correction safety.'
  }
];

function navigate(route) {
  window.location.hash = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentRoute() {
  const raw = window.location.hash.replace('#', '').replace(/^\//, '');
  return raw || 'home';
}

function App() {
  const [route, setRoute] = useState(currentRoute());
  React.useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const toolMatch = route.startsWith('tool/') ? route.split('/')[1] : null;
  return (
    <>
      <Header />
      {toolMatch ? <ToolPage id={toolMatch} /> : <Home route={route} />}
      <Footer />
    </>
  );
}

function Header() {
  const links = [
    ['home', 'Home'],
    ['clinical-tools', 'Clinical Tools'],
    ['crft', 'CRFT'],
    ['qi-projects', 'QI Projects'],
    ['vascular-medicine', 'Vascular Medicine'],
    ['publications', 'Publications'],
    ['contact', 'Contact']
  ];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="Home">
        <span className="brand-mark">FA</span>
        <span>Fahad Almalki, MD</span>
      </button>
      <nav>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => navigate(id)}>{label}</button>
        ))}
      </nav>
    </header>
  );
}

function Home({ route }) {
  React.useEffect(() => {
    if (route && route !== 'home') {
      const el = document.getElementById(route);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [route]);

  return (
    <main>
      <section id="home" className="hero">
        <div className="hero-inner">
          <h1>Fahad Almalki, MD</h1>
          <p className="hero-subtitle">Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</p>
        </div>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">Professional platform</p>
          <h2>A home for clinical tools, teaching, and systems work.</h2>
          <p>
            This site brings together practical decision-support tools, clinical reasoning education, quality-improvement work, and vascular medicine resources.
          </p>
        </div>
        <div className="focus-card">
          <p className="eyebrow">Current focus</p>
          <ul>
            <li>Antithrombotic decision support</li>
            <li>Resident clinical reasoning education</li>
            <li>Inpatient quality and transitions of care</li>
            <li>Vascular medicine frameworks</li>
          </ul>
        </div>
      </section>

      <section id="clinical-tools" className="section tinted">
        <p className="eyebrow">Clinical tools</p>
        <h2>Decision-support tools</h2>
        <p className="section-lead">Tools open as separate pages inside the app. Each page includes a Home or Back button.</p>
        <div className="cards">
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      <section id="crft" className="section">
        <p className="eyebrow">Education</p>
        <h2>CRFT — Clinical Reasoning Framework for Teaching</h2>
        <p>
          CRFT is an educational project designed to help residents practice, structure, and improve clinical reasoning using daily cases, domain-based scoring, feedback, and reflection.
        </p>
        <div className="two-column">
          <InfoBlock title="Core domains" items={["Problem framing", "Hypothesis generation", "Data interpretation", "Management planning", "Anticipation", "Metacognition"]} />
          <InfoBlock title="Teaching aim" items={["Make reasoning observable", "Identify dangerous misses", "Track growth over time", "Coach reflection and recalibration"]} />
        </div>
      </section>

      <section id="qi-projects" className="section tinted">
        <p className="eyebrow">Quality improvement</p>
        <h2>QI Projects</h2>
        <div className="cards compact">
          <MiniCard title="CTU Early Readmission & Transitional Care" text="Identifying preventable patterns in seven-day readmissions, including discharge readiness, pending investigations, medication issues, and follow-up gaps." />
          <MiniCard title="VTE Prophylaxis Standardization" text="Clarifying prophylaxis status, reducing documentation ambiguity, and improving reliability of medical inpatient VTE prevention." />
          <MiniCard title="Perioperative MINS Screening" text="Supporting postoperative myocardial injury detection, risk recognition, and follow-up pathways in high-risk surgical patients." />
          <MiniCard title="Internal Medicine Diagnostic Service Scope" text="Clarifying the role of GIM in complex undifferentiated or multisystem inpatient presentations." />
        </div>
      </section>

      <section id="vascular-medicine" className="section">
        <p className="eyebrow">Clinical focus</p>
        <h2>Vascular Medicine</h2>
        <p>
          Areas of interest include venous thromboembolism, antithrombotic therapy, peripheral artery disease, perioperative vascular risk, thrombosis with thrombocytopenia, and complex vascular presentations in internal medicine.
        </p>
      </section>

      <section id="publications" className="section tinted">
        <p className="eyebrow">Academic output</p>
        <h2>Publications & Presentations</h2>
        <p>Selected publications, abstracts, presentations, quality-improvement reports, and digital tools will be added as they are completed, presented, or published.</p>
      </section>

      <section id="contact" className="section contact-section">
        <p className="eyebrow">Contact</p>
        <h2>Contact</h2>
        <p>For professional, academic, educational, or quality-improvement inquiries:</p>
        <p><a className="email-link" href="mailto:contact@fahadalmalkimd.com">contact@fahadalmalkimd.com</a></p>
      </section>
    </main>
  );
}

function ToolCard({ tool }) {
  return (
    <article className="card tool-card">
      <p className="eyebrow">{tool.label}</p>
      <h3>{tool.title}</h3>
      <p>{tool.subtitle}</p>
      <button className="primary" onClick={() => navigate(`tool/${tool.id}`)}>Open tool</button>
    </article>
  );
}

function MiniCard({ title, text }) {
  return <article className="card"><h3>{title}</h3><p>{text}</p></article>;
}

function InfoBlock({ title, items }) {
  return <div className="info-block"><h3>{title}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>;
}

function ToolPage({ id }) {
  const tool = tools.find(t => t.id === id);
  if (!tool) return <NotFound />;
  return (
    <main className="tool-page">
      <section className="tool-hero">
        <button className="back" onClick={() => navigate('home')}>← Back to Home</button>
        <p className="eyebrow">{tool.label}</p>
        <h1>{tool.title}</h1>
        <p>{tool.subtitle}</p>
      </section>
      {id === 'antithrombotic' && <AntithromboticTool />}
      {id === 'af' && <AFTool />}
      {id === 'hyponatremia' && <HyponatremiaTool />}
    </main>
  );
}

function NotFound() {
  return <main className="tool-page"><section className="tool-hero"><button className="back" onClick={() => navigate('home')}>← Back to Home</button><h1>Page not found</h1></section></main>;
}

function AntithromboticTool() {
  const [state, setState] = useState({ thrombosisOnAC: false, lmwh: false, fonda: false, antiXa: false, atDef: false, plateletFall: false, pf4Timing: false, vaccine: false, aps: false, doacDanger: false, rheumaticMS: false, arterial: false });
  const set = k => e => setState(s => ({ ...s, [k]: e.target.checked }));
  const output = useMemo(() => {
    const flags = [];
    if (state.thrombosisOnAC) flags.push('Confirm true anticoagulant failure: adherence, dosing, timing of last dose, renal/liver function, drug interactions, absorption, weight extremes, and correct indication.');
    if (state.lmwh || state.antiXa) flags.push('For LMWH, anti-Xa interpretation depends on timing, assay calibration, dose schedule, renal function, pregnancy/weight extremes, and antithrombin-dependent heparin physiology.');
    if (state.fonda) flags.push('Fondaparinux exposure: consider anti-Xa assay limitations and remember fondaparinux is also antithrombin-dependent.');
    if (state.atDef) flags.push('Possible antithrombin deficiency can reduce heparin/LMWH/fondaparinux effect; consider AT activity, clinical context, acute thrombosis, nephrotic/liver disease, DIC, and recent heparin exposure.');
    if (state.plateletFall || state.pf4Timing || state.vaccine) flags.push('PF4-spectrum concern: calculate 4Ts when HIT is possible, stop heparin if intermediate/high probability, use non-heparin anticoagulation, and send PF4 immunoassay ± functional assay. Ask about recent adenoviral vaccine when VITT pattern is plausible.');
    if (state.aps) flags.push('APS danger zone: arterial events, triple-positive APS, or recurrent thrombosis despite DOAC should prompt warfarin-centered thinking and specialist input.');
    if (state.doacDanger || state.rheumaticMS) flags.push('DOAC danger zone: avoid DOAC as default in mechanical valves, moderate-to-severe mitral stenosis/rheumatic AF, high-risk APS, major interacting drugs, severe renal impairment, or unreliable absorption.');
    if (state.arterial) flags.push('Arterial or unusual-site thrombosis should trigger vascular medicine thinking: APS, MPN/PNH, malignancy, vasculitis, paradoxical embolism, atherosclerotic plaque event, and anatomic vascular lesions.');
    if (!flags.length) flags.push('No major danger-zone trigger selected. Continue structured review of indication, bleeding risk, renal/liver function, drug interactions, adherence, and local protocol.');
    return flags;
  }, [state]);
  return (
    <section className="section tool-body">
      <div className="check-grid">
        <Check label="Thrombosis occurred while on anticoagulation" checked={state.thrombosisOnAC} onChange={set('thrombosisOnAC')} />
        <Check label="Current/recent LMWH exposure" checked={state.lmwh} onChange={set('lmwh')} />
        <Check label="Current/recent fondaparinux exposure" checked={state.fonda} onChange={set('fonda')} />
        <Check label="Anti-Xa result needs interpretation" checked={state.antiXa} onChange={set('antiXa')} />
        <Check label="Known/suspected antithrombin deficiency" checked={state.atDef} onChange={set('atDef')} />
        <Check label="Platelet fall or thrombocytopenia + thrombosis" checked={state.plateletFall} onChange={set('plateletFall')} />
        <Check label="Timing compatible with HIT/PF4 syndrome" checked={state.pf4Timing} onChange={set('pf4Timing')} />
        <Check label="Recent adenoviral vaccine / VITT pattern" checked={state.vaccine} onChange={set('vaccine')} />
        <Check label="APS known or suspected" checked={state.aps} onChange={set('aps')} />
        <Check label="DOAC danger-zone issue" checked={state.doacDanger} onChange={set('doacDanger')} />
        <Check label="Rheumatic moderate-to-severe MS / rheumatic AF" checked={state.rheumaticMS} onChange={set('rheumaticMS')} />
        <Check label="Arterial or unusual-site thrombosis" checked={state.arterial} onChange={set('arterial')} />
      </div>
      <Output title="Safety output" items={output} />
    </section>
  );
}

function AFTool() {
  const [v, setV] = useState({ sex: 'male', age: '0', chf: false, htn: false, dm: false, stroke: false, vascular: false, renal: false, liver: false, bleed: false, drugs: false, ms: false, mechanical: false });
  const n = Number(v.age);
  const cha = (v.chf?1:0)+(v.htn?1:0)+(n>=75?2:n>=65?1:0)+(v.dm?1:0)+(v.stroke?2:0)+(v.vascular?1:0)+(v.sex==='female'?1:0);
  const hasbled = (v.htn?1:0)+(v.renal?1:0)+(v.liver?1:0)+(v.stroke?1:0)+(v.bleed?1:0)+(n>65?1:0)+(v.drugs?1:0);
  const rec = v.mechanical || v.ms ? 'Warfarin-centered pathway: mechanical valve or moderate-to-severe mitral stenosis/rheumatic AF is not a routine DOAC situation.' : cha >= 2 ? 'Anticoagulation usually favored if no contraindication; use shared decision-making and bleeding risk mitigation.' : cha === 1 ? 'Intermediate risk. Individualize with patient values, modifiers, and bleeding risk.' : 'Low risk by CHA₂DS₂-VASc; anticoagulation may not be needed unless other factors exist.';
  return (
    <section className="section tool-body">
      <div className="form-grid">
        <label>Sex<select value={v.sex} onChange={e=>setV({...v, sex:e.target.value})}><option value="male">Male</option><option value="female">Female</option></select></label>
        <label>Age<input type="number" value={v.age} onChange={e=>setV({...v, age:e.target.value})} /></label>
      </div>
      <div className="check-grid">
        {['chf','htn','dm','stroke','vascular','renal','liver','bleed','drugs','ms','mechanical'].map(k => <Check key={k} label={labelMap[k]} checked={v[k]} onChange={e=>setV({...v,[k]:e.target.checked})} />)}
      </div>
      <Output title="AF decision output" items={[`CHA₂DS₂-VASc: ${cha}`, `HAS-BLED style caution score: ${hasbled}`, rec, 'Use bleeding score to identify modifiable risk factors, not to automatically deny anticoagulation.']} />
    </section>
  );
}

const labelMap = { chf:'Heart failure', htn:'Hypertension', dm:'Diabetes', stroke:'Prior stroke/TIA/systemic embolism', vascular:'Vascular disease', renal:'Renal dysfunction', liver:'Liver dysfunction', bleed:'Prior major bleeding / bleeding tendency', drugs:'Antiplatelet/NSAID/alcohol risk', ms:'Moderate-to-severe mitral stenosis/rheumatic AF', mechanical:'Mechanical valve' };

function HyponatremiaTool() {
  const [v, setV] = useState({ sodium:'', symptoms:'none', serumOsm:'', urineOsm:'', urineNa:'', glucose:false, thiazide:false, lowSolute:false, polydipsia:false, hypovolemia:false, edema:false, siadh:false, adrenalThyroid:false, lowUric:false, ods:false });
  const so = Number(v.serumOsm), uo = Number(v.urineOsm), un = Number(v.urineNa), na = Number(v.sodium);
  const out = [];
  if (v.symptoms === 'severe') out.push('Severe symptoms: urgent hypertonic saline pathway and monitored correction are safety priorities.');
  if (na && na < 120) out.push('Profound hyponatremia: high-risk situation; define chronicity and correction limits.');
  if (so && so >= 275) out.push('Not clearly hypotonic: consider hyperglycemia, mannitol, pseudohyponatremia, or other osmotic drivers before SIADH labeling.');
  if (v.glucose) out.push('Correct sodium for hyperglycemia/osmotic driver before interpreting severity.');
  if (uo && uo < 100) out.push('Urine Osm <100: ADH suppressed pattern; consider primary polydipsia, low solute intake, or reset after water load.');
  if (uo && uo >= 100 && un < 30) out.push('Urine Osm ≥100 with urine Na <30: consider low effective arterial volume, hypovolemia, heart failure/cirrhosis/nephrosis, or diuretic confounding.');
  if (uo && uo >= 100 && un >= 30) out.push('Urine Osm ≥100 with urine Na ≥30: SIADH, adrenal insufficiency, hypothyroidism, renal salt wasting, or diuretic effect are key pathways.');
  if (v.thiazide) out.push('Thiazide-associated hyponatremia can mimic SIADH; stop culprit and reassess.');
  if (v.lowSolute) out.push('Low solute intake/beer potomania pattern: correction can be brisk once solute is given; monitor closely.');
  if (v.polydipsia) out.push('Primary polydipsia possible, especially if urine osmolality is very low.');
  if (v.hypovolemia) out.push('Hypovolemia clues: treat volume depletion carefully and monitor for rapid water diuresis.');
  if (v.edema) out.push('Edematous/low effective arterial volume state: manage underlying HF/cirrhosis/nephrosis; fluid restriction/diuresis strategy depends on context.');
  if (v.siadh) out.push('SIADH clues present: confirm hypotonicity, non-suppressed urine Osm, urine Na usually ≥30, and exclude adrenal/thyroid mimics.');
  if (!v.adrenalThyroid) out.push('Before labeling SIADH, check/exclude adrenal insufficiency and clinically relevant hypothyroidism.');
  if (v.lowUric) out.push('Low uric acid/raised FEUA can support SIADH but is not standalone diagnostic.');
  if (v.ods) out.push('ODS risk: use conservative correction targets and frequent sodium monitoring.');
  if (!out.length) out.push('Enter serum/urine data and clinical context to generate a structured pathway.');
  return (
    <section className="section tool-body">
      <div className="form-grid">
        <label>Serum sodium<input type="number" value={v.sodium} onChange={e=>setV({...v, sodium:e.target.value})} /></label>
        <label>Symptoms<select value={v.symptoms} onChange={e=>setV({...v, symptoms:e.target.value})}><option value="none">None/mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select></label>
        <label>Serum osmolality<input type="number" value={v.serumOsm} onChange={e=>setV({...v, serumOsm:e.target.value})} /></label>
        <label>Urine osmolality<input type="number" value={v.urineOsm} onChange={e=>setV({...v, urineOsm:e.target.value})} /></label>
        <label>Urine sodium<input type="number" value={v.urineNa} onChange={e=>setV({...v, urineNa:e.target.value})} /></label>
      </div>
      <div className="check-grid">
        {['glucose','thiazide','lowSolute','polydipsia','hypovolemia','edema','siadh','adrenalThyroid','lowUric','ods'].map(k => <Check key={k} label={hypoLabels[k]} checked={v[k]} onChange={e=>setV({...v,[k]:e.target.checked})} />)}
      </div>
      <Output title="Hyponatremia output" items={out} />
    </section>
  );
}
const hypoLabels = { glucose:'Hyperglycemia/osmotic driver', thiazide:'Thiazide/diuretic effect', lowSolute:'Low solute intake', polydipsia:'Polydipsia suspected', hypovolemia:'Hypovolemia clues', edema:'Edema/low effective arterial volume', siadh:'SIADH clues', adrenalThyroid:'Adrenal/thyroid mimics excluded', lowUric:'Low uric acid / high FEUA support', ods:'ODS high-risk features' };

function Check({ label, checked, onChange }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={onChange} /><span>{label}</span></label>;
}

function Output({ title, items }) {
  return <div className="output"><h3>{title}</h3><ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul><p className="small">Clinician decision support only. Use local policy, patient-specific judgment, and specialist input when needed.</p></div>;
}

function Footer() {
  return <footer><span>© Fahad Almalki, MD</span><span><a href="mailto:contact@fahadalmalkimd.com">contact@fahadalmalkimd.com</a></span></footer>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
