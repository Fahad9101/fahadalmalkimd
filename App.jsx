
const { useEffect, useMemo, useState } = React;

const ACCESS = { username: "fahad", password: "ChangeThisPassword2026!" };

const GROUPS = [
  {
    id: "vascular-clinic",
    title: "Vascular Medicine Clinic Pathways",
    subtitle: "Visit pathways that force the same phenotype, danger screen, minimum workup, treatment standard, escalation triggers, and copy-ready documentation.",
    tools: ["suspected-pad", "confirmed-pad", "clti", "new-vte", "chronic-vte", "arterial-unusual"]
  },
  {
    id: "antithrombotic-safety",
    title: "Antithrombotic Safety Pathways",
    subtitle: "The confusing bedside antithrombotic situations: anticoagulation failure, DOAC danger zones, perioperative holds, anti-Xa, PF4/HIT/VITT, and thrombocytopenia with thrombosis.",
    tools: ["af", "doac-danger", "periop-doac", "anti-xa", "thrombosis-on-ac", "platelets-thrombosis"]
  },
  {
    id: "gim-diagnostic",
    title: "General Internal Medicine Diagnostic Reasoning",
    subtitle: "Reasoning-heavy diagnostic tools for common-but-dangerous inpatient problems.",
    tools: ["hyponatremia", "hypokalemia", "proteinuria", "cirrhosis-coag", "mins", "medical-vte", "surgical-vte"]
  },
  {
    id: "ctu-standard",
    title: "CTU / Rounding Standard",
    subtitle: "Tools designed to transfer attending-level rounding habits: clarity, danger overnight, discharge readiness, diagnostic uncertainty, and early readmission review.",
    tools: ["ctu-daily", "diagnostic-uncertainty", "discharge-readiness", "readmission-review"]
  }
];

