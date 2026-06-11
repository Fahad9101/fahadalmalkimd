const { useMemo, useState } = React;

const tools = [
  {
    id: 'antithrombotic',
    title: 'Antithrombotic Safety Assistant',
    label: 'Vascular medicine tool',
    subtitle: 'A bedside clinician assistant for thrombosis on anticoagulation, heparin/LMWH/fondaparinux exposure, anti-Xa interpretation, antithrombin physiology, PF4/HIT/VITT spectrum, APS, DOAC danger zones, and vascular red flags.'
  },
  {
    id: 'af',
    title: 'AF Anticoagulation Decision Aid',
    label: 'Shared decision aid',
    subtitle: 'A bedside anticoagulation discussion tool for atrial fibrillation using CHA₂DS₂-VASc, HAS-BLED, estimated 1-, 5-, and 10-year risk framing, and warfarin-vs-DOAC danger-zone checks.'
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
function pct(x) {
  if (!Number.isFinite(x)) return '—';
  return `${x.toFixed(x < 10 ? 1 : 0)}%`;
}
function cumRisk(annualPct, years) {
  const p = annualPct / 100;
  return (1 - Math.pow(1 - p, years)) * 100;
}
function clampScore(score, max) { return Math.max(0, Math.min(max, Number(score) || 0)); }

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
        {links.map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}</button>)}
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
      <section id="home" className="hero compact-hero">
        <div className="hero-inner">
          <h1>Fahad Almalki, MD</h1>
          <p className="hero-subtitle">Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</p>
        </div>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">Professional platform</p>
          <h2>A home for clinical tools, teaching, and systems work.</h2>
          <p>This site brings together practical decision-support tools, clinical reasoning education, quality-improvement work, and vascular medicine resources.</p>
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
        <p className="section-lead">Tools open as separate pages inside the app. Each page includes a Back to Home button.</p>
        <div className="cards">
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      <section id="crft" className="section">
        <p className="eyebrow">Education</p>
        <h2>CRFT — Clinical Reasoning Framework for Teaching</h2>
        <p>CRFT is an educational project designed to help residents practice, structure, and improve clinical reasoning using daily cases, domain-based scoring, feedback, and reflection.</p>
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
        <p>Areas of interest include venous thromboembolism, antithrombotic therapy, peripheral artery disease, perioperative vascular risk, thrombosis with thrombocytopenia, and complex vascular presentations in internal medicine.</p>
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
function MiniCard({ title, text }) { return <article className="card"><h3>{title}</h3><p>{text}</p></article>; }
function InfoBlock({ title, items }) { return <div className="info-block"><h3>{title}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>; }

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
function NotFound() { return <main className="tool-page"><section className="tool-hero"><button className="back" onClick={() => navigate('home')}>← Back to Home</button><h1>Page not found</h1></section></main>; }

const chaRisk = {0:0.2,1:0.6,2:2.2,3:3.2,4:4.8,5:7.2,6:9.7,7:11.2,8:10.8,9:12.2};
const hasBledRisk = {0:1.1,1:1.0,2:1.9,3:3.7,4:8.7,5:12.5,6:12.5,7:12.5,8:12.5,9:12.5};
const anticoagRRR = 0.64;

