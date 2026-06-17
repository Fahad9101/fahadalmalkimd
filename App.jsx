/* FahadAlmalkiMD site app. IMPORTANT: no import/export statements. GitHub Pages runs this in the browser via Babel. */
const { useMemo, useState } = React;

const LOGIN_USER = "fahad";
const LOGIN_PASS = "ChangeThisPassword2026!";

const toolGroups = [
  {
    title: "Vascular Medicine Clinic Pathways",
    tools: [
      { id: "pad-suspected", title: "Suspected PAD Clinic Pathway", desc: "A guided pathway for leg symptoms, ABI/TBI logic, red flags, mimics, and referral urgency." },
      { id: "pad-confirmed", title: "Confirmed PAD Clinic Pathway", desc: "Standardized PAD visit: phenotype, GDMT, exercise, foot care, antithrombotic considerations, and revascularization triggers." },
      { id: "thrombosis-clinic", title: "Thrombosis Clinic Pathway", desc: "New and chronic VTE/arterial thrombosis visits with duration, safety, APS/MPN/PNH/Lp(a), and follow-up prompts." }
    ]
  },
  {
    title: "Thrombosis / Antithrombotic Safety",
    tools: [
      { id: "af", title: "AF Anticoagulation Decision Aid", desc: "CHA₂DS₂-VASc, bleeding risk, DOAC vs warfarin danger zones, and shared decision note." },
      { id: "antithrombotic", title: "Antithrombotic Safety Assistant", desc: "HIT/PF4/VITT, anti-Xa interpretation, antithrombin deficiency, APS, DOAC danger zones, and vascular red flags." },
      { id: "periop-doac", title: "Perioperative DOAC Interruption Planner", desc: "Procedure bleeding risk, PAUSE-style interruption, renal function, neuraxial warning, and restart timing." },
      { id: "postop-vte", title: "Post-op DVT/VTE Prophylaxis Assistant", desc: "Orthopedic and non-orthopedic surgical prophylaxis pathway with bleeding and renal safety checks." }
    ]
  },
  {
    title: "General Internal Medicine Diagnostic Reasoning",
    tools: [
      { id: "postop-troponin", title: "Post-op Troponin Pathway", desc: "Guided MINS pathway: screen vs elevated troponin, RCRI details, BNP/NT-proBNP, troponin trend, ECG, symptoms, and triggers." },
      { id: "hyponatremia", title: "Hyponatremia Diagnostic Engine", desc: "Tonicity-first pathway, urine osm/Na, SIADH mimics, low-solute/polydipsia, and overcorrection safety." },
      { id: "diarrhea", title: "Diarrhea Diagnostic Pathway", desc: "Danger-first pathway for acute/chronic diarrhea, watery/inflammatory/fatty phenotype, meds, C. diff, bile acid, pancreatic, microscopic colitis, and celiac clues." },
      { id: "hypokalemia", title: "Hypokalemia + Acid–Base Engine", desc: "GI vs renal losses, acidosis/alkalosis, urine K/Cl, RTA, diuretics, mineralocorticoid, and magnesium reminders." },
      { id: "proteinuria", title: "Proteinuria Interpreter", desc: "Proteinuria phenotype, active sediment flags, nephrotic-range logic, and when albumin may remain normal." },
      { id: "cirrhosis", title: "Coagulation in Cirrhosis", desc: "Rebalanced hemostasis, INR pitfalls, fibrinogen/platelets, TEG/ROTEM, vitamin K, and thrombosis despite high INR." }
    ]
  },
  {
    title: "CTU / Rounding Standard",
    tools: [
      { id: "ctu-review", title: "CTU Daily Review Checklist", desc: "Diagnostic clarity, overnight danger, lines/antibiotics/VTE prophylaxis, discharge barriers, pending tests, and follow-up." },
      { id: "diagnostic-uncertainty", title: "Diagnostic Uncertainty Pathway", desc: "What syndrome is this, what can harm the patient, what would change my mind, and what must be watched overnight." },
      { id: "readmission", title: "Discharge Readiness + Readmission Risk", desc: "A standard for discharge readiness, diagnostic uncertainty, medication risk, follow-up gaps, and early readmission prevention." }
    ]
  }
];

