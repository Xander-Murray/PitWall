-- Seed 5 demo scenarios for PitWall
INSERT INTO demo_scenarios (title, description, quote_text) VALUES

('Mixed Repair Quote',
 'Urgent brake concern mixed with likely upsell items -- a classic shop visit.',
 'Vehicle in for routine inspection. Technician recommends: Front brake pads replacement -- pads worn to 2mm, metal-on-metal contact imminent. Brake fluid flush -- fluid showing moisture contamination. Cabin air filter replacement -- filter visibly dirty. Fuel injector cleaning service -- recommended every 30k miles. Total estimate: $485.'),

('Preventive Maintenance Upsell',
 'Mostly optional maintenance items presented as urgent -- good scenario to verify.',
 'Customer brought in for oil change. Additional services recommended: Transmission fluid flush -- technician says fluid is dark and should be changed. Fuel system cleaning -- injector cleaner treatment to improve performance. Engine oil treatment additive -- BG MOA added to engine for protection. Power steering fluid exchange -- fluid looks old. Coolant top-off service -- minor coolant loss noted. Total estimate: $620.'),

('Urgent Safety Issue',
 'Clear safety-critical repair requiring immediate attention.',
 'Customer reports soft brake pedal and pulling to the left when braking. Inspection findings: Left front brake caliper seized -- caliper not releasing, causing brake drag and pull. Brake line showing external corrosion near left front wheel -- potential leak risk. Right rear brake drum worn past service limit. Brake fluid critically low. Technician advises do not drive until repaired. Estimate: $890.'),

('High-Mileage 100k Service Bundle',
 'Major service milestone with many items -- some necessary, some opportunistic.',
 'Vehicle at 103,000 miles. Shop recommending full 100k service: Timing belt and water pump replacement -- due by mileage, critical failure risk if skipped. Spark plugs replacement -- original plugs, recommended at 100k. Serpentine belt inspection -- showing cracking, recommend replacement. Coolant system flush -- old coolant, recommend full exchange. Power steering flush -- fluid dark. Differential fluid change -- standard maintenance. Air filter replacement -- dirty. Wiper blades -- worn. Total estimate: $1,450.'),

('Dashboard Warning Lights',
 'Multiple warning codes -- some serious, some emissions-related.',
 'Check engine light on, customer reports slight decrease in fuel economy. Diagnostic scan results: P0420 -- Catalytic converter efficiency below threshold, Bank 1. P0171 -- System too lean, Bank 1, possible vacuum leak or O2 sensor. P0442 -- Small EVAP system leak detected. Technician recommends: Replace catalytic converter ($850), replace upstream O2 sensor ($180), smoke test for EVAP leak ($95), possible EVAP purge valve replacement ($120). Total estimate: $1,245.');

-- Additional targeted scenarios
INSERT INTO demo_scenarios (title, description, quote_text) VALUES

('The Oil Change That Grew',
 'Went in for a $40 oil change. Left with a $900 estimate — and a lot of pressure.',
 'Customer came in for standard oil change. Technician performed multi-point inspection and identified the following additional concerns: Serpentine belt worn and cracking — recommend immediate replacement, belt failure will leave you stranded ($180). Power steering fluid contaminated — flush and refill required ($120). Cabin air filter extremely dirty — restricted airflow affecting AC and heat ($60). Fuel system cleaning — injectors dirty, recommend full service to prevent breakdowns ($150). Wiper blades worn — unsafe in rain ($45). Coolant looks old — recommend flush before winter ($120). Engine air filter dirty ($40). Battery voltage reading low — recommend replacement before it fails and leaves you stranded ($180). Total additional service estimate: $895. Technician recommends approving all items today for safety.'),

('First Car, First Repair',
 'First-time car owner. Mechanic used technical language and implied the car was unsafe to drive without $1,200 in work.',
 'Vehicle: 2015 Honda Civic, 67,000 miles, customer is first-time owner. Service advisor states the following issues were found during inspection: Front struts leaking — vehicle is unsafe, handling is compromised, must be replaced soon ($480). Brake rotors showing wear grooves — recommend resurface or replace ($220). Transmission service overdue — fluid dark and burnt, risk of transmission failure if not serviced ($180). Spark plugs due for replacement at this mileage ($120). Tire rotation and balance — tires showing uneven wear from bad struts ($80). Front end alignment needed due to strut wear ($90). Service advisor told customer: your car is not safe to drive in this condition. We strongly recommend approving all repairs today. Total estimate: $1,170.'),

('Vague Safety Warnings',
 'Mechanic said several things were about to fail — but gave no specifics, no evidence, and a lot of urgency.',
 'Customer brought vehicle in for a noise when turning. Technician says the following items need attention: Something in the front suspension is loose — could be a tie rod or ball joint, hard to tell without more disassembly. Brakes are getting low — probably have a few months left but could go any time. Radiator hose looks old — these things can blow out without warning. Transmission is slipping slightly — you might not notice it yet but we can feel it. Timing belt is due — if this breaks your engine is done. Rear shocks are soft — you can feel it on bumps. Technician said: I would not feel comfortable letting my wife drive this car in this condition. Recommend approving full inspection and all repairs. Full estimate pending further disassembly: estimated $1,400 to $2,200.');