function AFTool() {
  const [v, setV] = useState({
    sex:'male', age:'0', chf:false, htn:false, dm:false, stroke:false, vascular:false,
    renal:false, liver:false, bleed:false, labile:false, drugs:false, alcohol:false,
    ms:false, mechanical:false, rheumatic:false, lvad:false, pregnancy:false, severeRenal:false, severeLiver:false,
    interacting:false, absorption:false, falls:false, anemia:false, cancer:false, patientValues:'stroke-prevention'
  });
  const age = Number(v.age);
  const cha = (v.chf?1:0)+(v.htn?1:0)+(age>=75?2:age>=65?1:0)+(v.dm?1:0)+(v.stroke?2:0)+(v.vascular?1:0)+(v.sex==='female'?1:0);
  const chaNonSex = cha - (v.sex==='female'?1:0);
  const hasbled = (v.htn?1:0)+(v.renal?1:0)+(v.liver?1:0)+(v.stroke?1:0)+(v.bleed?1:0)+(v.labile?1:0)+(age>65?1:0)+(v.drugs?1:0)+(v.alcohol?1:0);
  const annualStroke = chaRisk[clampScore(cha,9)] ?? 0;
  const annualBleed = hasBledRisk[clampScore(hasbled,9)] ?? 12.5;
  const treatedAnnual = annualStroke * (1 - anticoagRRR);
  const oneArr = annualStroke - treatedAnnual;
  const riskRows = [1,5,10].map(y => ({
    years:y,
    strokeNo: cumRisk(annualStroke,y),
    strokeOn: cumRisk(treatedAnnual,y),
    strokeAvoid: cumRisk(annualStroke,y) - cumRisk(treatedAnnual,y),
    bleed: cumRisk(annualBleed,y)
  }));
  const danger = [];
  if (v.mechanical) danger.push('Mechanical valve: warfarin pathway; DOACs are not appropriate.');
  if (v.ms || v.rheumatic) danger.push('Moderate-to-severe mitral stenosis or rheumatic AF: warfarin preferred over DOAC.');
  if (v.lvad) danger.push('LVAD / complex device anticoagulation: follow device-specific anticoagulation pathway.');
  if (v.pregnancy) danger.push('Pregnancy/breastfeeding context: do not default to DOAC; use pregnancy/lactation-specific guidance.');
  if (v.severeRenal) danger.push('Severe renal dysfunction/dialysis/AKI: verify agent-specific renal eligibility and dose.');
  if (v.severeLiver) danger.push('Significant liver disease/coagulopathy: DOAC suitability and bleeding risk require careful review.');
  if (v.interacting) danger.push('Strong P-gp/CYP3A4 interacting drugs: verify DOAC exposure risk or reduced efficacy.');
  if (v.absorption) danger.push('Unreliable GI absorption/bariatric surgery/short gut/active vomiting: DOAC exposure may be unreliable.');
  const rec = getAfRecommendation(v, cha, chaNonSex, hasbled, danger);
  const note = `AF anticoagulation discussion: CHA2DS2-VASc ${cha}; estimated untreated ischemic stroke/systemic embolism risk ≈ ${pct(annualStroke)} per year. Estimated risk with effective anticoagulation ≈ ${pct(treatedAnnual)} per year using a communication estimate of ~64% relative risk reduction. HAS-BLED ${hasbled}; estimated major bleeding risk ≈ ${pct(annualBleed)} per year. Recommendation frame: ${rec.primary} Danger-zone checks: ${danger.length ? danger.join(' ') : 'No selected warfarin-only/DOAC danger-zone trigger.'}`;

  return (
    <section className="section tool-body deep-tool">
      <div className="tool-grid wide-left">
        <div className="panel">
          <h2>1) Stroke risk: CHA₂DS₂-VASc</h2>
          <div className="form-grid two">
            <label>Sex<select value={v.sex} onChange={e=>setV({...v, sex:e.target.value})}><option value="male">Male</option><option value="female">Female</option></select></label>
            <label>Age<input type="number" min="0" value={v.age} onChange={e=>setV({...v, age:e.target.value})} /></label>
          </div>
          <div className="check-grid">
            <Check label="Heart failure / LV dysfunction" checked={v.chf} onChange={e=>setV({...v,chf:e.target.checked})} />
            <Check label="Hypertension" checked={v.htn} onChange={e=>setV({...v,htn:e.target.checked})} />
            <Check label="Diabetes" checked={v.dm} onChange={e=>setV({...v,dm:e.target.checked})} />
            <Check label="Prior stroke/TIA/systemic embolism" checked={v.stroke} onChange={e=>setV({...v,stroke:e.target.checked})} />
            <Check label="Vascular disease: MI, PAD, aortic plaque" checked={v.vascular} onChange={e=>setV({...v,vascular:e.target.checked})} />
          </div>
          <div className="score-strip">
            <ScoreBox label="CHA₂DS₂-VASc" value={cha} />
            <ScoreBox label="Annual untreated risk" value={pct(annualStroke)} />
            <ScoreBox label="Estimated annual risk on OAC" value={pct(treatedAnnual)} />
          </div>
        </div>

        <div className="panel">
          <h2>2) Bleeding risk: HAS-BLED frame</h2>
          <p className="small">Use bleeding risk to correct modifiable risks and plan monitoring. Do not use it alone to deny anticoagulation when stroke risk is high.</p>
          <div className="check-grid">
            <Check label="Uncontrolled hypertension / high SBP" checked={v.htn} onChange={e=>setV({...v,htn:e.target.checked})} />
            <Check label="Abnormal renal function" checked={v.renal} onChange={e=>setV({...v,renal:e.target.checked})} />
            <Check label="Abnormal liver function" checked={v.liver} onChange={e=>setV({...v,liver:e.target.checked})} />
            <Check label="Prior stroke" checked={v.stroke} onChange={e=>setV({...v,stroke:e.target.checked})} />
            <Check label="Prior major bleeding / bleeding tendency" checked={v.bleed} onChange={e=>setV({...v,bleed:e.target.checked})} />
            <Check label="Labile INR if on warfarin" checked={v.labile} onChange={e=>setV({...v,labile:e.target.checked})} />
            <Check label="Age >65" checked={age>65} onChange={()=>{}} disabled />
            <Check label="Antiplatelet/NSAID exposure" checked={v.drugs} onChange={e=>setV({...v,drugs:e.target.checked})} />
            <Check label="Alcohol excess" checked={v.alcohol} onChange={e=>setV({...v,alcohol:e.target.checked})} />
          </div>
          <div className="score-strip">
            <ScoreBox label="HAS-BLED" value={hasbled} />
            <ScoreBox label="Annual major bleeding estimate" value={pct(annualBleed)} />
            <ScoreBox label="Risk category" value={hasbled>=3?'High caution':'Lower caution'} />
          </div>
        </div>

        <div className="panel">
          <h2>3) Time-horizon shared decision estimate</h2>
          <RiskTable rows={riskRows} />
          <p className="small">Estimates are for communication only. Stroke and bleeding calculators come from different cohorts; do not subtract bleeding from stroke as if they were the same outcome.</p>
        </div>

        <div className="panel">
          <h2>4) DOAC danger-zone / warfarin-preferred checks</h2>
          <div className="check-grid">
            <Check label="Mechanical heart valve" checked={v.mechanical} onChange={e=>setV({...v,mechanical:e.target.checked})} />
            <Check label="Moderate-to-severe mitral stenosis" checked={v.ms} onChange={e=>setV({...v,ms:e.target.checked})} />
            <Check label="Rheumatic valvular AF / RHD-AF" checked={v.rheumatic} onChange={e=>setV({...v,rheumatic:e.target.checked})} />
            <Check label="LVAD / device-specific anticoagulation" checked={v.lvad} onChange={e=>setV({...v,lvad:e.target.checked})} />
            <Check label="Pregnancy or breastfeeding context" checked={v.pregnancy} onChange={e=>setV({...v,pregnancy:e.target.checked})} />
            <Check label="Severe renal dysfunction / AKI / dialysis question" checked={v.severeRenal} onChange={e=>setV({...v,severeRenal:e.target.checked})} />
            <Check label="Advanced liver disease/coagulopathy" checked={v.severeLiver} onChange={e=>setV({...v,severeLiver:e.target.checked})} />
            <Check label="Major P-gp/CYP3A4 drug interaction" checked={v.interacting} onChange={e=>setV({...v,interacting:e.target.checked})} />
            <Check label="Unreliable absorption: vomiting, short gut, bariatric surgery" checked={v.absorption} onChange={e=>setV({...v,absorption:e.target.checked})} />
          </div>
        </div>
      </div>

      <div className="panel sticky-output">
        <h2>Bedside output</h2>
        <div className="output-section urgent"><h3>Recommendation frame</h3><p>{rec.primary}</p></div>
        <div className="output-section"><h3>Risk framing</h3><ul><li>CHA₂DS₂-VASc {cha}: untreated annual stroke/embolism estimate ≈ {pct(annualStroke)}.</li><li>With effective anticoagulation, communication estimate ≈ {pct(treatedAnnual)} per year.</li><li>Approximate absolute stroke-risk reduction ≈ {pct(oneArr)} in 1 year and {pct(riskRows[1].strokeAvoid)} over 5 years.</li><li>HAS-BLED {hasbled}: major bleeding estimate ≈ {pct(annualBleed)} per year; correct modifiable risks.</li></ul></div>
        {danger.length > 0 && <div className="output-section danger"><h3>Danger zones</h3><ul>{danger.map((d,i)=><li key={i}>{d}</li>)}</ul></div>}
        <div className="output-section"><h3>Do-not-miss actions</h3><ul>{rec.actions.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
        <CopyBox text={note} />
        <p className="small">Clinician decision support only. Confirm with local policy, patient-specific factors, and specialist input when needed.</p>
      </div>
    </section>
  );
}