const TOOLS = {
  "suspected-pad": {
    group:"vascular-clinic", title:"Suspected PAD Clinic Pathway", label:"Vascular clinic", intent:"Determine whether symptoms fit PAD, identify limb-threat, order the minimum diagnostic tests, and avoid missing mimics.",
    danger:["Acute limb ischemia symptoms: sudden pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia.","Rest pain, tissue loss, gangrene, infected ischemic foot, rapidly worsening wounds.","Blue toe syndrome, embolic features, aneurysm symptoms, systemic infection."],
    minimum:["Classify symptoms: asymptomatic, atypical leg pain, claudication, rest pain, tissue loss.","Pulse exam: femoral, popliteal, DP/PT; compare sides; Doppler if pulses unclear.","Foot exam: skin, wounds, infection, interdigital spaces, deformity, neuropathy.","Order/confirm ABI. If diabetes/CKD/calcified arteries, add TBI/toe pressures. If exertional symptoms with normal ABI, consider exercise ABI.","Screen mimics: spinal stenosis, hip/knee OA, neuropathy, venous claudication, compartment syndrome, anemia/cardiopulmonary limitation."],
    defaultPlan:["If limb-threat is absent: start risk-factor optimization while confirming physiology.","Document smoking, diabetes, BP, LDL/statin, antiplatelet status if symptomatic, exercise capacity, and foot-care plan.","Do not refer for revascularization until phenotype and objective testing are clear unless CLTI/acute limb ischemia is suspected."],
    escalate:["Any CLTI or acute limb ischemia feature.","Tissue loss with infection or rest pain.","ABI severely reduced, toe pressure very low, or symptoms progressing quickly."],
    fields:["Rest pain","Tissue loss/wound","Infected foot","Absent Doppler/pulse concern","Diabetes/CKD calcification","Normal ABI but exertional symptoms","Smoking"],
    note:"Suspected PAD visit: symptoms classified, limb-threat screen performed, pulse/foot exam documented, ABI/TBI/exercise ABI plan made, mimics considered, GDMT/risk factors reviewed, escalation triggers addressed."
  },
  "confirmed-pad": {
    group:"vascular-clinic", title:"Confirmed PAD Clinic Pathway", label:"Vascular clinic", intent:"Standardize care after PAD is confirmed: phenotype, GDMT, antithrombotics, exercise, foot care, and revascularization triggers.",
    danger:["CLTI: rest pain, tissue loss, gangrene, non-healing ischemic wound.","Acute change from baseline suggesting acute limb ischemia.","Infected ischemic ulcer or systemic illness."],
    minimum:["Define phenotype: asymptomatic, claudication, chronic limb-threatening ischemia.","Confirm objective test: ABI/TBI/toe pressure/duplex/CTA/MRA as appropriate.","Document walking limitation and quality-of-life impact.","Review LDL/high-intensity statin, BP, diabetes, smoking, antiplatelet/antithrombotic status.","Check foot exam and foot-care education."],
    defaultPlan:["High-intensity statin unless contraindicated; intensify LDL reduction if above target.","Symptomatic PAD: antiplatelet therapy unless contraindicated.","Consider vascular-dose rivaroxaban + aspirin in selected symptomatic PAD/high-risk patients with acceptable bleeding risk.","Structured exercise therapy for claudication.","Revascularization referral if CLTI, lifestyle-limiting claudication despite GDMT/exercise, or anatomy suggests high-risk disease."],
    escalate:["CLTI or infected ischemic foot.","Lifestyle-limiting symptoms despite optimized medical therapy and exercise.","Rapid progression or suspected proximal/aortoiliac disease."],
    fields:["Claudication","Lifestyle-limiting","Rest pain","Tissue loss","On statin","On antiplatelet","Bleeding risk high","Smoking"],
    note:"Confirmed PAD: phenotype documented, limb-threat excluded/identified, GDMT reviewed including statin, antiplatelet/antithrombotic plan, smoking/exercise/foot care addressed, and revascularization urgency assigned."
  },
  "clti": {
    group:"vascular-clinic", title:"CLTI / Limb-Threat Pathway", label:"Urgent vascular pathway", intent:"Separate routine PAD from limb threat and define immediate actions.",
    danger:["Rest pain, tissue loss, gangrene, spreading infection, sepsis, severe ischemic pain, or absent Doppler signals.","Diabetic foot infection plus ischemia.","Necrotic tissue, wet gangrene, rapidly progressive wound."],
    minimum:["Immediate vascular assessment/referral pathway.","Photograph/wound description, infection severity, pulses/Doppler, neuropathy, systemic signs.","ABI/TBI/toe pressure/duplex if it does not delay urgent care.","Assess need for antibiotics, source control, admission, imaging, and revascularization planning."],
    defaultPlan:["Do not manage as routine outpatient claudication.","Protect limb, treat infection, optimize pain control, avoid compression if arterial supply uncertain, and expedite vascular/wound team review."],
    escalate:["Any rest pain or tissue loss.","Systemic infection or wet gangrene.","Acute deterioration or neurologic deficit."],
    fields:["Rest pain","Tissue loss","Gangrene","Spreading infection","Systemic symptoms","Absent Doppler","Diabetes"],
    note:"CLTI screen positive/negative. If positive: urgent vascular/wound pathway initiated, infection and limb viability assessed, objective perfusion testing arranged if safe, and revascularization urgency documented."
  },
  "new-vte": {
    group:"vascular-clinic", title:"New VTE Clinic Pathway", label:"Thrombosis clinic", intent:"Define provoking factors, anticoagulant safety, duration frame, what not to test now, and follow-up.",
    danger:["Hemodynamic compromise, RV strain, hypoxia, syncope, extensive clot burden.","Thrombocytopenia with thrombosis suggesting HIT/PF4 spectrum.","Pregnancy/postpartum, cancer-associated thrombosis, severe renal/liver disease, active bleeding."],
    minimum:["Confirm event and site; compare imaging if possible.","Classify risk factor: major transient, minor transient, persistent, unprovoked, cancer-associated, hormone-related, pregnancy/postpartum.","Assess bleeding risk, renal/liver function, CBC/platelets, weight, drug interactions, adherence feasibility.","Choose anticoagulant and dose; define initial duration at first visit.","Decide whether thrombophilia testing is inappropriate now, later, or indicated due to unusual context."],
    defaultPlan:["Typical VTE: DOAC often reasonable if no danger zones.","Warfarin/LMWH/specialist pathway if APS concern, severe renal/liver disease, pregnancy/breastfeeding context, major interactions, malabsorption, or high-risk cancer bleeding scenario.","At 3 months: reassess recurrence risk, bleeding risk, patient preference, and extended therapy."],
    escalate:["Suspected HIT/VITT/APS or thrombosis while anticoagulated.","Unusual-site thrombosis, young arterial thrombosis, recurrent unprovoked VTE.","Bleeding, severe thrombocytopenia, renal/liver instability."],
    fields:["PE with severity concern","Cancer","Pregnancy/postpartum","OCP/estrogen","Thrombocytopenia","APS concern","Renal/liver issue","Unprovoked"],
    note:"New VTE visit: site confirmed, provoking factors classified, bleeding/renal/liver/platelets reviewed, anticoagulant choice justified, duration plan documented, and red flags for APS/HIT/cancer/unusual thrombosis assessed."
  },
  "chronic-vte": {
    group:"vascular-clinic", title:"Chronic VTE / Anticoagulation Follow-up", label:"Thrombosis clinic", intent:"Standardize extended anticoagulation decisions, dose reduction eligibility, post-thrombotic syndrome, and CTEPH screening.",
    danger:["Dyspnea, syncope, exertional limitation, RV dysfunction, or persistent perfusion defects suggesting CTEPH/CTED.","Recurrent thrombosis, bleeding, anemia, renal/liver change, or poor adherence.","Post-thrombotic syndrome with severe symptoms or ulceration."],
    minimum:["Confirm index event category and time since event.","Reassess recurrence risk: unprovoked, persistent risk factor, cancer, APS, prior VTE, male sex, D-dimer/context where used.","Reassess bleeding risk and patient goals.","Review adherence, cost, interactions, renal/liver function, CBC.","Ask about PTS and CTEPH symptoms."],
    defaultPlan:["Provoked by major transient factor: consider stopping after standard treatment if risk resolved and no recurrence concern.","Unprovoked/persistent risk/recurrent VTE: discuss extended therapy if bleeding risk acceptable.","If extended therapy chosen, consider reduced-dose DOAC only when appropriate and not in high-risk APS or other DOAC danger zone."],
    escalate:["Possible CTEPH or recurrent PE symptoms.","Recurrent thrombosis on therapy.","Major bleeding or falling hemoglobin."],
    fields:["Unprovoked","Persistent risk factor","Prior VTE","Bleeding event","Dyspnea/exertional limitation","Leg swelling/PTS","Adherence concern"],
    note:"Chronic VTE follow-up: recurrence and bleeding risks reassessed, extended anticoagulation decision documented, adherence/renal/liver/CBC reviewed, and PTS/CTEPH symptoms screened."
  },
  "arterial-unusual": {
    group:"vascular-clinic", title:"Arterial / Unusual-Site Thrombosis Pathway", label:"Niche vascular workup", intent:"Prevent under-workup and over-testing by matching thrombosis site to the right diagnostic branches.",
    danger:["Arterial thrombosis in young patient, recurrent arterial/venous events, or thrombosis despite anticoagulation.","Splanchnic, portal, hepatic/Budd-Chiari, cerebral venous sinus, renal vein thrombosis.","Thrombosis with cytopenias/hemolysis, systemic inflammation, vasculitis, or malignancy features."],
    minimum:["Define site and mechanism: embolic, in-situ atherosclerotic, inflammatory/vasculitic, compression/anatomic, hypercoagulable, cancer-related.","Ask OCP/estrogen, pregnancy/postpartum, smoking, cancer symptoms, infection/inflammation, procedures/catheters.","Targeted tests by phenotype: APS, JAK2/MPN, PNH flow, Lp(a), malignancy evaluation, nephrotic syndrome, vasculitis/Behçet, cardiac/aortic source."],
    defaultPlan:["Do not send broad inherited thrombophilia reflexively for every event.","Splanchnic/Budd-Chiari: think JAK2/MPN and PNH early.","Young arterial/recurrent arterial: think APS, Lp(a), embolic/cardiac/aortic source, vasculitis, MPN depending CBC/site.","CVST: think OCP/estrogen, pregnancy/postpartum, infection, APS, malignancy, MPN/PNH if clues."],
    escalate:["Organ-threatening thrombosis, progression, recurrent thrombosis, arterial event in young patient, or thrombosis with thrombocytopenia/hemolysis."],
    fields:["Splanchnic/portal/hepatic","CVST","Young arterial thrombosis","OCP/estrogen","Pregnancy/postpartum","High Lp(a)","JAK2/MPN clue","PNH clue","APS clue","Cancer clue"],
    note:"Unusual/arterial thrombosis: site and mechanism defined, OCP/pregnancy/cancer/inflammation/anatomic triggers reviewed, targeted APS/JAK2/PNH/Lp(a)/vasculitis/cardiac workup selected, and escalation need documented."
  },
  "af": {
    group:"antithrombotic-safety", title:"AF Anticoagulation Decision Aid", label:"Shared decision aid", intent:"Frame stroke risk, bleeding risk, and anticoagulant choice with safety exceptions.",
    danger:["Mechanical valve, moderate-to-severe mitral stenosis, rheumatic valvular disease: do not default to DOAC.","Active major bleeding, severe thrombocytopenia, severe renal/liver disease, interacting drugs, pregnancy context.","Aspirin is not an anticoagulation substitute when anticoagulation is indicated."],
    minimum:["Calculate CHA₂DS₂-VASc and estimate annual risk category.","Review HAS-BLED style modifiable bleeding risks: BP, renal/liver, prior bleed, labile INR if on warfarin, age/frailty, antiplatelet/NSAID, alcohol.","Clarify valve/rheumatic status, renal/liver function, drug interactions, adherence/cost, patient preference.","Document shared decision."],
    defaultPlan:["Higher stroke-risk AF: anticoagulation generally recommended unless bleeding risk or contraindication dominates.","DOAC preferred for typical non-valvular AF; warfarin for mechanical valve/moderate-severe MS/rheumatic AF and selected special scenarios.","Fix modifiable bleeding risks rather than using bleeding score alone to deny anticoagulation."],
    escalate:["Complex valvular/rheumatic disease, active bleeding, severe CKD/liver disease, recent stroke/bleed, triple-positive APS."],
    fields:["Age ≥75","CHF","HTN","Diabetes","Stroke/TIA","Vascular disease","Female sex","Prior bleed","Renal/liver issue","Mechanical valve/MS/rheumatic"],
    note:"AF decision: CHA2DS2-VASc and bleeding modifiers reviewed, DOAC/warfarin safety exceptions checked, modifiable bleeding risks addressed, and shared decision documented."
  },
  "doac-danger": {
    group:"antithrombotic-safety", title:"DOAC Danger-Zone Checker", label:"Fast safety screen", intent:"A quick before-you-prescribe check for situations where DOACs may be wrong for the biology or unsafe.",
    danger:["Mechanical valve, moderate-to-severe mitral stenosis, rheumatic AF.","Triple-positive/high-risk APS, pregnancy/breastfeeding context, severe renal/liver disease.","Strong CYP/P-gp interactions, malabsorption/bariatric surgery, extreme weight, active GI/GU bleeding concern."],
    minimum:["Indication: AF, VTE treatment, extended VTE, PAD/CAD vascular-dose, post-op prophylaxis.","Renal function, liver function, weight, age/frailty, interacting drugs, adherence feasibility.","Check whether warfarin/LMWH/UFH/fondaparinux is safer for the scenario."],
    defaultPlan:["Green: typical indication, stable renal/liver function, no major interactions/danger zones.","Amber: renal impairment, extremes of weight, interacting drugs, cancer bleeding risk, adherence/cost concern.","Red: mechanical valve, moderate-severe MS/rheumatic AF, high-risk APS, pregnancy context, severe organ dysfunction."],
    escalate:["Any red-zone item or thrombosis/bleeding while on a DOAC."],
    fields:["Mechanical valve/MS/rheumatic","APS concern","Pregnancy/breastfeeding","Severe CKD/AKI","Severe liver disease","Major interaction","Malabsorption/bariatric","Active bleeding"],
    note:"DOAC safety screen: indication confirmed, renal/liver/drug interaction/adherence reviewed, red-zone contraindications checked, and anticoagulant class justified."
  },
  "periop-doac": {
    group:"antithrombotic-safety", title:"Perioperative DOAC Interruption Planner", label:"PAUSE-style logic", intent:"Translate procedure bleeding risk, renal function, and DOAC type into hold/restart logic.",
    danger:["Neuraxial anesthesia/procedures are high-consequence bleeding situations.","Urgent surgery before adequate DOAC clearance.","Dabigatran with renal impairment requires longer hold."],
    minimum:["Classify procedure bleeding risk: low/very low, moderate, high/neuraxial.","Identify DOAC and renal function; dabigatran is most renal-dependent.","Last dose time, surgery time, thrombotic risk, bleeding risk, neuraxial/epidural plan.","Post-op hemostasis status before restart."],
    defaultPlan:["Low/moderate risk: commonly hold ~1–2 days depending drug/renal/procedure.","High-risk/neuraxial: longer interruption; dabigatran with CrCl <50 often needs longer.","Post-op: resume ~24 h after low/moderate risk if hemostasis secure; 48–72 h after high-risk procedures; consider prophylactic-dose anticoagulation interim when appropriate."],
    escalate:["Neuraxial timing uncertainty, severe renal impairment, urgent surgery, very high thrombosis risk, recent VTE/stroke, mechanical valve."],
    fields:["High bleeding risk","Neuraxial","Dabigatran","CrCl <50","Recent VTE/stroke","Very high thrombosis risk","Hemostasis not secure"],
    note:"Perioperative DOAC plan: procedure bleeding risk, drug, renal function, last dose, neuraxial status, and post-op hemostasis reviewed; hold/restart timing documented."
  },
  "anti-xa": {
    group:"antithrombotic-safety", title:"Anti-Xa Interpretation Assistant", label:"Lab pitfall tool", intent:"Prevent wrong decisions from mistimed or miscalibrated anti-Xa levels.",
    danger:["Anti-Xa must match the drug/calibration: UFH, LMWH, fondaparinux, or DOAC contamination are not interchangeable.","Wrong timing can make a level meaningless.","AT deficiency can reduce activity of AT-dependent drugs and complicate interpretation."],
    minimum:["Drug exposure: UFH infusion, LMWH, fondaparinux, DOAC, or overlap.","Timing: UFH steady-state, LMWH peak ~4 h after dose when checking peak, fondaparinux timing/assay availability.","Renal function, weight, pregnancy, bleeding/thrombosis context, antithrombin level if heparin resistance suspected."],
    defaultPlan:["If wrong assay/timing: repeat correctly before major dose changes unless urgent clinical issue.","UFH resistance: check AT, aPTT/anti-Xa discordance, inflammation, factor VIII/fibrinogen, line/sample issues.","LMWH/fondaparinux: renal accumulation and weight/pregnancy contexts matter."],
    escalate:["Thrombosis with apparently therapeutic level, bleeding with unexpected high level, suspected AT deficiency, renal failure, HIT/PF4 concern."],
    fields:["Wrong timing","Wrong calibration","DOAC exposure","Renal dysfunction","Extreme weight/pregnancy","AT deficiency concern","Thrombosis despite therapy","Bleeding"],
    note:"Anti-Xa interpretation: drug/calibration, sampling time, renal function, weight/pregnancy, AT-dependence, and clinical context reviewed before acting on the level."
  },
  "thrombosis-on-ac": {
    group:"antithrombotic-safety", title:"Thrombosis Despite Anticoagulation Analyzer", label:"Anticoagulant failure", intent:"Separate pseudo-failure from true failure and wrong-anticoagulant biology.",
    danger:["New thrombosis while on anticoagulation can be nonadherence, wrong dose, interaction, malabsorption, renal/liver change, cancer, APS, HIT/PF4, MPN/PNH, nephrotic syndrome, or true failure.","Do not escalate blindly before checking whether the event is acute/new and whether treatment was therapeutic."],
    minimum:["Confirm acute new thrombosis vs chronic/residual clot by imaging comparison.","Check adherence, dosing, interruptions, renal/liver function, weight, interactions, absorption, cost/access.","Identify biology: cancer, APS, HIT/PF4, MPN, PNH, nephrotic syndrome, inflammatory/vasculitic/anatomic triggers.","Assess drug level/anti-Xa only if interpretable and actionable."],
    defaultPlan:["Pseudo-failure: fix adherence/dose/interaction/access rather than labeling failure.","Wrong biology: switch class/pathway, e.g., high-risk APS away from DOAC, HIT away from heparins, AT issue away from AT-dependent assumptions.","True failure: specialist input, confirm therapeutic exposure, consider class switch/intensification."],
    escalate:["Recurrent thrombosis, arterial/unusual-site thrombosis, thrombocytopenia, cancer, APS, severe organ dysfunction, pregnancy/postpartum."],
    fields:["Missed doses/interruption","Wrong dose","Interaction","Malabsorption","Cancer","APS concern","HIT/PF4 concern","MPN/PNH clue","Nephrotic syndrome","New imaging confirmed"],
    note:"Thrombosis on anticoagulation: acute event confirmed, pseudo-failure reviewed, drug/organ/interactions assessed, biology-specific causes considered, and class-switch/escalation plan documented."
  },
  "platelets-thrombosis": {
    group:"antithrombotic-safety", title:"Thrombocytopenia + Thrombosis Decision Tree", label:"PF4/HIT/VITT spectrum", intent:"Force residents to recognize HIT/PF4/VITT and competing emergencies early.",
    danger:["Thrombosis plus platelet fall after heparin/LMWH exposure: HIT until structured probability assessed.","Severe thrombocytopenia + thrombosis after adenoviral vaccine or spontaneous PF4 pattern: VITT/PF4-spectrum concern.","TTP/HUS/DIC/sepsis/APS catastrophic spectrum can mimic."],
    minimum:["Calculate 4Ts: platelet fall, timing, thrombosis, other causes.","Stop heparin/LMWH if intermediate/high probability and use non-heparin anticoagulant pathway.","Send PF4 ELISA and functional assay as appropriate; do not wait if probability high.","Check smear, hemolysis labs, fibrinogen, D-dimer, PT/PTT, renal/liver function, infection/DIC context."],
    defaultPlan:["Low 4Ts: HIT unlikely; look for other causes.","Intermediate/high 4Ts: avoid heparin, start non-heparin anticoagulation if bleeding risk acceptable, send HIT testing.","VITT/PF4 severe phenotype: avoid heparin/platelet transfusion unless compelling, consider IVIG/specialist pathway."],
    escalate:["Severe thrombosis, cerebral/splanchnic sites, platelet count very low, bleeding, DIC, neurologic symptoms, renal failure, suspected VITT/TTP."],
    fields:["Heparin exposure 5-10 days","Platelet fall >50%","New thrombosis","No clear other cause","Vaccine/PF4 context","Splanchnic/CVST","Hemolysis/schistocytes","DIC/sepsis"],
    note:"Thrombocytopenia with thrombosis: 4Ts/PF4 probability assessed, heparin exposure/timing reviewed, competing TTP/DIC/VITT/APS causes checked, and non-heparin/escalation pathway documented."
  },
  "hyponatremia": {
    group:"gim-diagnostic", title:"Hyponatremia Diagnostic Engine", label:"Electrolyte reasoning", intent:"Symptoms first, then tonicity, ADH physiology, urine osmolality, urine sodium, volume context, and correction safety.",
    danger:["Seizure, severe confusion, coma, severe neurologic symptoms: treat as emergency before perfect classification.","Overcorrection risk: chronic hyponatremia, Na very low, alcoholism, malnutrition, liver disease, hypokalemia.","Adrenal insufficiency and hypothyroidism can mimic SIADH."],
    minimum:["Confirm true hypotonic hyponatremia: serum osmolality and glucose correction.","Urine osmolality: dilute urine suggests ADH-off, polydipsia/low solute; concentrated urine means ADH-on.","Urine sodium: low suggests low effective arterial volume; high suggests SIADH/renal salt loss/diuretics/adrenal insufficiency.","Check medications, thiazide, low solute intake, adrenal/thyroid when appropriate, uric acid/FEUA for SIADH support."],
    defaultPlan:["Severe symptoms: hypertonic saline pathway and correction monitoring.","Do not fluid restrict every hyponatremia blindly.","Define cause before chronic treatment; set correction target and monitoring frequency."],
    escalate:["Severe symptoms, Na <120, rapid fall, high ODS risk, overcorrection, unclear etiology with instability."],
    fields:["Severe symptoms","Na <120","Low serum Osm","Urine Osm <100","Urine Na <30","Thiazide","Low solute/polydipsia","Edema/low effective arterial volume","Adrenal/thyroid not excluded","High ODS risk"],
    note:"Hyponatremia: symptoms assessed first, hypotonicity confirmed, urine Osm/Na interpreted, ADH-on/off pathway assigned, endocrine/medication mimics reviewed, and correction-safety plan documented."
  },
  "hypokalemia": {
    group:"gim-diagnostic", title:"Hypokalemia + Acid–Base Engine", label:"Electrolyte reasoning", intent:"Use acid-base pattern and urine electrolytes to separate GI loss, renal loss, RTA, diuretics, and mineralocorticoid states.",
    danger:["K <2.5, ECG changes, arrhythmia, weakness/paralysis, digoxin use, ACS, severe hypomagnesemia.","Hypokalemia with metabolic acidosis suggests different causes than alkalosis."],
    minimum:["Bicarbonate/pH: acidosis vs alkalosis.","Urine potassium or TTKG equivalent when needed: renal vs extrarenal K loss.","Urine chloride in metabolic alkalosis: vomiting/volume depletion vs diuretic/mineralocorticoid.","BP, magnesium, renal function, medications, diarrhea/vomiting."],
    defaultPlan:["Replace potassium and magnesium; treat cause.","Acidosis + diarrhea: GI K/HCO3 loss likely; acidosis + renal K wasting: RTA/renal cause.","Alkalosis + low urine chloride: vomiting/remote diuretic; alkalosis + high BP/renal wasting: mineralocorticoid pattern."],
    escalate:["Severe symptoms, ECG changes, refractory hypokalemia, severe acid-base disorder, suspected paralysis or endocrine emergency."],
    fields:["K <2.5","ECG changes","Low Mg","Metabolic acidosis","Metabolic alkalosis","Diarrhea","Vomiting","Diuretic","Hypertension","Renal K wasting"],
    note:"Hypokalemia: severity/ECG checked, Mg addressed, acid-base pattern assigned, urine K/Cl used when needed, and GI/renal/endocrine medication causes reviewed."
  },
  "proteinuria": {
    group:"gim-diagnostic", title:"Proteinuria Interpreter", label:"Renal/GIM reasoning", intent:"Phenotype proteinuria and avoid assuming normal serum albumin excludes clinically important proteinuria.",
    danger:["Nephrotic-range proteinuria, edema, low albumin, AKI, hematuria/active sediment, hypertension, systemic disease.","Proteinuria plus thrombosis may suggest nephrotic hypercoagulability and antithrombin loss."],
    minimum:["Quantify ACR/PCR, repeat if needed, check serum albumin, creatinine/eGFR, urine sediment, BP.","Determine nephrotic vs non-nephrotic and glomerular vs tubular/overflow clues.","Assess diabetes, lupus/systemic disease, infection, medications, monoclonal disease if indicated."],
    defaultPlan:["Normal albumin does not exclude significant proteinuria; albumin depends on magnitude/duration/synthesis/nutrition/inflammation.","Active sediment/AKI/systemic features: urgent nephrology-style workup.","Nephrotic phenotype: edema, lipids, thrombosis risk, renal referral."],
    escalate:["AKI, active sediment, nephrotic syndrome, severe hypertension, lupus flare, monoclonal concern, thrombosis."],
    fields:["Nephrotic range","Serum albumin low","Albumin normal","Hematuria/sediment","AKI/eGFR fall","Edema","Lupus/systemic","Diabetes","Thrombosis"],
    note:"Proteinuria: ACR/PCR quantified, albumin/eGFR/sediment/BP reviewed, nephrotic/nephritic/systemic features assessed, and referral/workup urgency assigned."
  },
  "cirrhosis-coag": {
    group:"gim-diagnostic", title:"Coagulation in Cirrhosis", label:"Hemostasis reasoning", intent:"Replace INR reflex correction with rebalanced hemostasis thinking.",
    danger:["Active bleeding, high-risk procedure, fibrinogen low, platelets very low, sepsis/renal failure, thrombosis despite high INR.","Lupus anticoagulant or assay issues can confuse interpretation."],
    minimum:["Bleeding/procedure context first, not INR alone.","Platelets and fibrinogen are more actionable than INR in many bleeding/procedure contexts.","Consider TEG/ROTEM if available.","Assess vitamin K deficiency risk: cholestasis, malnutrition, antibiotics, warfarin-like physiology."],
    defaultPlan:["Do not correct INR blindly to make cirrhosis 'safe'.", "Vitamin K is low yield unless deficiency is plausible.","Cirrhosis can bleed and clot; do not call the patient auto-anticoagulated."],
    escalate:["Active bleeding, very low fibrinogen, severe thrombocytopenia, procedure with high bleeding consequence, thrombosis/procedure dilemma."],
    fields:["Active bleeding","High-risk procedure","Fibrinogen low","Platelets low","Thrombosis present","Vitamin K deficiency possible","TEG/ROTEM available","Lupus anticoagulant"],
    note:"Cirrhosis hemostasis: bleeding/procedure/thrombosis context defined, INR not used alone, fibrinogen/platelets/TEG considered, vitamin K rationale documented, and product strategy individualized."
  },
  "mins": {
    group:"gim-diagnostic", title:"MINS Probability & Tracker Tool", label:"Perioperative GIM", intent:"Track post-op troponin signals, competing causes, repeat testing, and follow-up.",
    danger:["Ischemic symptoms, dynamic ECG changes, hemodynamic instability, malignant arrhythmia, acute HF.","Do not miss PE, sepsis, bleeding/anemia, hypotension, hypoxia, AKI as competing triggers."],
    minimum:["Troponin value relative to assay ULN and change/delta.","Symptoms may be absent after surgery; check ECG and vitals.","Look for oxygen supply-demand triggers: anemia/bleeding, hypotension, tachycardia, hypoxia, sepsis, PE, AKI.","Define repeat troponin/ECG and follow-up plan."],
    defaultPlan:["MINS is myocardial injury after non-cardiac surgery likely ischemic and prognostically important even without classic symptoms.","Type 1 MI concern requires urgent cardiology/ACS pathway.","Demand injury pattern still needs risk optimization and follow-up."],
    escalate:["Symptoms, ECG changes, rising troponin, instability, high troponin burden, PE/sepsis/bleeding concern."],
    fields:["Troponin above ULN","Rising delta","Symptoms","ECG changes","Hypotension/tachycardia/hypoxia","Anemia/bleeding","Sepsis","PE concern","AKI/CKD"],
    note:"Post-op troponin: value/delta/ECG/symptoms reviewed, MINS vs type 1 MI vs supply-demand/non-coronary triggers assessed, repeat testing and follow-up plan documented."
  },
  "medical-vte": {
    group:"gim-diagnostic", title:"Medical Inpatient VTE Prophylaxis Standard", label:"Hospital medicine/QI", intent:"Turn prophylaxis status into ordered, on hold with reason, mechanical only, already anticoagulated, or reassess tomorrow.",
    danger:["No prophylaxis order and no documented contraindication.","Bleeding/platelet/procedure hold not reassessed.","Therapeutic anticoagulation misread as prophylaxis gap."],
    minimum:["Is patient medically admitted and at VTE risk?", "Already therapeutically anticoagulated?", "Active bleeding, platelet issue, procedure, renal function?", "Mechanical prophylaxis if pharmacologic held and appropriate.","Document reason and reassessment date."],
    defaultPlan:["Order pharmacologic prophylaxis when indicated and safe.","Hold only with explicit reason and reassessment.","Mechanical only when pharmacologic contraindicated or temporarily unsafe."],
    escalate:["High VTE risk plus bleeding dilemma, severe thrombocytopenia, active bleeding, peri-procedure uncertainty, HIT concern."],
    fields:["Immobile/acute illness","Cancer/prior VTE","Already anticoagulated","Active bleeding","Platelets low","Procedure planned","Renal dysfunction","Mechanical ordered"],
    note:"VTE prophylaxis: indication and contraindications reviewed, status classified, pharmacologic/mechanical plan documented, and reassessment timing set."
  },
  "surgical-vte": {
    group:"gim-diagnostic", title:"Post-op DVT/VTE Prophylaxis Assistant", label:"Surgical prophylaxis", intent:"Orthopedic and non-orthopedic post-op prophylaxis with bleeding, neuraxial, renal, and duration prompts.",
    danger:["Major hip/knee arthroplasty and hip fracture are high VTE-risk contexts.","High bleeding risk or neuraxial catheter changes start timing and agent choice.","Already therapeutic anticoagulation changes the prophylaxis question."],
    minimum:["Procedure type and VTE risk: orthopedic vs non-orthopedic, cancer, prior VTE, immobility, obesity, estrogen/pregnancy, ICU/infection.","Bleeding risk, hemostasis, platelet count, renal function, neuraxial/epidural timing.","Agent selection, start timing, mechanical prophylaxis, and duration."],
    defaultPlan:["High VTE risk with acceptable bleeding risk: pharmacologic prophylaxis plus mechanical when appropriate.","High bleeding risk: mechanical first, reassess pharmacologic start daily.","Major orthopedic surgery often needs extended duration rather than in-hospital-only thinking."],
    escalate:["Neuraxial timing uncertainty, active bleeding, severe renal dysfunction, prior HIT, very high VTE risk plus bleeding risk."],
    fields:["Major hip/knee/hip fracture","Cancer surgery","Prior VTE","Immobile","High bleeding risk","Neuraxial/epidural","Renal dysfunction","Mechanical used"],
    note:"Post-op VTE prophylaxis: surgical VTE/bleeding risk classified, renal/platelet/neuraxial issues reviewed, pharmacologic vs mechanical plan and duration documented."
  },
  "ctu-daily": {
    group:"ctu-standard", title:"CTU Daily Review Checklist", label:"Rounding standard", intent:"A daily attending-style review to make good inpatient care reproducible.",
    danger:["No diagnostic clarity, unstable trajectory, unaddressed overnight risk, missing VTE prophylaxis, antibiotics without plan, pending critical tests, discharge unsafe."],
    minimum:["Problem representation in one sentence.","Top diagnosis and dangerous alternative diagnoses.","What changed overnight? What can deteriorate tonight?", "Lines/tubes/antibiotics/anticoagulation/steroids/oxygen reviewed.","Mobility, nutrition, bowel, delirium, pain, family communication.","Disposition barrier and expected discharge date."],
    defaultPlan:["Each patient needs a syndrome, a probability-based differential, an action for today, an overnight contingency, and a discharge trajectory."],
    escalate:["Unclear diagnosis with deterioration, unstable vitals, high-risk medication without plan, no safe disposition plan."],
    fields:["Diagnosis unclear","Dangerous alternative not addressed","Overnight risk","VTE prophylaxis issue","Antibiotic plan unclear","Pending critical test","Discharge barrier","Family update needed"],
    note:"CTU daily review: diagnostic frame, dangerous alternatives, overnight risks, medication/prophylaxis/antibiotic plan, pending tests, discharge barriers, and communication plan reviewed."
  },
  "diagnostic-uncertainty": {
    group:"ctu-standard", title:"Diagnostic Uncertainty / What Would Change My Mind?", label:"CRFT reasoning", intent:"Convert uncertainty into an explicit plan rather than vague watchful waiting.",
    danger:["Anchoring on a diagnosis without testing disconfirming evidence.","No dangerous alternative diagnosis listed.","Tests ordered without knowing how they change management."],
    minimum:["Syndrome first, diagnosis second.","Leading diagnosis and why.","Dangerous alternatives and why not yet ruled out.","Data that would change probability or severity.","Next action that changes management."],
    defaultPlan:["Document the uncertainty and the trigger for changing course.","If no test changes management, define monitoring and escalation triggers."],
    escalate:["High-stakes uncertainty, deterioration, unexplained shock/hypoxia/AKI/neurologic findings, failure to respond as expected."],
    fields:["Syndrome unclear","Dangerous alternative present","Contradictory data","No management-changing test","Deteriorating","Specialist input needed"],
    note:"Diagnostic uncertainty: syndrome and leading diagnosis stated, dangerous alternatives listed, disconfirming data sought, management-changing next step defined, and triggers to revise diagnosis documented."
  },
  "discharge-readiness": {
    group:"ctu-standard", title:"Discharge Readiness + Early Readmission Risk", label:"Transition standard", intent:"Prevent premature discharge by checking objective stability, diagnostic clarity, medications, follow-up, and social barriers.",
    danger:["Discharge before diagnostic uncertainty is safe.","Pending critical tests without ownership.","High-risk medication changes without monitoring/follow-up.","No follow-up for high-risk patient."],
    minimum:["Diagnosis stable enough for outpatient care.","Vitals/labs/oxygen/mobility/oral intake stable.","Medication reconciliation and anticoagulation/antibiotic/steroid/diuretic plans clear.","Pending results assigned to someone.","Follow-up date, red flags, patient understanding, transport/social supports."],
    defaultPlan:["High risk: keep inpatient or arrange early post-CTU clinic with explicit tasks.","Moderate risk: discharge only with task ownership and early follow-up.","Low risk: routine discharge if objective criteria met."],
    escalate:["Unstable trend, unclear diagnosis, critical pending test, unsafe home supports, high-risk medication with no monitoring plan."],
    fields:["Diagnosis unclear","Vitals/labs unstable","High-risk med change","Pending critical result","No follow-up","Social barrier","Readmission within 30d","Needs early clinic"],
    note:"Discharge readiness: diagnostic stability, objective trends, medication plan, pending-test ownership, follow-up, education, and social barriers reviewed; readmission risk tier assigned."
  },
  "readmission-review": {
    group:"ctu-standard", title:"Early Readmission / Diagnostic Delay Review", label:"QI review", intent:"Classify early readmission causes to improve systems, not blame individuals.",
    danger:["Missed diagnosis or premature closure.","Medication harm or follow-up failure.","Discharge before social/functional readiness.","Pending test not owned."],
    minimum:["Index admission diagnosis and uncertainty at discharge.","Discharge meds and changes.","Pending tests and follow-up plan.","Readmission timing and cause.","Was the event disease progression, diagnostic miss, medication issue, follow-up failure, social barrier, or expected/unpreventable?"],
    defaultPlan:["Classify preventability and system action: pathway, checklist, post-CTU clinic, medication reconciliation, pending-test ownership, patient education."],
    escalate:["Repeated pattern, high-severity harm, diagnostic delay signal, unsafe discharge process."],
    fields:["<7 day readmission","Diagnostic uncertainty at discharge","Medication issue","Pending test issue","Follow-up failure","Social barrier","Disease progression","Potentially preventable"],
    note:"Readmission review: index uncertainty, discharge readiness, medications, pending tests, follow-up, social barriers, and readmission cause classified; system improvement action identified."
  }
};