function App() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || 'home');
  const [authed, setAuthed] = useState(sessionStorage.getItem('fahad-tools-auth') === 'yes');

  const go = (next) => {
    window.location.hash = next;
    setRoute(next);
    window.scrollTo(0, 0);
  };

  window.onhashchange = () => setRoute(window.location.hash.replace('#', '') || 'home');

  const selectedTool = useMemo(() => toolGroups.flatMap(g => g.tools).find(t => t.id === route), [route]);

  return (
    <div>
      <Header go={go} authed={authed} setAuthed={setAuthed} />
      {route === 'home' && <Home go={go} authed={authed} setAuthed={setAuthed} />}
      {route === 'pathways' && <Protected authed={authed} setAuthed={setAuthed}><PathwayLibrary go={go} /></Protected>}
      {selectedTool && <Protected authed={authed} setAuthed={setAuthed}><ToolPage tool={selectedTool} go={go} /></Protected>}
      {!selectedTool && route !== 'home' && route !== 'pathways' && <NotFound go={go} />}
    </div>
  );
}

function Header({ go, authed, setAuthed }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => go('home')}><span className="logo">FA</span><span>Fahad Almalki, MD</span></button>
      <nav>
        <button onClick={() => go('home')}>Home</button>
        <button onClick={() => go('pathways')}>Clinical Pathways</button>
        <a href="mailto:contact@fahadalmalkimd.com">Contact</a>
        {authed && <button onClick={() => { sessionStorage.removeItem('fahad-tools-auth'); setAuthed(false); go('home'); }}>Sign out</button>}
      </nav>
    </header>
  );
}

