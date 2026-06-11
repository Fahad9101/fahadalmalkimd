const { useEffect, useMemo, useState } = React;

const ROUTES = {
  home: 'home',
  antithrombotic: 'antithrombotic',
  af: 'af',
  hyponatremia: 'hyponatremia',
  crft: 'crft',
  qi: 'qi',
  vascular: 'vascular',
  publications: 'publications',
  contact: 'contact'
};

function getRoute() {
  const raw = window.location.hash.replace('#/', '').replace('#', '') || ROUTES.home;
  return Object.values(ROUTES).includes(raw) ? raw : ROUTES.home;
}

function App() {
  const [route, setRoute] = useState(getRoute());
  useEffect(() => {
    const onHash = () => { setRoute(getRoute()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return <>
    <Header />
    {route === ROUTES.home && <Home />}
    {route === ROUTES.antithrombotic && <AntithromboticTool />}
    {route === ROUTES.af && <AFTool />}
    {route === ROUTES.hyponatremia && <HyponatremiaTool />}
    {route === ROUTES.crft && <CRFT />}
    {route === ROUTES.qi && <QIProjects />}
    {route === ROUTES.vascular && <VascularMedicine />}
    {route === ROUTES.publications && <Publications />}
    {route === ROUTES.contact && <Contact />}
    <Footer />
  </>;
}

function Header(){
  return <header className="topbar"><div className="container nav">
    <a href="#/home" className="brand"><span className="logo">FA</span><span>Fahad Almalki, MD</span></a>
    <nav className="links">
      <a href="#/home">Home</a>
      <a href="#/home-tools">Tools</a>
      <a href="#/crft">CRFT</a>
      <a href="#/qi">QI Projects</a>
      <a href="#/vascular">Vascular Medicine</a>
      <a href="#/publications">Publications</a>
      <a className="pill" href="#/contact">Contact</a>
    </nav>
  </div></header>;
}

function Home(){
  return <>
    <section className="hero">
      <div className="container hero-inner">
        <h1>Fahad Almalki, MD</h1>
        <p className="subtitle">Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</p>
      </div>
    </section>
    <section id="home-tools"><div className="container">
      <div className="section-head"><div><span className="tag">Clinical Tools</span><h2>Clinician decision-support tools</h2><p>Tools open on their own pages and include a back-to-home button. They are built to support structured thinking, not replace clinical judgment, local policy, or specialist consultation.</p></div></div>
      <div className="grid">
        <ToolCard title="Antithrombotic Safety Assistant" tag="Vascular medicine" href="#/antithrombotic" text="Checklist for thrombosis on anticoagulation, LMWH/fondaparinux exposure, anti-Xa interpretation, antithrombin deficiency, PF4/HIT/VITT spectrum, APS, DOAC danger zones, and vascular red flags." />
        <ToolCard title="AF Anticoagulation Decision Aid" tag="Shared decision-making" href="#/af" text="Structured AF anticoagulation discussion: stroke risk, bleeding risk, anticoagulant selection, and warfarin-preferred situations." />
        <ToolCard title="Hyponatremia Diagnostic Engine" tag="GIM diagnostics" href="#/hyponatremia" text="Stepwise classification of hyponatremia using symptoms, tonicity, urine osmolality, urine sodium, uric acid/FEUA clues, and correction safety flags." />
      </div>
    </div></section>
    <section><div className="container grid two">
      <Card title="Clinical reasoning and education" text="CRFT is a structured framework for teaching residents how to frame problems, generate hypotheses, interpret data, plan management, anticipate complications, and reflect on thinking." href="#/crft" />
      <Card title="Quality and systems work" text="A professional home for QI work in CTU readmissions, VTE prophylaxis, perioperative MINS screening, and GIM diagnostic service development." href="#/qi" />
    </div></section>
  </>;
}

function ToolCard({title, tag, text, href}){return <article className="card"><span className="tag">{tag}</span><h3>{title}</h3><p>{text}</p><a className="btn" href={href}>Open tool</a></article>}
function Card({title,text,href}){return <article className="card"><h3>{title}</h3><p>{text}</p>{href && <a className="btn secondary" href={href}>Open</a>}</article>}
function BackBar(){return <div className="toolbar"><a className="btn secondary" href="#/home">← Back to Home</a><a className="btn secondary" href="#/home-tools">Tools</a></div>}
function PageTitle({title, subtitle}){return <div className="page-title"><div className="container"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>}

function AntithromboticTool(){
  const [state,setState]=useState({
    thrombosis:'new', exposure:'lmwh', platelets:'falling', antiXa:'unknown', at:'unknown', pf4:'possible', aps:'unknown', valve:'no', renal:'normal', pregnancy:'no', bleeding:'no', arterial:'no', skin:'no'
  });
  const update=(k,v)=>setState(s=>({...s,[k]:v}));
  const result=useMemo(()=>evaluateAntithrombotic(state),[state]);
  return <><PageTitle title="Antithrombotic Safety Assistant" subtitle="A clinician checklist for thrombosis on anticoagulation, LMWH/fondaparinux exposure, anti-Xa interpretation, antithrombin deficiency, PF4/HIT/VITT spectrum, APS, DOAC danger zones, and vascular medicine red flags." />
  <main className="container page"><BackBar/><div className="tool-layout">
    <div className="panel">
      <label>Clinical problem</label><select value={state.thrombosis} onChange={e=>update('thrombosis',e.target.value)}><option value="new">New/progressive thrombosis on therapy</option><option value="initial">Initial thrombosis decision</option><option value="bleeding">Bleeding or high bleeding concern</option></select>
      <label>Recent anticoagulant exposure</label><select value={state.exposure} onChange={e=>update('exposure',e.target.value)}><option value="lmwh">LMWH</option><option value="fondaparinux">Fondaparinux</option><option value="ufh">UFH</option><option value="doac">DOAC</option><option value="warfarin">Warfarin</option><option value="none">None/unclear</option></select>
      <label>Platelet pattern</label><select value={state.platelets} onChange={e=>update('platelets',e.target.value)}><option value="falling">Falling platelets / thrombocytopenia</option><option value="normal">Normal/stable platelets</option><option value="verylow">Very low platelets</option></select>
      <label>Anti-Xa interpretation</label><select value={state.antiXa} onChange={e=>update('antiXa',e.target.value)}><option value="unknown">Not measured / unknown</option><option value="low">Low anti-Xa despite dosing</option><option value="therapeutic">Therapeutic range</option><option value="high">High anti-Xa / accumulation concern</option></select>
      <label>Antithrombin status</label><select value={state.at} onChange={e=>update('at',e.target.value)}><option value="unknown">Unknown</option><option value="low">Low AT / suspected AT deficiency</option><option value="normal">Normal</option></select>
      <label>PF4/HIT/VITT spectrum</label><select value={state.pf4} onChange={e=>update('pf4',e.target.value)}><option value="possible">Possible: thrombosis + platelet fall</option><option value="unlikely">Unlikely</option><option value="confirmed">Positive/strongly suspected</option></select>
      <label>APS / valvular danger zones</label><select value={state.aps} onChange={e=>update('aps',e.target.value)}><option value="unknown">APS unknown</option><option value="suspected">APS suspected / triple-positive possible</option><option value="no">No APS concern</option></select>
      <div className="checks">
        <label className="check"><input type="checkbox" checked={state.valve==='yes'} onChange={e=>update('valve',e.target.checked?'yes':'no')}/> Rheumatic moderate-severe MS / mechanical valve / valvular AF concern</label>
        <label className="check"><input type="checkbox" checked={state.renal==='severe'} onChange={e=>update('renal',e.target.checked?'severe':'normal')}/> Severe renal impairment / drug accumulation concern</label>
        <label className="check"><input type="checkbox" checked={state.pregnancy==='yes'} onChange={e=>update('pregnancy',e.target.checked?'yes':'no')}/> Pregnancy or breastfeeding context</label>
        <label className="check"><input type="checkbox" checked={state.arterial==='yes'} onChange={e=>update('arterial',e.target.checked?'yes':'no')}/> Arterial thrombosis, limb ischemia, stroke, MI, unusual sites</label>
        <label className="check"><input type="checkbox" checked={state.skin==='yes'} onChange={e=>update('skin',e.target.checked?'yes':'no')}/> Skin necrosis, adrenal hemorrhage, catastrophic phenotype</label>
      </div>
    </div>
    <Output title={result.title} level={result.level} items={result.items} note={result.note}/>
  </div></main></>;
}
function evaluateAntithrombotic(s){
  const items=[]; let level='ok'; let title='Structured antithrombotic review';
  if(s.thrombosis==='new'){level='warn';title='Breakthrough thrombosis: verify drug, biology, and diagnosis';items.push('Confirm objective progression and timing: new clot vs residual clot vs extension. Review adherence, dosing, weight, renal function, absorption, interactions, and interruptions.');}
  if(['lmwh','ufh','fondaparinux'].includes(s.exposure) && s.at==='low'){level='warn';items.push('Low antithrombin can reduce heparin/LMWH activity and make anti-Xa interpretation tricky. Consider AT level, assay type, and whether the patient is truly anticoagulated.');}
  if(s.antiXa==='low'){level='warn';items.push('Low anti-Xa despite adequate dosing: check timing of sample, assay calibration, AT deficiency, weight, renal clearance, and administration errors.');}
  if(s.antiXa==='high'){level='warn';items.push('High anti-Xa: consider renal impairment, accumulation, bleeding risk, and whether dose/interval adjustment is needed.');}
  if((s.platelets==='falling' || s.pf4==='confirmed') && s.pf4!=='unlikely'){level='danger';title='PF4/HIT/VITT-spectrum must be actively addressed';items.push('Thrombosis plus platelet fall is a PF4-spectrum danger pattern. Use 4Ts/clinical probability, send appropriate PF4 testing, avoid heparin if HIT is plausible, and use a non-heparin anticoagulant pathway when indicated.');}
  if(s.exposure==='fondaparinux'){items.push('Fondaparinux is often used as a non-heparin option in HIT pathways, but anti-Xa testing must be fondaparinux-calibrated if used.');}
  if(s.aps==='suspected'){level='danger';items.push('APS danger zone: avoid assuming DOAC equivalence in high-risk APS, especially triple-positive or arterial events. Warfarin-based strategy is often preferred.');}
  if(s.valve==='yes'){level='danger';items.push('Valvular danger zone: mechanical valve or rheumatic moderate-to-severe mitral stenosis/valvular AF is not a routine DOAC situation. Warfarin is generally the anchor anticoagulant.');}
  if(s.renal==='severe'){level='warn';items.push('Renal dysfunction can alter LMWH, fondaparinux, and DOAC exposure. Reassess drug choice, dose, accumulation, and monitoring strategy.');}
  if(s.pregnancy==='yes'){level='warn';items.push('Pregnancy/breastfeeding changes anticoagulant selection. Avoid routine DOAC assumptions; LMWH/warfarin decisions depend on context and timing.');}
  if(s.arterial==='yes' || s.skin==='yes'){level='danger';items.push('Vascular red flag: arterial thrombosis, skin necrosis, adrenal hemorrhage, or catastrophic phenotype should trigger urgent senior/hematology/vascular input.');}
  if(items.length===0) items.push('No major red flag selected. Continue structured review of indication, drug, dose, renal function, interactions, platelet trend, and bleeding risk.');
  return {title,level,items,note:'Output is a bedside checklist, not a prescription. Reconcile with local protocols and specialist input when the phenotype is high-risk.'};
}

function AFTool(){
  const [age,setAge]=useState(65), [sex,setSex]=useState('male');
  const [risk,setRisk]=useState({chf:false,htn:false,dm:false,stroke:false,vascular:false});
  const [danger,setDanger]=useState({ms:false,mechanical:false,aps:false,bleed:false});
  const score=(age>=75?2:age>=65?1:0)+(sex==='female'?1:0)+(risk.chf?1:0)+(risk.htn?1:0)+(risk.dm?1:0)+(risk.stroke?2:0)+(risk.vascular?1:0);
  const highDanger=danger.ms||danger.mechanical||danger.aps;
  let rec= score>=2 ? 'Anticoagulation usually favored if bleeding risk is acceptable.' : score===1 ? 'Borderline zone: individualize with patient values and risk modifiers.' : 'Low score: routine anticoagulation often not indicated.';
  if(highDanger) rec='DOAC danger zone detected. Consider warfarin-based pathway/specialist input depending on the specific condition.';
  return <><PageTitle title="AF Anticoagulation Decision Aid" subtitle="Structured AF anticoagulation discussion for stroke risk, bleeding risk, and anticoagulant selection."/><main className="container page"><BackBar/><div className="tool-layout"><div className="panel">
    <label>Age</label><input type="number" value={age} onChange={e=>setAge(Number(e.target.value||0))}/>
    <label>Sex category</label><select value={sex} onChange={e=>setSex(e.target.value)}><option value="male">Male</option><option value="female">Female</option></select>
    <div className="checks">{[['chf','Heart failure'],['htn','Hypertension'],['dm','Diabetes'],['stroke','Prior stroke/TIA/systemic embolism'],['vascular','Vascular disease']].map(([k,t])=><label className="check" key={k}><input type="checkbox" checked={risk[k]} onChange={e=>setRisk({...risk,[k]:e.target.checked})}/>{t}</label>)}</div>
    <label>Danger-zone checks</label><div className="checks">{[['ms','Rheumatic moderate-to-severe mitral stenosis'],['mechanical','Mechanical valve'],['aps','High-risk APS concern'],['bleed','Active bleeding / very high bleeding risk']].map(([k,t])=><label className="check" key={k}><input type="checkbox" checked={danger[k]} onChange={e=>setDanger({...danger,[k]:e.target.checked})}/>{t}</label>)}</div>
  </div><div className="panel"><h2>Output</h2><div className={"result "+(highDanger?'danger':score>=2?'ok':'warn')}><h3>CHA₂DS₂-VASc: {score}</h3><p>{rec}</p></div><ul className="list"><li>Use this as a shared-decision structure, not a stand-alone prescription.</li><li>Bleeding risk should identify modifiable risks, not automatically deny anticoagulation.</li><li>Document patient preference, rationale, and danger-zone exclusions.</li></ul></div></div></main></>;
}

function HyponatremiaTool(){
  const [s,setS]=useState({na:125,symptoms:'mild',serumOsm:'low',urineOsm:'high',urineNa:'high',edema:false,hypovolemia:false,thiazide:false,lowSolute:false,polydipsia:false,siadh:true,adrenal:false,thyroid:false,ods:false});
  const update=(k,v)=>setS(x=>({...x,[k]:v}));
  const out=useMemo(()=>evaluateHypo(s),[s]);
  return <><PageTitle title="Hyponatremia Diagnostic Engine" subtitle="Classify hyponatremia using symptoms, tonicity, urine osmolality, urine sodium, clinical volume clues, endocrine mimics, uric acid/FEUA clues, and correction safety flags."/><main className="container page"><BackBar/><div className="tool-layout"><div className="panel">
    <label>Serum sodium</label><input type="number" value={s.na} onChange={e=>update('na',Number(e.target.value||0))}/>
    <label>Symptoms</label><select value={s.symptoms} onChange={e=>update('symptoms',e.target.value)}><option value="severe">Seizure/coma/severe neuro symptoms</option><option value="moderate">Moderate symptoms</option><option value="mild">Mild/asymptomatic</option></select>
    <label>Serum osmolality</label><select value={s.serumOsm} onChange={e=>update('serumOsm',e.target.value)}><option value="low">Low hypotonic</option><option value="normal">Normal/pseudohyponatremia</option><option value="high">High/translocational</option><option value="unknown">Unknown</option></select>
    <label>Urine osmolality</label><select value={s.urineOsm} onChange={e=>update('urineOsm',e.target.value)}><option value="low">≤100</option><option value="high">>100</option><option value="unknown">Unknown</option></select>
    <label>Urine sodium</label><select value={s.urineNa} onChange={e=>update('urineNa',e.target.value)}><option value="low">Low &lt;30</option><option value="high">High ≥30</option><option value="unknown">Unknown</option></select>
    <div className="checks">{[['edema','Edema/heart failure/cirrhosis/nephrosis'],['hypovolemia','Hypovolemia GI/renal loss'],['thiazide','Thiazide/diuretic effect'],['lowSolute','Low solute intake/beer potomania'],['polydipsia','Primary polydipsia'],['siadh','SIADH clues'],['adrenal','Adrenal insufficiency not excluded'],['thyroid','Severe hypothyroidism not excluded'],['ods','ODS high-risk: alcoholism, malnutrition, liver disease, hypokalemia, very low Na']].map(([k,t])=><label className="check" key={k}><input type="checkbox" checked={s[k]} onChange={e=>update(k,e.target.checked)}/>{t}</label>)}</div>
  </div><Output title={out.title} level={out.level} items={out.items} note={out.note}/></div></main></>;
}
function evaluateHypo(s){
  let level='ok', title='Most likely pathway', items=[];
  if(s.symptoms==='severe'){level='danger';title='Severe symptomatic hyponatremia: treat as emergency';items.push('Prioritize immediate safety and controlled hypertonic saline pathway per local protocol. Do not wait for full etiologic workup if severe neurologic symptoms are present.');}
  if(s.serumOsm==='normal'){level='warn';items.push('Normal serum osmolality: consider pseudohyponatremia and lab artifact. Confirm lipids/protein/direct ISE context.');}
  if(s.serumOsm==='high'){level='warn';items.push('High serum osmolality: think translocational hyponatremia such as hyperglycemia or osmotic agents. Correct sodium for glucose.');}
  if(s.serumOsm==='low'){
    if(s.urineOsm==='low') items.push('Urine osmolality ≤100 suggests suppressed ADH: primary polydipsia or low-solute intake are key considerations.');
    if(s.urineOsm==='high' && s.urineNa==='low') items.push('Hypotonic hyponatremia with concentrated urine and low urine sodium suggests low effective arterial volume: hypovolemia, HF, cirrhosis, or nephrosis depending on exam.');
    if(s.urineOsm==='high' && s.urineNa==='high') items.push('Hypotonic hyponatremia with concentrated urine and high urine sodium suggests SIADH, adrenal insufficiency, diuretic effect, renal salt wasting, or endocrine mimics.');
  }
  if(s.thiazide){level='warn';items.push('Thiazide-associated hyponatremia can mimic SIADH. Stop thiazide and monitor correction trajectory carefully.');}
  if(s.lowSolute) items.push('Low-solute intake can correct rapidly once solute is given. Watch for overcorrection.');
  if(s.siadh) items.push('SIADH is a diagnosis of pattern plus exclusion: review medications, CNS/pulmonary disease, pain/nausea, malignancy, adrenal and thyroid status. Low uric acid/raised FEUA can support but not replace the clinical diagnosis.');
  if(s.adrenal||s.thyroid){level='warn';items.push('Do not label SIADH until adrenal insufficiency and severe hypothyroidism are considered/excluded.');}
  if(s.ods||s.na<120){level='danger';items.push('High ODS-risk or Na <120: use conservative correction targets, frequent sodium checks, and consider desmopressin clamp strategy in high-risk trajectories.');}
  if(items.length===0) items.push('Enter serum/urine osmolality and urine sodium to classify the pathway.');
  return {title,level,items,note:'Correction safety often matters more than making the perfect label in the first hour. Reassess after each intervention.'}
}

function Output({title,level,items,note}){return <div className="panel"><h2>Output</h2><div className={`result ${level}`}><h3>{title}</h3><ul className="list">{items.map((it,i)=><li key={i}>{it}</li>)}</ul>{note&&<p className="small"><strong>Note:</strong> {note}</p>}</div><button className="btn secondary" onClick={()=>navigator.clipboard?.writeText([title,...items].join('\n- '))}>Copy output</button></div>}

function CRFT(){return <><PageTitle title="CRFT" subtitle="Clinical Reasoning Framework for Teaching."/><main className="container page"><BackBar/><div className="grid two"><Card title="Purpose" text="CRFT makes clinical reasoning observable and teachable through structured cases, scoring, feedback, and reflection."/><Card title="Six domains" text="Problem framing, hypothesis generation, data interpretation, management planning, anticipation, and metacognition."/><Card title="Educational use" text="Designed for resident education, calibration, feedback, and tracking reasoning development over time."/><Card title="Current status" text="Active development as a teaching and quality-improvement platform."/></div></main></>}
function QIProjects(){return <><PageTitle title="QI Projects" subtitle="Inpatient internal medicine, thrombosis prevention, perioperative medicine, diagnostic safety, and transitions of care."/><main className="container page"><BackBar/><div className="grid two"><Card title="CTU Early Readmission & Transitional Care" text="Identifying preventable patterns in early readmissions: diagnostic uncertainty, medication gaps, pending investigations, social barriers, and discharge readiness."/><Card title="VTE Prophylaxis Standardization" text="Clarifying prophylaxis status, dashboard states, contraindications, and reliability of inpatient VTE prevention processes."/><Card title="Perioperative MINS Screening" text="Improving detection of myocardial injury after non-cardiac surgery in high-risk patients."/><Card title="Internal Medicine Diagnostic Service Scope" text="Defining GIM as a diagnostic and admitting service for undifferentiated, complex, and multisystem presentations."/></div></main></>}
function VascularMedicine(){return <><PageTitle title="Vascular Medicine" subtitle="Thrombosis, antithrombotic therapy, PAD, perioperative vascular risk, and complex multisystem vascular presentations."/><main className="container page"><BackBar/><div className="grid two"><Card title="Focus areas" text="Venous thromboembolism, anticoagulation, antiplatelet therapy, PAD, thrombosis with thrombocytopenia, perioperative vascular risk, and vascular risk reduction."/><Card title="Tools" text="The Antithrombotic Safety Assistant is the main vascular medicine clinical tool on this site." href="#/antithrombotic"/></div></main></>}
function Publications(){return <><PageTitle title="Publications" subtitle="Selected academic outputs, abstracts, presentations, QI reports, and digital clinical tools."/><main className="container page"><BackBar/><div className="grid"><Card title="Publications" text="Coming soon."/><Card title="Presentations" text="Coming soon."/><Card title="QI reports and digital tools" text="Coming soon."/></div></main></>}
function Contact(){return <><PageTitle title="Contact" subtitle="Professional, academic, educational, and quality-improvement inquiries."/><main className="container page"><BackBar/><div className="grid two"><Card title="Public contact" text="contact@fahadalmalkimd.com" href="mailto:contact@fahadalmalkimd.com"/><Card title="Direct professional correspondence" text="fahad@fahadalmalkimd.com" href="mailto:fahad@fahadalmalkimd.com"/></div></main></>}
function Footer(){return <footer className="footer"><div className="container footgrid"><div><strong>Fahad Almalki, MD</strong><div className="small">Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</div></div><div className="small">Clinical tools are educational decision-support aids and do not replace clinical judgment or local policy.</div></div></footer>}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
