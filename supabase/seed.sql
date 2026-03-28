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