function Home({ go, authed, setAuthed }) {
  return (
    <main>
      <section className="hero minimalHero">
        <div className="heroInner">
          <p className="eyebrow">General Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</p>
        </div>
      </section>
      <section className="section twoCol">
        <div>
          <h1>Clinical pathways for safer bedside decisions.</h1>
          <p className="lead">A protected clinical operating system for vascular medicine, thrombosis, and general internal medicine reasoning.</p>
          <div className="buttonRow"><button className="primary" onClick={() => go('pathways')}>Open Clinical Pathways</button></div>
        </div>
        <div className="card softCard">
          <h3>Pathway standard</h3>
          <ul>
            <li>Phenotype first</li>
            <li>Danger screen before details</li>
            <li>Minimum standard workup</li>
            <li>Default management logic</li>
            <li>Escalation triggers</li>
            <li>Copy-ready note</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function Protected({ authed, setAuthed, children }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [bad, setBad] = useState(false);
  if (authed) return children;
  return (
    <main className="section narrow">
      <div className="card loginCard">
        <h2>Protected clinical pathway library</h2>
        <p className="muted">Home is public. Clinical pathways require access.</p>
        <label>Username<input value={u} onChange={e => setU(e.target.value)} /></label>
        <label>Password<input type="password" value={p} onChange={e => setP(e.target.value)} /></label>
        {bad && <p className="warning">Incorrect username or password.</p>}
        <button className="primary" onClick={() => {
          if (u === LOGIN_USER && p === LOGIN_PASS) { sessionStorage.setItem('fahad-tools-auth','yes'); setAuthed(true); }
          else setBad(true);
        }}>Enter</button>
        <p className="tiny">Static GitHub Pages protection is a soft gate only. Use Cloudflare Access later for real authentication.</p>
      </div>
    </main>
  );
}

function PathwayLibrary({ go }) {
  return (
    <main className="section">
      <h1>Clinical Pathway Library</h1>
      <p className="lead">Guided tools designed to walk a junior clinician from patient phenotype to danger screen, minimum standard workup, management logic, escalation, and note.</p>
      {toolGroups.map(group => <section key={group.title} className="toolGroup"><h2>{group.title}</h2><div className="grid">{group.tools.map(t => <button className="toolCard" key={t.id} onClick={() => go(t.id)}><h3>{t.title}</h3><p>{t.desc}</p></button>)}</div></section>)}
    </main>
  );
}

function ToolPage({ tool, go }) {
  if (tool.id === 'postop-troponin') return <PostopTroponinPathway go={go} />;
  return (
    <main className="section">
      <button className="back" onClick={() => go('pathways')}>← Back to pathways</button>
      <div className="toolHeader"><p className="eyebrow">Clinical pathway</p><h1>{tool.title}</h1><p className="lead">{tool.desc}</p></div>
      <div className="card">
        <h2>Guided pathway framework</h2>
        <ol>
          <li><b>Choose the clinical scenario.</b> Why are you using this pathway?</li>
          <li><b>Screen for danger.</b> What cannot be missed today?</li>
          <li><b>Classify the phenotype.</b> What patient group is this?</li>
          <li><b>Complete the minimum standard.</b> What must be checked before leaving the encounter?</li>
          <li><b>Act and escalate.</b> What is the safest next step?</li>
          <li><b>Document clearly.</b> Copy-ready assessment and plan.</li>
        </ol>
        <p className="muted">This pathway shell is active. The full guided logic for this tool can be added next inside App.jsx without changing the rest of the site.</p>
      </div>
    </main>
  );
}

function PostopTroponinPathway({ go }) {
  const [scenario, setScenario] = useState('screen');
  const [procedure, setProcedure] = useState('major-orthopedic');
  const [urgent, setUrgent] = useState(false);
  const [age, setAge] = useState('65');
  const [poorMets, setPoorMets] = useState(false);
  const [frail, setFrail] = useState(false);
  const [asa, setAsa] = useState('3');
  const [ihd, setIhd] = useState(false);
  const [hf, setHf] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [insulin, setInsulin] = useState(false);
  const [crHigh, setCrHigh] = useState(false);
  const [bnpType, setBnpType] = useState('ntprobnp');
  const [bnp, setBnp] = useState('');
  const [trop, setTrop] = useState('');
  const [uln, setUln] = useState('');
  const [delta, setDelta] = useState('');
  const [ecg, setEcg] = useState(false);
  const [symptoms, setSymptoms] = useState(false);
  const [unstable, setUnstable] = useState(false);
  const [triggers, setTriggers] = useState({ hypotension:false, tachy:false, hypoxia:false, anemia:false, sepsis:false, pe:false, aki:false });

  const highRiskRcri = ['major-abdominal','intrathoracic','major-vascular'].includes(procedure);
  const rcri = [highRiskRcri, ihd, hf, stroke, insulin, crHigh].filter(Boolean).length;
  const ageNum = Number(age || 0);
  const bnpNum = Number(bnp || 0);
  const biomarkerHigh = bnp && ((bnpType === 'ntprobnp' && bnpNum >= 300) || (bnpType === 'bnp' && bnpNum >= 92));
  const tropNum = Number(trop || 0), ulnNum = Number(uln || 0), deltaNum = Number(delta || 0);
  const tropElevated = trop && uln && tropNum > ulnNum;
  const dynamic = delta && uln && Math.abs(deltaNum) >= Math.max(5, 0.2 * ulnNum);
  const red = symptoms || ecg || unstable;
  const triggerList = Object.entries(triggers).filter(([,v]) => v).map(([k]) => k);

  let surveillance = 'Post-op troponin surveillance is not routinely triggered by the available data.';
  if (rcri >= 1 || ageNum >= 65 || poorMets || frail || biomarkerHigh || urgent || Number(asa) >= 3) surveillance = 'Post-op troponin surveillance is reasonable/recommended depending on local perioperative pathway because clinical or biomarker risk is elevated.';
  if (biomarkerHigh || rcri >= 2 || ageNum >= 75 || urgent || frail) surveillance = 'Post-op troponin surveillance is strongly favored: the patient has elevated perioperative risk by clinical features and/or BNP/NT-proBNP.';

  let interpretation = 'No post-op troponin interpretation yet. Use this pathway to decide surveillance or enter troponin data if elevated.';
  if (tropElevated) interpretation = 'Post-op troponin is above the assay 99th percentile/ULN. This is myocardial injury until proven otherwise; interpret with ECG, symptoms, trajectory, and perioperative triggers.';
  if (tropElevated && red) interpretation = 'Troponin elevation plus ischemic symptoms, dynamic ECG change, or instability: treat as possible perioperative MI/type 1 or high-risk myocardial injury until assessed.';
  else if (tropElevated && triggerList.length) interpretation = 'Troponin elevation with supply–demand triggers: MINS or type 2 myocardial injury is plausible; correct triggers and assess ischemic evidence.';
  else if (tropElevated && dynamic) interpretation = 'Troponin elevation with a dynamic change supports acute myocardial injury rather than chronic elevation.';

  const actions = [];
  if (red) actions.push('Urgent ECG review, repeat troponin, bedside assessment, hemodynamic optimization, and consider cardiology/critical care depending severity.');
  if (tropElevated) actions.push('Repeat troponin to define rise/fall and obtain/review ECG; evaluate for ischemia and competing triggers.');
  if (triggerList.length) actions.push('Correct reversible oxygen supply–demand triggers: hypotension, tachyarrhythmia, hypoxia, anemia/bleeding, sepsis, PE, AKI, and pain/stress.');
  if (biomarkerHigh || rcri >= 1) actions.push('Ensure post-op surveillance plan, medication review, and discharge/follow-up plan if troponin positive.');
  if (!actions.length) actions.push('If clinically stable and low risk, routine troponin surveillance may not be needed; reassess if symptoms or instability develop.');

  return (
    <main className="section">
      <button className="back" onClick={() => go('pathways')}>← Back to pathways</button>
      <div className="toolHeader"><p className="eyebrow">Guided GIM/perioperative pathway</p><h1>Post-op Troponin Pathway</h1><p className="lead">Start with the clinical question, then move through procedure stress, patient reserve, RCRI, BNP/NT-proBNP, troponin interpretation, red flags, and competing triggers.</p></div>
      <div className="pathwayLayout">
        <div className="card formCard">
          <h2>1. Why are you here?</h2>
          <select value={scenario} onChange={e => setScenario(e.target.value)}><option value="screen">Should I order post-op troponin surveillance?</option><option value="elevated">Troponin is already elevated after surgery</option><option value="unstable">Symptoms / ECG change / instability</option><option value="discharge">Discharge or follow-up plan after troponin</option></select>
          <p className="help">This prevents starting with a number before knowing whether the question is screening, interpretation, emergency triage, or follow-up.</p>

          <h2>2. Procedure and patient reserve</h2>
          <label>Procedure phenotype<select value={procedure} onChange={e => setProcedure(e.target.value)}><option value="low">Low-risk/minor/endoscopy/cataract/superficial</option><option value="major-orthopedic">Major orthopedic</option><option value="hip-fracture">Hip fracture / urgent orthopedic trauma</option><option value="major-abdominal">Major abdominal / intraperitoneal</option><option value="intrathoracic">Intrathoracic</option><option value="major-vascular">Major vascular / suprainguinal vascular</option><option value="neuro-spine">Neurosurgery/spine</option><option value="transplant">Transplant / major high-stress surgery</option></select></label>
          <p className="help">RCRI “high-risk surgery” is not any big surgery. It classically means intraperitoneal, intrathoracic, or suprainguinal vascular surgery.</p>
          <div className="checks"><label><input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} /> Urgent/emergency surgery</label><label>Age <input value={age} onChange={e => setAge(e.target.value)} /></label><label>ASA <select value={asa} onChange={e => setAsa(e.target.value)}><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label><label><input type="checkbox" checked={poorMets} onChange={e => setPoorMets(e.target.checked)} /> Poor/unknown functional capacity</label><label><input type="checkbox" checked={frail} onChange={e => setFrail(e.target.checked)} /> Frailty/low physiologic reserve</label></div>

          <h2>3. RCRI details</h2>
          <div className="checks"><label><input type="checkbox" checked={highRiskRcri} readOnly /> RCRI high-risk surgery</label><label><input type="checkbox" checked={ihd} onChange={e => setIhd(e.target.checked)} /> Ischemic heart disease</label><label><input type="checkbox" checked={hf} onChange={e => setHf(e.target.checked)} /> Heart failure</label><label><input type="checkbox" checked={stroke} onChange={e => setStroke(e.target.checked)} /> Stroke/TIA</label><label><input type="checkbox" checked={insulin} onChange={e => setInsulin(e.target.checked)} /> Insulin-treated diabetes</label><label><input type="checkbox" checked={crHigh} onChange={e => setCrHigh(e.target.checked)} /> Creatinine &gt;177 µmol/L / &gt;2 mg/dL</label></div>

          <h2>4. BNP/NT-proBNP and troponin</h2>
          <div className="inline"><label>Biomarker<select value={bnpType} onChange={e => setBnpType(e.target.value)}><option value="ntprobnp">NT-proBNP</option><option value="bnp">BNP</option></select></label><label>Value<input value={bnp} onChange={e => setBnp(e.target.value)} placeholder="optional" /></label></div>
          <p className="help">Useful threshold: NT-proBNP ≥300 ng/L or BNP ≥92 ng/L supports higher perioperative risk and surveillance.</p>
          <div className="inline"><label>Troponin<input value={trop} onChange={e => setTrop(e.target.value)} placeholder="post-op value" /></label><label>ULN/99th percentile<input value={uln} onChange={e => setUln(e.target.value)} placeholder="assay ULN" /></label><label>Delta/change<input value={delta} onChange={e => setDelta(e.target.value)} placeholder="optional" /></label></div>

          <h2>5. Red flags and triggers</h2>
          <div className="checks"><label><input type="checkbox" checked={symptoms} onChange={e => setSymptoms(e.target.checked)} /> Ischemic symptoms</label><label><input type="checkbox" checked={ecg} onChange={e => setEcg(e.target.checked)} /> Dynamic ECG changes</label><label><input type="checkbox" checked={unstable} onChange={e => setUnstable(e.target.checked)} /> Instability / shock / acute HF / malignant arrhythmia</label></div>
          <div className="checks compact">{Object.keys(triggers).map(k => <label key={k}><input type="checkbox" checked={triggers[k]} onChange={e => setTriggers({...triggers, [k]: e.target.checked})} /> {k}</label>)}</div>
        </div>
        <div className="resultStack">
          <div className="card result"><h2>Output</h2><p><b>RCRI:</b> {rcri} / 6</p><p><b>Surveillance:</b> {surveillance}</p><p><b>Interpretation:</b> {interpretation}</p>{biomarkerHigh && <p className="tag warn">BNP/NT-proBNP high-risk threshold met</p>}{red && <p className="tag danger">Red flag pathway</p>}</div>
          <div className="card"><h3>Minimum standard for juniors</h3><ul>{actions.map((a,i) => <li key={i}>{a}</li>)}</ul></div>
          <div className="card"><h3>Teaching pearl</h3><p>Do not call every post-op troponin “NSTEMI.” First decide whether the patient has ischemic symptoms/ECG instability, then look for perioperative supply–demand triggers. MINS is myocardial injury after non-cardiac surgery judged to be ischemic and prognostically important, even without classic chest pain.</p></div>
          <div className="card note"><h3>Copy-ready note</h3><p>Post-op troponin pathway reviewed. Clinical question: {scenario}. Procedure phenotype: {procedure}; RCRI {rcri}/6. BNP/NT-proBNP {bnp || 'not available'}. Troponin {trop || 'not entered'} with ULN {uln || 'not entered'}. Red flags: {red ? 'present' : 'not identified'}. Competing triggers: {triggerList.length ? triggerList.join(', ') : 'none selected'}. Impression: {interpretation} Plan: {actions.join(' ')}</p></div>
        </div>
      </div>
    </main>
  );
}

function NotFound({ go }) { return <main className="section"><h1>Page not found</h1><button className="primary" onClick={() => go('home')}>Go home</button></main>; }

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