function getHash(){ return window.location.hash.replace(/^#\/?/, '') || 'home'; }
function go(route){ window.location.hash = route; window.scrollTo({top:0, behavior:'smooth'}); }
function list(items){ return <ul>{items.map((x,i)=><li key={i}>{x}</li>)}</ul>; }
function copy(text){ navigator.clipboard?.writeText(text); }
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }

function App(){
  const [route,setRoute]=useState(getHash());
  const [authed,setAuthed]=useState(localStorage.getItem('famd_access')==='yes');
  useEffect(()=>{ const f=()=>setRoute(getHash()); window.addEventListener('hashchange',f); return()=>window.removeEventListener('hashchange',f);},[]);
  const toolId = route.startsWith('tool/') ? route.split('/')[1] : null;
  const protectedRoute = route !== 'home' && route !== 'contact';
  return <>
    <Header authed={authed} setAuthed={setAuthed}/>
    {toolId ? (authed ? <ToolPage id={toolId}/> : <LoginGate setAuthed={setAuthed}/>) : <Home route={route} authed={authed} setAuthed={setAuthed}/>} 
    {protectedRoute && !toolId && !authed ? null : <Footer/>}
  </>;
}

function Header({authed,setAuthed}){
  return <header className="site-header">
    <button className="brand" onClick={()=>go('home')}><span className="brand-mark">FA</span><span>Fahad Almalki, MD</span></button>
    <nav><button onClick={()=>go('home')}>Home</button><button onClick={()=>go('pathways')}>Clinical Pathways</button><button onClick={()=>go('contact')}>Contact</button>{authed?<button onClick={()=>{localStorage.removeItem('famd_access');setAuthed(false);go('home')}}>Logout</button>:<button onClick={()=>go('pathways')}>Login</button>}</nav>
  </header>
}
function LoginGate({setAuthed}){
  const [u,setU]=useState(''), [p,setP]=useState(''), [err,setErr]=useState('');
  function submit(){ if(u===ACCESS.username && p===ACCESS.password){ localStorage.setItem('famd_access','yes'); setAuthed(true); go('pathways'); } else setErr('Incorrect username or password.'); }
  return <main className="gate"><section className="login-card"><p className="eyebrow">Protected clinical pathway library</p><h1>Login required</h1><p>Public visitors can access the home page only. Clinical pathway tools are for registered/internal users.</p><label>Username<input value={u} onChange={e=>setU(e.target.value)} /></label><label>Password<input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit()}} /></label>{err&&<p className="error">{err}</p>}<button className="primary" onClick={submit}>Enter pathways</button><p className="micro">Current static-site gate is for casual access control only. For real privacy, move protected tools behind Cloudflare Access or a server-auth layer.</p></section></main>
}
function Home({route, authed, setAuthed}){
  useEffect(()=>{ if(route && route!=='home'){ const el=document.getElementById(route); if(el) setTimeout(()=>el.scrollIntoView({behavior:'smooth'}),60); }},[route]);
  return <main>
    <section id="home" className="hero minimal"><div className="hero-inner"><p className="hero-subtitle only">General Internal Medicine · Vascular Medicine · Clinical Reasoning · Quality Improvement</p></div></section>
    <section className="section statement"><p className="eyebrow">Fahad Standard of Care Pathways</p><h1>Convert judgment into repeatable bedside care.</h1><p className="lead">The protected pathway library is organized around how an attending thinks on rounds and in vascular clinic: define the phenotype, screen danger first, complete the minimum workup, choose the default standard plan, and know exactly when to escalate.</p><div className="hero-actions"><button className="primary" onClick={()=>go('pathways')}>{authed?'Open Clinical Pathways':'Login to Clinical Pathways'}</button><button className="ghost" onClick={()=>go('contact')}>Contact</button></div></section>
    <section id="pathways" className="section tinted"><p className="eyebrow">Protected clinical operating system</p><h2>Clinical Pathway Library</h2>{!authed ? <LoginGate setAuthed={setAuthed}/> : <PathwayLibrary/>}</section>
    <section id="contact" className="section contact"><p className="eyebrow">Contact</p><h2>Professional contact</h2><p><a href="mailto:contact@fahadalmalkimd.com">contact@fahadalmalkimd.com</a></p><p><a href="mailto:fahad@fahadalmalkimd.com">fahad@fahadalmalkimd.com</a></p></section>
  </main>
}
function PathwayLibrary(){ return <div className="pathway-groups">{GROUPS.map(g=><section className="pathway-group" key={g.id}><div className="group-head"><p className="eyebrow">{g.title}</p><p>{g.subtitle}</p></div><div className="cards">{g.tools.map(id=><ToolCard key={id} tool={TOOLS[id]}/>)}</div></section>)}</div> }
function ToolCard({tool}){ return <article className="card tool-card"><p className="tag">{tool.label}</p><h3>{tool.title}</h3><p>{tool.intent}</p><button className="primary" onClick={()=>go('tool/'+Object.keys(TOOLS).find(k=>TOOLS[k]===tool))}>Open pathway</button></article> }
function ToolPage({id}){ const tool=TOOLS[id]; if(!tool) return <main className="section"><h1>Tool not found</h1><button onClick={()=>go('pathways')}>Back</button></main>; return <main className="tool-page"><section className="tool-hero"><button className="ghost" onClick={()=>go('pathways')}>← Back to Pathways</button><button className="ghost" onClick={()=>go('home')}>Home</button><p className="eyebrow">{tool.label}</p><h1>{tool.title}</h1><p>{tool.intent}</p></section><PathwayTool tool={tool}/></main> }
function PathwayTool({tool}){
  const [checks,setChecks]=useState({});
  const [free,setFree]=useState('');
  const active=Object.entries(checks).filter(([k,v])=>v).map(([k])=>k);
  const activeDanger=active.filter(x=>tool.danger.join(' ').toLowerCase().includes(x.toLowerCase().split(' ')[0]));
  const triage = active.some(x=>/rest pain|tissue|infected|acute|severe|bleeding|thrombocytopenia|symptoms|ecg|rising|neuraxial|high bleeding|clti|gangrene|absent|pe with severity|thrombosis present|new thrombosis|young arterial|splanchnic|cvst|na <120|k <2.5|active/i.test(x)) ? 'RED / urgent review or escalation trigger present' : active.length ? 'AMBER / caution: proceed with pathway and document rationale' : 'GREEN / no selected danger modifiers, continue standard pathway';
  const note = `${tool.title}\nTriage: ${triage}.\nSelected findings: ${active.length?active.join('; '):'none selected'}.\nStandard note: ${tool.note}\nFree text: ${free || '—'}`;
  return <section className="section tool-body"><div className="tool-grid"><div className="panel"><h2>Patient phenotype / selected findings</h2><p className="micro">Select what applies. The output does not replace judgment; it forces the same bedside checks and escalation triggers.</p>{tool.fields.map(f=><label className="check" key={f}><input type="checkbox" checked={!!checks[f]} onChange={e=>setChecks({...checks,[f]:e.target.checked})}/><span>{f}</span></label>)}<label className="field"><span>Brief patient context</span><textarea value={free} onChange={e=>setFree(e.target.value)} placeholder="e.g., 67M, confirmed PAD with claudication, ABI 0.62; no rest pain/tissue loss..."/></label></div><div className="panel sticky"><h2>Output</h2><div className={'traffic '+(triage.startsWith('RED')?'red':triage.startsWith('AMBER')?'amber':'green')}>{triage}</div><h3>Selected bedside prompts</h3>{list(active.length?active:['No modifiers selected. Complete the minimum standard checklist below.'])}<button className="primary" onClick={()=>copy(note)}>Copy note</button></div></div><div className="result-grid"><Output title="1. What must not be missed today?" tone="danger">{list(tool.danger)}</Output><Output title="2. Minimum standard workup / review">{list(tool.minimum)}</Output><Output title="3. Default management logic" tone="highlight">{list(tool.defaultPlan)}</Output><Output title="4. Escalate / call if" tone="warning">{list(tool.escalate)}</Output><Output title="5. Copy-ready documentation frame"><pre>{note}</pre><button className="ghost" onClick={()=>copy(note)}>Copy note</button></Output></div></section>
}
function Output({title, children, tone=''}){ return <article className={'output '+tone}><h3>{title}</h3>{children}</article> }
function Footer(){ return <footer><p>© Fahad Almalki, MD · General Internal Medicine · Vascular Medicine · Clinical Reasoning</p><p className="micro">Clinical pathway content supports structured thinking and does not replace local policy, specialist consultation, or clinical judgment.</p></footer> }

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