function getAfRecommendation(v, cha, chaNonSex, hasbled, danger) {
  if (v.mechanical || v.ms || v.rheumatic) {
    return { primary:'Warfarin-centered pathway. Do not default to DOAC because a warfarin-preferred condition is selected.', actions:['Confirm valve/rheumatic diagnosis and target INR pathway.', 'Avoid aspirin as a substitute for anticoagulation.', 'Address bleeding risks, but do not let HAS-BLED alone cancel stroke prevention.'] };
  }
  const high = (v.sex==='male' && cha>=2) || (v.sex==='female' && cha>=3);
  const intermediate = (v.sex==='male' && cha===1) || (v.sex==='female' && cha===2);
  const low = chaNonSex === 0;
  if (high) return { primary:'Anticoagulation generally favored if no absolute contraindication. DOAC usually preferred over warfarin unless a danger-zone condition applies.', actions:['Choose agent/dose using renal function, age, weight, liver function, interactions, adherence, and cost/access.', 'Avoid routine aspirin or DAPT as an alternative to anticoagulation when anticoagulation is indicated.', 'Mitigate bleeding risks: BP, NSAIDs/antiplatelets, alcohol, anemia source, renal/liver review, falls plan.'] };
  if (intermediate) return { primary:'Intermediate stroke risk. Shared decision-making is appropriate; look for risk modifiers and patient values.', actions:['Review AF burden, left atrial size, kidney disease, obesity, sleep apnea, vascular burden, and patient preference.', 'Discuss absolute risk over 1 and 5 years rather than score alone.', 'Reassess periodically because risk changes with age and new comorbidity.'] };
  if (low) return { primary:'Low risk by CHA₂DS₂-VASc framework. Anticoagulation is usually not needed solely for AF stroke prevention.', actions:['Do not use aspirin solely for AF stroke prevention.', 'Reassess when age or comorbidities change.', 'Treat risk factors and clarify whether AF diagnosis/episode burden is accurate.'] };
  return { primary:'Individualize using risk modifiers, patient values, and bleeding-risk mitigation.', actions:['Clarify indication and stroke-risk modifiers.', 'Reassess bleeding risks and modifiable factors.', 'Document shared decision discussion.'] };
}

