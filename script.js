const $ = (id) => document.getElementById(id);
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

function checked(id){ return $(id)?.checked || false; }
function val(id){ return $(id)?.value; }
function esc(text){ return String(text).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function runAfTool(){
  let chads = 0;
  const age = val('ageGroup');
  if(age === '1') chads += 1;
  if(age === '2') chads += 2;
  if(val('sex') === 'female') chads += 1;
  if(checked('chf')) chads += 1;
  if(checked('htn')) chads += 1;
  if(checked('dm')) chads += 1;
  if(checked('stroke')) chads += 2;
  if(checked('vascular')) chads += 1;

  let hasbled = 0;
  ['uncontrolledBP','renal','liver','bleeding','labileINR','drugsAlcohol'].forEach(id => { if(checked(id)) hasbled += 1; });
  if(age === '2') hasbled += 1;

  const male = val('sex') === 'male';
  let anticoagText = '';
  let riskClass = '';
  if((male && chads >= 2) || (!male && chads >= 3)){
    anticoagText = 'Oral anticoagulation generally recommended if no contraindication.';
    riskClass = 'success';
  } else if((male && chads === 1) || (!male && chads === 2)){
    anticoagText = 'Intermediate zone: anticoagulation should be individualized through shared decision-making.';
    riskClass = 'warning';
  } else {
    anticoagText = 'Low score: anticoagulation is usually not indicated solely for AF stroke prevention.';
    riskClass = 'warning';
  }

  const warfarinOnly = checked('mechanicalValve') || checked('modSevMS') || checked('rheumaticAF');
  const doacCaution = checked('severeRenal') || checked('aps') || checked('pregnancy');
  let drugText = 'If anticoagulation is chosen and no exclusion exists, a DOAC is generally preferred over warfarin for non-valvular AF.';
  let drugClass = 'success';
  if(warfarinOnly){
    drugText = 'Warfarin/VKA pathway: mechanical valve, moderate-to-severe mitral stenosis, or rheumatic valvular AF is flagged. Do not default to DOAC.';
    drugClass = 'danger';
  } else if(doacCaution){
    drugText = 'DOAC caution zone: renal function, APS phenotype, pregnancy/breastfeeding, interactions, or absorption issues require individualized review.';
    drugClass = 'warning';
  }

  const bleedingClass = hasbled >= 3 ? 'warning' : 'success';
  const bleedingText = hasbled >= 3 ? 'Bleeding risk is elevated. This should trigger mitigation of reversible risks and closer follow-up, not automatic withholding of anticoagulation.' : 'No major bleeding-risk cluster flagged by this simplified screen.';

  const summary = `AF anticoagulation shared decision summary\nCHA2DS2-VASc: ${chads}\nSimplified HAS-BLED flags: ${hasbled}\nStroke prevention direction: ${anticoagText}\nAnticoagulant pathway: ${drugText}\nBleeding mitigation: ${bleedingText}`;

  $('afResult').innerHTML = `
    <span class="label">Output</span>
    <h3>AF decision summary</h3>
    <div class="result-box">
      <div class="score-line"><span>CHA₂DS₂-VASc</span><strong class="big-score">${chads}</strong></div>
      <div class="score-line"><span>Simplified HAS-BLED flags</span><strong class="big-score">${hasbled}</strong></div>
    </div>
    <div class="result-box ${riskClass}"><strong>Stroke prevention direction</strong><p>${esc(anticoagText)}</p></div>
    <div class="result-box ${drugClass}"><strong>Anticoagulant choice</strong><p>${esc(drugText)}</p></div>
    <div class="result-box ${bleedingClass}"><strong>Bleeding-risk interpretation</strong><p>${esc(bleedingText)}</p></div>
    <h4>Discussion checklist</h4>
    <ul class="output-list">
      <li>Clarify AF pattern, symptom burden, reversibility, and patient goals.</li>
      <li>Review renal function, liver function, hemoglobin/platelets, drug interactions, falls/frailty context, adherence, and cost/access.</li>
      <li>Mitigate bleeding risk: BP control, avoid unnecessary NSAID/antiplatelet therapy, treat anemia/bleeding source, alcohol reduction, follow-up plan.</li>
      <li>Document shared decision: stroke prevention benefit, bleeding tradeoff, patient values, selected agent, and review date.</li>
    </ul>
    <h4>Copy-ready note</h4>
    <pre class="copy-block">${esc(summary)}</pre>
  `;
}

function resetAfTool(){
  $('afForm').reset();
  $('afResult').innerHTML = '<span class="label">Output</span><h3>AF decision summary</h3><p>Enter patient factors, then generate a structured summary.</p>';
}

function runThrombosisEngine(){
  let alerts = [];
  let labs = new Set(['CBC with smear review','PT/INR, aPTT, fibrinogen, D-dimer','Creatinine/eGFR and liver profile','Medication and exposure timeline']);
  let actions = [];
  let className = 'success';

  const plt = val('pltTrend');
  const thromb = val('thrombosisPattern');
  const hitPattern = (plt === 'hitRange' || plt === 'severe') && (checked('heparinExposure') || checked('rapidHeparin')) && (thromb !== 'none' || checked('noAltCause'));
  if(hitPattern){
    className = 'danger';
    alerts.push('HIT/PF4-spectrum concern: platelet fall pattern plus heparin timing and thrombosis/no alternative cause.');
    labs.add('PF4/heparin immunoassay with functional assay confirmation when available');
    actions.push('Avoid additional heparin exposure while evaluating high-probability HIT; consider non-heparin anticoagulant pathway with hematology/input and local protocol.');
  }
  if(checked('pf4Positive')){
    alerts.push('PF4 testing positive or pending with high clinical suspicion: interpret with pre-test probability; confirm with functional testing when needed.');
  }

  const vittPattern = checked('adenoVaccine') && (checked('veryHighDimer') || checked('lowFibrinogen') || checked('unusualThrombosis') || thromb === 'unusual') && (plt !== 'normal');
  if(vittPattern){
    className = 'danger';
    alerts.push('VITT / anti-PF4 syndrome concern: vaccine timing plus thrombocytopenia and high-risk thrombotic/laboratory pattern.');
    labs.add('PF4 ELISA; avoid relying on rapid HIT assays if VITT suspected');
    labs.add('Urgent imaging for cerebral/splanchnic/adrenal thrombosis if symptoms suggest');
    actions.push('Urgent hematology pathway; VITT frameworks generally use IVIG and non-heparin anticoagulation when clinically appropriate.');
  }

  if(checked('lowAntiXa') || checked('knownAT')){
    className = className === 'danger' ? 'danger' : 'warning';
    alerts.push('Heparin-responsiveness concern: low anti-Xa, recurrent thrombosis, high heparin requirement, or suspected antithrombin loss/deficiency.');
    labs.add('Antithrombin activity level with timing caveats');
    labs.add('Anti-Xa level drawn at appropriate timing for the anticoagulant used');
    actions.push('Review sampling timing, dose, renal function, weight, acute phase state, nephrotic/liver/DIC context, and whether a non-heparin strategy is safer.');
  }

  if(checked('doacMechanical') || checked('doacAPS') || checked('doacRenal')){
    className = className === 'danger' ? 'danger' : 'warning';
    alerts.push('DOAC danger-zone flagged: mechanical valve/rheumatic MS, high-risk APS, severe renal dysfunction, major interaction, malabsorption, or pregnancy/breastfeeding question.');
    actions.push('Do not default to a DOAC without reviewing indication-specific evidence, renal function, interactions, and local/specialist guidance.');
  }

  if(thromb === 'progressive'){
    alerts.push('Progressive thrombosis despite anticoagulation: verify diagnosis, dose, adherence, absorption, interaction, renal function, drug level when applicable, and occult provoking drivers.');
    labs.add('Consider antiphospholipid antibodies, malignancy/inflammatory drivers, and anatomic compression depending on context');
  }

  if(alerts.length === 0){
    alerts.push('No major PF4/HIT/VITT/heparin-resistance danger pattern selected. Continue standard thrombosis evaluation and reassess if platelets fall, thrombosis progresses, or exposure timeline changes.');
    actions.push('Use local VTE/anticoagulation pathway and reassess with new data.');
  }

  const labList = Array.from(labs);
  const summary = `Thrombosis bedside engine summary\nPattern flags:\n- ${alerts.join('\n- ')}\nSuggested labs/checks:\n- ${labList.join('\n- ')}\nImmediate cautions:\n- ${actions.join('\n- ')}`;

  $('thrombosisResult').innerHTML = `
    <span class="label">Output</span>
    <h3>Thrombosis checklist</h3>
    <div class="result-box ${className}"><strong>Pattern recognition</strong><ul class="output-list">${alerts.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>
    <div class="result-box"><strong>What to send / verify</strong><ul class="output-list">${labList.map(l=>`<li>${esc(l)}</li>`).join('')}</ul></div>
    <div class="result-box warning"><strong>Bedside cautions</strong><ul class="output-list">${actions.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>
    <h4>Copy-ready note</h4>
    <pre class="copy-block">${esc(summary)}</pre>
  `;
}

function resetThrombosisEngine(){
  $('thrombosisForm').reset();
  $('thrombosisResult').innerHTML = '<span class="label">Output</span><h3>Thrombosis checklist</h3><p>Select the clinical pattern, then generate a bedside checklist.</p>';
}



function runHyponaEngine(){
  const sodium = Number(val('na'));
  const symptoms = val('hypoSymptoms');
  const serum = val('serumOsm');
  const uOsm = val('urineOsm');
  const uNa = val('urineNa');
  let alerts = [];
  let likely = [];
  let next = new Set(['Repeat serum sodium to confirm trend and timing','Check measured serum osmolality, urine osmolality, urine sodium, glucose, creatinine/eGFR, potassium']);
  let treatment = [];
  let className = 'success';

  if(sodium && sodium < 120){ className = 'warning'; alerts.push('Severe biochemical hyponatremia flagged. Assess chronicity, symptoms, and overcorrection risk.'); }
  if(symptoms === 'severe'){
    className = 'danger';
    alerts.push('Severe neurologic symptoms: this is an emergency pattern. Follow local hypertonic saline protocol and monitor closely.');
    next.add('Urgent senior/ICU-level review depending on severity and local pathway');
    next.add('Frequent sodium monitoring during active correction');
    treatment.push('Initial priority is symptom stabilization and controlled early sodium rise, not complete normalization.');
  } else if(symptoms === 'moderate'){
    className = className === 'danger' ? 'danger' : 'warning';
    alerts.push('Moderately symptomatic hyponatremia: urgent evaluation and monitored treatment pathway needed.');
    next.add('Clarify duration: acute <48 h versus chronic/unknown');
  }

  if(serum === 'high' || checked('glucoseDriver')){
    className = className === 'danger' ? 'danger' : 'warning';
    likely.push('Hypertonic/translocational hyponatremia or osmotic-driver pattern. Correct sodium for glucose and address the osmotic driver.');
    next.add('Calculate glucose-corrected sodium when hyperglycemia is present');
  } else if(serum === 'normal'){
    likely.push('Normal osmolality pattern: consider pseudohyponatremia or lab artifact, especially with marked hyperlipidemia/hyperproteinemia.');
    next.add('Review lab method and consider direct ion-selective electrode if pseudohyponatremia is suspected');
  } else if(serum === 'unknown'){
    next.add('Measured serum osmolality is essential to confirm hypotonic hyponatremia');
  } else {
    likely.push('Hypotonic hyponatremia pathway likely. Proceed with urine osmolality and urine sodium interpretation.');
  }

  if(serum === 'low'){
    if(uOsm === 'veryLow'){
      likely.push('Urine osmolality ≤100 suggests maximally dilute urine: primary polydipsia, low solute intake, or reset physiology are key considerations.');
      if(checked('lowSolute')) likely.push('Low-solute intake pattern is specifically flagged. Solute repletion can trigger brisk water diuresis; monitor for rapid correction.');
      if(checked('polydipsia')) likely.push('Primary polydipsia/excess free-water intake is flagged.');
      treatment.push('Consider water intake reduction and solute/protein strategy, but watch closely for spontaneous rapid correction.');
    } else if(uOsm === 'high'){
      likely.push('Urine osmolality >100 suggests ADH is active or water excretion is impaired.');
      if(uNa === 'low'){
        likely.push('Urine sodium <30 suggests low effective arterial volume: hypovolemia, heart failure, cirrhosis, nephrotic state, or low intake.');
        if(checked('hypovolemia')) treatment.push('Hypovolemia clues: isotonic fluid repletion may correct the ADH stimulus; monitor for rapid sodium rise after volume restoration.');
        if(checked('edemaState')) treatment.push('Edematous/low effective arterial volume state: address the underlying HF/cirrhosis/nephrotic physiology and avoid simplistic saline-only interpretation.');
      } else if(uNa === 'high'){
        likely.push('Urine sodium ≥30 with urine osmolality >100 suggests SIADH-like physiology, diuretic effect, adrenal insufficiency, renal salt wasting, or renal impairment.');
        if(checked('siadClues')) likely.push('SIADH clues are selected. Look for pulmonary/CNS disease, malignancy, nausea/pain, and medication triggers.');
        if(checked('lowUricAcid')) likely.push('Low uric acid/high FEUA supports SIADH-like physiology, but interpret with clinical context.');
        if(checked('thiazide')) likely.push('Thiazide-associated hyponatremia can mimic SIADH and should be considered strongly.');
        treatment.push('For SIADH-like pattern, typical first steps include removing triggers and fluid restriction/solute strategy according to local policy.');
      } else {
        next.add('Urine sodium is needed to separate low effective arterial volume from SIADH-like/renal/endocrine patterns');
      }
    } else {
      next.add('Urine osmolality is needed: ≤100 points to excess water/low solute; >100 points to ADH-active physiology');
    }
  }

  if(checked('adrenalThyroid')){
    className = className === 'danger' ? 'danger' : 'warning';
    alerts.push('Endocrine mimic flagged: adrenal insufficiency and severe hypothyroidism should be excluded before labeling SIADH.');
    next.add('Morning cortisol/ACTH pathway or urgent steroid decision if clinically unstable; TSH/free T4 as appropriate');
  }
  if(checked('loopDiuretic')){
    alerts.push('Loop diuretics/active diuresis can make urine sodium harder to interpret. Trend, timing, and clinical context matter.');
  }
  if(checked('odsRisk')){
    className = 'danger';
    alerts.push('High osmotic demyelination risk flagged: use stricter correction limits, frequent monitoring, potassium correction awareness, and consider desmopressin strategy per local protocol.');
    next.add('Define correction target and rescue plan if sodium rises too fast');
  }

  if(likely.length === 0){ likely.push('Insufficient data to classify. Start with measured serum osmolality, urine osmolality, urine sodium, volume/exposure review, and endocrine exclusion.'); }
  if(treatment.length === 0){ treatment.push('Treatment depends on symptom severity and cause. Avoid treating the sodium number alone without defining hypotonicity, chronicity, and correction risk.'); }

  const nextList = Array.from(next);
  const summary = `Hyponatremia engine summary\nSerum Na: ${sodium || 'not entered'} mmol/L\nPattern flags:\n- ${alerts.join('\n- ') || 'None selected'}\nMost likely pathway:\n- ${likely.join('\n- ')}\nNext checks:\n- ${nextList.join('\n- ')}\nTreatment safeguards:\n- ${treatment.join('\n- ')}`;

  $('hyponaResult').innerHTML = `
    <span class="label">Output</span>
    <h3>Hyponatremia diagnostic summary</h3>
    <div class="result-box ${className}"><strong>Safety flags</strong><ul class="output-list">${alerts.length ? alerts.map(a=>`<li>${esc(a)}</li>`).join('') : '<li>No emergency symptom or high-risk correction flag selected.</li>'}</ul></div>
    <div class="result-box"><strong>Most likely diagnostic pathway</strong><ul class="output-list">${likely.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>
    <div class="result-box"><strong>Next checks</strong><ul class="output-list">${nextList.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>
    <div class="result-box warning"><strong>Treatment safeguards</strong><ul class="output-list">${treatment.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>
    <h4>Copy-ready note</h4>
    <pre class="copy-block">${esc(summary)}</pre>
  `;
}

function resetHyponaEngine(){
  $('hyponaForm').reset();
  $('hyponaResult').innerHTML = '<span class="label">Output</span><h3>Hyponatremia diagnostic summary</h3><p>Enter the sodium, symptoms, serum/urine studies, and context to generate a structured pathway.</p>';
}

$('runAf')?.addEventListener('click', runAfTool);
$('resetAf')?.addEventListener('click', resetAfTool);
$('runThrombosis')?.addEventListener('click', runThrombosisEngine);
$('resetThrombosis')?.addEventListener('click', resetThrombosisEngine);

$('runHypona')?.addEventListener('click', runHyponaEngine);
$('resetHypona')?.addEventListener('click', resetHyponaEngine);