function RiskTable({ rows }) {
  return <div className="risk-table"><table><thead><tr><th>Time</th><th>Stroke/embolism if untreated</th><th>Estimated on OAC</th><th>Estimated absolute stroke reduction</th><th>Major bleeding estimate</th></tr></thead><tbody>{rows.map(r=><tr key={r.years}><td>{r.years} year{r.years>1?'s':''}</td><td>{pct(r.strokeNo)}</td><td>{pct(r.strokeOn)}</td><td>{pct(r.strokeAvoid)}</td><td>{pct(r.bleed)}</td></tr>)}</tbody></table></div>;
}

function AntithromboticTool() {
  const [v, setV] = useState({
    scenario:'new-thrombosis', med:'lmwh', thrombosisOnAC:false, adherenceConcern:false, wrongDose:false, renal:false, liver:false, interaction:false, absorption:false, weightExtreme:false,
    plateletFall:false, plateletNadir:'', plateletFallPct:'', heparinDays:'5-10', thrombosisNew:false, skinNecrosis:false, systemicReaction:false, otherCause:'possible', vaccine:false, unusualSite:false, arterial:false, dDimerHigh:false, fibrinogenLow:false,
    antiXa:false, antiXaDrug:'lmwh', antiXaLevel:'', antiXaTiming:'unknown', atDef:false, atLevel:'', nephrotic:false, dic:false, acuteThrombosis:false, pregnancy:false,
    aps:false, triplePositive:false, lupusAnticoag:false, recurrentOnDoac:false, mechanical:false, rheumaticMS:false, cancer:false, myeloproliferative:false, pnh:false, malignancy:false, vasculitis:false
  });
  const set = (k,val) => setV(s => ({...s,[k]:val}));
  const fourT = calculate4T(v);
  const out = buildAntithromboticOutput(v, fourT);
  const note = `Antithrombotic Safety Assistant: scenario ${v.scenario}; medication ${v.med}; 4Ts estimate ${fourT.score} (${fourT.category}). Key actions: ${out.actions.join(' ')} Key labs/checks: ${out.labs.join('; ')}.`;

  return (
    <section className="section tool-body deep-tool">
      <div className="tool-grid wide-left">
        <div className="panel">
          <h2>1) What problem are you solving?</h2>
          <div className="form-grid two">
            <label>Scenario<select value={v.scenario} onChange={e=>set('scenario',e.target.value)}><option value="new-thrombosis">New/progressive thrombosis</option><option value="thrombocytopenia-thrombosis">Thrombocytopenia + thrombosis</option><option value="anti-xa">Anti-Xa interpretation</option><option value="anticoagulant-choice">Choosing anticoagulant</option><option value="bleeding-thrombosis">Bleeding risk + thrombosis tension</option></select></label>
            <label>Current/recent drug<select value={v.med} onChange={e=>set('med',e.target.value)}><option value="ufh">UFH</option><option value="lmwh">LMWH</option><option value="fondaparinux">Fondaparinux</option><option value="doac">DOAC</option><option value="warfarin">Warfarin</option><option value="antiplatelet">Antiplatelet only</option><option value="none">No anticoagulant</option></select></label>
          </div>
          <div className="check-grid">
            <Check label="Thrombosis occurred while on anticoagulation" checked={v.thrombosisOnAC} onChange={e=>set('thrombosisOnAC',e.target.checked)} />
            <Check label="Adherence / missed doses / access concern" checked={v.adherenceConcern} onChange={e=>set('adherenceConcern',e.target.checked)} />
            <Check label="Wrong dose, wrong timing, or not yet therapeutic" checked={v.wrongDose} onChange={e=>set('wrongDose',e.target.checked)} />
            <Check label="Renal dysfunction affects drug exposure" checked={v.renal} onChange={e=>set('renal',e.target.checked)} />
            <Check label="Liver disease/coagulopathy affects choice" checked={v.liver} onChange={e=>set('liver',e.target.checked)} />
            <Check label="Major interaction: P-gp/CYP3A4/antiplatelet/NSAID" checked={v.interaction} onChange={e=>set('interaction',e.target.checked)} />
            <Check label="Unreliable absorption: vomiting, short gut, bariatric surgery" checked={v.absorption} onChange={e=>set('absorption',e.target.checked)} />
            <Check label="Weight extreme / pregnancy / special PK context" checked={v.weightExtreme} onChange={e=>set('weightExtreme',e.target.checked)} />
          </div>
        </div>

        <div className="panel">
          <h2>2) PF4 / HIT / VITT screen</h2>
          <div className="form-grid two">
            <label>Platelet fall %<input type="number" value={v.plateletFallPct} placeholder="e.g. 55" onChange={e=>set('plateletFallPct',e.target.value)} /></label>
            <label>Platelet nadir<input type="number" value={v.plateletNadir} placeholder="e.g. 45" onChange={e=>set('plateletNadir',e.target.value)} /></label>
            <label>Heparin timing<select value={v.heparinDays} onChange={e=>set('heparinDays',e.target.value)}><option value="5-10">Day 5-10 or ≤1 day with recent exposure</option><option value="possible">Possible but not classic</option><option value="unlikely">≤4 days without recent exposure or >10d unclear</option></select></label>
            <label>Other cause<select value={v.otherCause} onChange={e=>set('otherCause',e.target.value)}><option value="none">No other clear cause</option><option value="possible">Possible other cause</option><option value="definite">Definite other cause</option></select></label>
          </div>
          <div className="check-grid">
            <Check label="Platelet fall / thrombocytopenia present" checked={v.plateletFall} onChange={e=>set('plateletFall',e.target.checked)} />
            <Check label="New thrombosis, extension, skin necrosis, or acute systemic reaction" checked={v.thrombosisNew} onChange={e=>set('thrombosisNew',e.target.checked)} />
            <Check label="Skin necrosis after heparin injection" checked={v.skinNecrosis} onChange={e=>set('skinNecrosis',e.target.checked)} />
            <Check label="Acute systemic reaction after IV heparin bolus" checked={v.systemicReaction} onChange={e=>set('systemicReaction',e.target.checked)} />
            <Check label="Recent adenoviral vaccine / VITT-compatible timing" checked={v.vaccine} onChange={e=>set('vaccine',e.target.checked)} />
            <Check label="Unusual site: CVST, splanchnic, adrenal, limb ischemia" checked={v.unusualSite} onChange={e=>set('unusualSite',e.target.checked)} />
            <Check label="Very high D-dimer" checked={v.dDimerHigh} onChange={e=>set('dDimerHigh',e.target.checked)} />
            <Check label="Low fibrinogen" checked={v.fibrinogenLow} onChange={e=>set('fibrinogenLow',e.target.checked)} />
          </div>
          <div className="score-strip"><ScoreBox label="Estimated 4Ts" value={fourT.score} /><ScoreBox label="Category" value={fourT.category} /><ScoreBox label="PF4 action" value={fourT.actionShort} /></div>
        </div>

        <div className="panel">
          <h2>3) Anti-Xa / antithrombin physiology</h2>
          <div className="form-grid two">
            <label>Anti-Xa assay context<select value={v.antiXaDrug} onChange={e=>set('antiXaDrug',e.target.value)}><option value="ufh">UFH-calibrated anti-Xa</option><option value="lmwh">LMWH-calibrated anti-Xa</option><option value="fondaparinux">Fondaparinux-calibrated anti-Xa</option><option value="apixaban">Apixaban-calibrated level</option><option value="rivaroxaban">Rivaroxaban-calibrated level</option><option value="unknown">Unknown calibration</option></select></label>
            <label>Reported level<input value={v.antiXaLevel} placeholder="optional" onChange={e=>set('antiXaLevel',e.target.value)} /></label>
            <label>Sampling timing<select value={v.antiXaTiming} onChange={e=>set('antiXaTiming',e.target.value)}><option value="unknown">Unknown timing</option><option value="peak-correct">Peak at correct time</option><option value="too-early">Too early</option><option value="too-late">Too late / trough</option><option value="steady-state">Steady-state confirmed</option></select></label>
            <label>Antithrombin activity %<input type="number" value={v.atLevel} placeholder="optional" onChange={e=>set('atLevel',e.target.value)} /></label>
          </div>
          <div className="check-grid">
            <Check label="Anti-Xa result is being used for decision-making" checked={v.antiXa} onChange={e=>set('antiXa',e.target.checked)} />
            <Check label="Known/suspected antithrombin deficiency" checked={v.atDef} onChange={e=>set('atDef',e.target.checked)} />
            <Check label="Nephrotic-range protein loss / low albumin context" checked={v.nephrotic} onChange={e=>set('nephrotic',e.target.checked)} />
            <Check label="DIC/consumption/sepsis/post-op/ECMO context" checked={v.dic} onChange={e=>set('dic',e.target.checked)} />
            <Check label="Acute thrombosis may transiently lower AT" checked={v.acuteThrombosis} onChange={e=>set('acuteThrombosis',e.target.checked)} />
            <Check label="Pregnancy/postpartum special anticoagulation context" checked={v.pregnancy} onChange={e=>set('pregnancy',e.target.checked)} />
          </div>
        </div>

        <div className="panel">
          <h2>4) APS / DOAC danger zones / vascular red flags</h2>
          <div className="check-grid">
            <Check label="APS known or suspected" checked={v.aps} onChange={e=>set('aps',e.target.checked)} />
            <Check label="Triple-positive APS or strongly positive lupus anticoagulant" checked={v.triplePositive} onChange={e=>set('triplePositive',e.target.checked)} />
            <Check label="Arterial thrombosis / stroke / limb ischemia" checked={v.arterial} onChange={e=>set('arterial',e.target.checked)} />
            <Check label="Recurrent thrombosis while on DOAC" checked={v.recurrentOnDoac} onChange={e=>set('recurrentOnDoac',e.target.checked)} />
            <Check label="Mechanical valve" checked={v.mechanical} onChange={e=>set('mechanical',e.target.checked)} />
            <Check label="Moderate-to-severe MS / rheumatic AF" checked={v.rheumaticMS} onChange={e=>set('rheumaticMS',e.target.checked)} />
            <Check label="Active cancer / occult malignancy concern" checked={v.malignancy} onChange={e=>set('malignancy',e.target.checked)} />
            <Check label="MPN features: high Hb/Hct, platelets, splanchnic thrombosis" checked={v.myeloproliferative} onChange={e=>set('myeloproliferative',e.target.checked)} />
            <Check label="PNH features: hemolysis/cytopenias/unusual thrombosis" checked={v.pnh} onChange={e=>set('pnh',e.target.checked)} />
            <Check label="Vasculitis/anatomic vascular lesion possible" checked={v.vasculitis} onChange={e=>set('vasculitis',e.target.checked)} />
          </div>
        </div>
      </div>

      <div className="panel sticky-output">
        <h2>Bedside output</h2>
        {out.urgent.length > 0 && <div className="output-section danger"><h3>Urgent red flags</h3><ul>{out.urgent.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
        <div className="output-section"><h3>Most important interpretation</h3><ul>{out.interpretation.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="output-section"><h3>Immediate actions</h3><ul>{out.actions.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="output-section"><h3>Labs / data to check now</h3><ul>{out.labs.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="output-section"><h3>Medication strategy cautions</h3><ul>{out.meds.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <div className="output-section"><h3>Common bedside pitfalls</h3><ul>{out.pitfalls.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        <CopyBox text={note} />
        <p className="small">Clinician decision support only. Use local policy, patient-specific judgment, and hematology/vascular/cardiology input when needed.</p>
      </div>
    </section>
  );
}

function calculate4T(v) {
  const fall = Number(v.plateletFallPct); const nadir = Number(v.plateletNadir);
  let t1 = 0;
  if (v.plateletFall && ((fall >= 50) || (nadir >= 20 && fall >= 30))) t1 = 2;
  else if (v.plateletFall && ((fall >= 30) || (nadir >= 10))) t1 = 1;
  let t2 = v.heparinDays === '5-10' ? 2 : v.heparinDays === 'possible' ? 1 : 0;
  let t3 = (v.thrombosisNew || v.skinNecrosis || v.systemicReaction) ? 2 : 0;
  let t4 = v.otherCause === 'none' ? 2 : v.otherCause === 'possible' ? 1 : 0;
  const score = t1+t2+t3+t4;
  const category = score >= 6 ? 'High' : score >= 4 ? 'Intermediate' : 'Low';
  const actionShort = score >= 4 ? 'Treat as HIT until proven otherwise' : 'HIT less likely';
  return { score, category, actionShort, parts:[t1,t2,t3,t4] };
}

function buildAntithromboticOutput(v, fourT) {
  const urgent=[], interpretation=[], actions=[], labs=[], meds=[], pitfalls=[];
  if (v.thrombosisOnAC) interpretation.push('Do not call this true anticoagulant failure until adherence, dosing, timing, renal/liver function, interactions, absorption, and correct indication are verified.');
  if (v.adherenceConcern || v.wrongDose || v.interaction || v.absorption) interpretation.push('Pseudo-failure is plausible: missed doses, underdosing, interactions, or poor absorption can mimic anticoagulant failure.');
  if (v.plateletFall || v.thrombosisNew || fourT.score >= 4) interpretation.push(`HIT probability by 4Ts is ${fourT.category} (${fourT.score}/8).`);
  if (fourT.score >= 4) { urgent.push('Intermediate/high 4Ts: avoid heparin exposure while evaluating unless a specialist-directed exception exists.'); actions.push('Stop UFH/LMWH/heparin flushes and start a non-heparin anticoagulant if anticoagulation is needed and bleeding risk allows.'); labs.push('PF4/heparin immunoassay; if positive or discordant, functional assay such as SRA/HIPA depending on local lab.'); }
  else { pitfalls.push('Low 4Ts has high negative predictive value only if the score was calculated carefully and platelet timing is reliable.'); }
  if (v.vaccine || (v.unusualSite && v.plateletFall && v.dDimerHigh)) { urgent.push('VITT/PF4-spectrum pattern possible: thrombosis at unusual site + thrombocytopenia + high D-dimer ± low fibrinogen after adenoviral vaccine is an emergency pattern.'); actions.push('Discuss urgently with hematology; use non-heparin anticoagulation and IVIG pathway per local protocol when VITT is suspected.'); labs.push('PF4 ELISA, platelet count trend, D-dimer, fibrinogen, PT/aPTT, imaging for CVST/splanchnic thrombosis if symptoms fit.'); }
  if (v.antiXa) { interpretation.push(getAntiXaInterpretation(v)); labs.push('Confirm exact anti-Xa assay calibration, dose time, sample time, renal function, weight, albumin, antithrombin activity, and whether drug-specific DOAC level is needed.'); pitfalls.push('Anti-Xa assays are not interchangeable: UFH, LMWH, fondaparinux, apixaban, and rivaroxaban require correct calibration/context.'); }
  if (v.atDef || Number(v.atLevel) < 70 || v.nephrotic || v.dic) { interpretation.push('Antithrombin issue may reduce the effect of UFH, LMWH, and fondaparinux because these drugs depend on antithrombin activity.'); meds.push('If clinically important AT deficiency/heparin resistance is present, consider AT-independent agents such as direct thrombin inhibitor or DOAC when appropriate, or AT replacement in selected specialist-directed settings.'); labs.push('Antithrombin activity; repeat when acute thrombosis/heparin/consumption state has resolved if inherited deficiency is being considered.'); }
  if (v.med === 'fondaparinux') meds.push('Fondaparinux is often used as a non-heparin option in HIT pathways, but it is still antithrombin-dependent and anti-Xa interpretation requires fondaparinux calibration.');
  if (v.med === 'lmwh') meds.push('LMWH effect is antithrombin-dependent; peak anti-Xa is usually drawn about 4 hours after dose at steady state when monitoring is indicated.');
  if (v.med === 'ufh') meds.push('UFH monitoring discordance can occur; compare aPTT vs anti-Xa, acute phase factors, antithrombin, and heparin resistance context.');
  if (v.med === 'doac') meds.push('For DOAC failure concerns, verify adherence, last dose, renal/liver function, P-gp/CYP3A4 interactions, absorption, and whether the indication is a DOAC danger zone.');
  if (v.aps || v.triplePositive || v.recurrentOnDoac) { urgent.push('APS danger zone if triple-positive, arterial thrombosis, or recurrent thrombosis on DOAC.'); meds.push('High-risk APS is generally warfarin-centered rather than DOAC-centered; urgent specialist review if arterial/recurrent event.'); labs.push('APS panel: lupus anticoagulant, anticardiolipin IgG/IgM, beta-2 glycoprotein I IgG/IgM; repeat ≥12 weeks for classification if relevant.'); }
  if (v.mechanical || v.rheumaticMS) { urgent.push('Mechanical valve or rheumatic moderate-to-severe MS: DOAC is not the default pathway.'); meds.push('Use warfarin-centered pathway unless specialist-directed exception.'); }
  if (v.arterial || v.unusualSite || v.myeloproliferative || v.pnh || v.malignancy || v.vasculitis) { interpretation.push('Arterial or unusual-site thrombosis should trigger vascular medicine differential beyond standard VTE recurrence.'); labs.push('Consider CBC/smear, JAK2/CALR/MPL if MPN pattern, PNH flow if cytopenia/hemolysis/unusual site, malignancy evaluation guided by history/exam, and vascular imaging/anatomic review.'); }
  actions.push('Map the timeline: thrombosis date, anticoagulant start date, dose changes, platelet trend, procedures, infection, malignancy, pregnancy/postpartum, vaccine, and heparin flushes.');
  actions.push('Clarify immediate risk: limb/organ threat, PE burden/RV strain, CVST/splanchnic site, bleeding, renal/liver function, and need for procedure.');
  labs.push('CBC with smear, PT/INR, aPTT, fibrinogen, D-dimer, creatinine/eGFR, liver panel, albumin, urinalysis/proteinuria if AT loss suspected.');
  if (!interpretation.length) interpretation.push('No major danger-zone selected. Continue structured review of indication, drug exposure, labs, and thrombosis phenotype.');
  if (!meds.length) meds.push('Medication choice should match indication, organ function, interactions, bleeding risk, and whether HIT/APS/valvular/AT-dependent pathways are present.');
  pitfalls.push('Do not bridge to warfarin alone in acute HIT before platelet recovery; avoid early warfarin-only therapy in suspected HIT without specialist pathway.');
  pitfalls.push('Do not interpret “normal” INR/aPTT as proof that DOAC is absent or ineffective.');
  pitfalls.push('Do not send broad inherited thrombophilia testing during acute thrombosis/anticoagulation unless it will change immediate management.');
  return { urgent, interpretation, actions, labs, meds, pitfalls };
}

function getAntiXaInterpretation(v) {
  const timing = v.antiXaTiming;
  const cal = v.antiXaDrug;
  const timingText = timing === 'peak-correct' ? 'timing appears appropriate' : timing === 'too-early' ? 'sample may be too early and falsely high' : timing === 'too-late' ? 'sample may be late/trough and falsely low for peak interpretation' : timing === 'steady-state' ? 'steady state confirmed' : 'timing is unknown, so interpretation is limited';
  const calText = cal === 'unknown' ? 'assay calibration is unknown; result may not be interpretable' : `${cal.toUpperCase()} calibration selected`;
  return `Anti-Xa interpretation: ${calText}; ${timingText}. Always interpret with dose schedule, last dose time, renal function, body weight, pregnancy status, albumin/protein loss, and antithrombin status.`;
}

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

function Check({ label, checked, onChange, disabled=false }) { return <label className={`check ${disabled?'disabled':''}`}><input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} /><span>{label}</span></label>; }
function ScoreBox({ label, value }) { return <div className="score-box"><span>{label}</span><strong>{value}</strong></div>; }
function Output({ title, items }) { return <div className="output"><h3>{title}</h3><ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul><p className="small">Clinician decision support only. Use local policy, patient-specific judgment, and specialist input when needed.</p></div>; }
function CopyBox({ text }) { const [ok,setOk]=useState(false); return <div className="copy-box"><textarea readOnly value={text} /><button className="primary" onClick={()=>{navigator.clipboard && navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false),1500);}}>{ok?'Copied':'Copy note'}</button></div>; }
function Footer() { return <footer><span>© Fahad Almalki, MD</span><span><a href="mailto:contact@fahadalmalkimd.com">contact@fahadalmalkimd.com</a></span></footer>; }

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
