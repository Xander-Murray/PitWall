-- PitWall demo scenarios seed
-- 8 scenarios covering the full spectrum: evidenced safety issues, upsell stacks,
-- pressure tactics, and targeted scenarios for first-time and female drivers.
-- Each includes per-item pricing so the price reasonableness feature can compare.

INSERT INTO demo_scenarios (title, description, quote_text) VALUES

('Urgent Safety Issue',
 'Clear safety-critical repairs backed by inspection findings — a legitimate quote.',
 'Vehicle: 2018 Ford F-150, 74,200 miles. Customer reports soft brake pedal and pulling left when braking.

Inspection findings:
- Left front brake caliper: seized and not releasing. Confirmed on lift — caliper locked, visible brake drag. Brake fluid leaking at caliper bleed screw. $420 parts and labor.
- Brake lines (front left): external corrosion visible near caliper, surface rust penetrating line wall. Recommend replacement before failure. $180.
- Brake fluid: tested at 3.8% moisture content — above 3.5% replacement threshold per test strip. Flush and refill: $85.
- Right rear brake pads: measured at 2mm — at minimum service limit. Replace before next inspection. $160.

Technician notes: Vehicle should not be driven until caliper and brake line are addressed. Photos of caliper and corrosion on file. Estimate total: $845.'),

('The Oil Change That Grew',
 'Came in for a $49 oil change. Left with a $950 estimate and a lot of pressure.',
 'Vehicle: 2019 Toyota Camry, 38,400 miles. Customer in for standard oil change.

Oil change completed: $49.

Technician multi-point inspection findings:
- Serpentine belt: showing wear, recommend replacement before it snaps and leaves you stranded. $185.
- Fuel system cleaning: injectors should be cleaned every 30k miles for performance. $149.
- Cabin air filter: dirty, affecting your AC and heat. $79.
- Power steering fluid: looks dark, should be flushed. $119.
- Engine air filter: dirty, reducing fuel economy. $59.
- Coolant flush: due by age, recommend before it causes overheating. $129.
- Battery: voltage reading marginal, could fail any time especially in cold weather. $189.
- Wiper blades: worn, unsafe in rain. $45.

Service advisor note: We strongly recommend approving all items today. Your car is overdue for this maintenance and we would hate to see you stranded. Total additional estimate: $954.'),

('Vague Safety Warnings',
 'Mechanic flagged 6 dangerous problems — but could not describe a single one specifically.',
 'Vehicle: 2016 Honda Civic, 61,000 miles. Customer brought in for a clicking noise when turning.

Technician recommendations after inspection:
- Front suspension: something is loose up there, could be a tie rod or ball joint — hard to say without more disassembly. Dangerous if it lets go while driving. Estimate pending: $300–$700.
- Brakes: getting low, probably a few months left but could go any time. $280.
- Radiator hose: looks old and soft, these things blow without warning. $95.
- Transmission: slipping slightly, you might not feel it yet but we can. If you wait it could be a $2,000 repair. Service now: $220.
- Timing belt: this is due soon and if it breaks the engine is done. $650.
- Rear shocks: soft, you can feel it on bumps. $380.

Technician told customer: I would not feel comfortable letting my family drive this car right now. Total estimate: $1,400 to $2,200. Recommend approving full disassembly inspection before final quote.'),

('First Car, First Repair',
 'First-time car owner. Shop used technical jargon, implied the car was unsafe to drive, and quoted $1,170.',
 'Vehicle: 2015 Honda Civic, 67,000 miles. Customer is first-time car owner, brought in for squeaking noise on brakes.

Service advisor findings:
- Front struts: leaking oil — vehicle handling is compromised and unsafe. Must replace. $480.
- Brake rotors: showing wear grooves from worn pads — recommend resurface or replace. $220.
- Transmission service: fluid is dark and burnt, risk of total transmission failure if not serviced immediately. $180.
- Spark plugs: due for replacement at this mileage. $120.
- Tire rotation and balance: tires showing uneven wear caused by the bad struts. $80.
- Front end alignment: required due to strut wear, tires will keep wearing unevenly without it. $90.

Service advisor told customer: Your car is not safe to drive in this condition. We strongly recommend approving all repairs today — if something fails on the road it could cost you much more. Total estimate: $1,170.'),

('100k Service Bundle',
 'Hit 100k miles. Shop recommended 8 services — some genuinely due, others opportunistic.',
 'Vehicle: 2014 Nissan Altima, 102,500 miles. Brought in for 100,000-mile service.

Shop recommendations:
- Timing chain tensioner inspection: showing slack at high mileage, rattling on cold start. Recommend inspection and potential replacement. $320.
- Spark plugs (iridium, set of 4): original plugs, due at 100k per manufacturer schedule. $240.
- Serpentine belt: showing minor surface cracking, recommend proactive replacement. $130.
- Coolant flush: manufacturer recommends every 50k miles. Due. $120.
- Fuel injector cleaning: improve fuel economy and performance. $149.
- Power steering flush: fluid discolored. $110.
- Differential fluid: front and rear, standard interval service. $180.
- Air filter: dirty, reducing MPG. $55.

Service advisor note: at 100k miles these are all expected maintenance items. Recommend approving as a package for a discount. Total estimate: $1,304.'),

('Dashboard Warning Lights',
 'Check engine light on with 3 codes. Shop quoted $1,200 — but not all codes are equal.',
 'Vehicle: 2017 Chevrolet Malibu, 88,300 miles. Check engine light on, slight reduction in fuel economy noticed by customer.

Diagnostic scan results:
- P0420 — Catalytic converter efficiency below threshold, Bank 1. Technician confirms via live O2 sensor data: upstream and downstream sensors showing same reading, converter not functioning. Recommend replacement: $920.
- P0171 — System running lean, Bank 1. Possible causes: vacuum leak, dirty MAF sensor, or failing O2 sensor. Smoke test recommended to diagnose before replacing parts. Smoke test fee: $95. Potential repair $150–$380 depending on cause.
- P0456 — Small EVAP system leak (less than 0.020 inches). Often caused by loose gas cap or minor hose crack. Recommend checking gas cap first. If not resolved, EVAP smoke test: $95. Possible purge valve replacement: $120.

Technician recommendation: Replace catalytic converter now, diagnose lean condition and EVAP before quoting repairs. Total current estimate: $1,230.'),

('Post-Accident Add-Ons',
 'Brought in for a minor fender bender repair. Shop found six unrelated problems — none of them mentioned before the accident.',
 'Vehicle: 2020 Subaru Outback, 29,800 miles. Vehicle in for minor rear bumper repair after low-speed parking lot impact.

Bumper repair (reason for visit): $640. Parts and labor, paint matched.

Additional items identified during intake inspection:
- Rear differential fluid: dark, recommend service. $120. Note: no connection to impact area.
- Cabin air filter: dirty. $65.
- Brake fluid: looks old, recommend flush. $85.
- Windshield wipers: worn, recommend replacement. $45.
- Engine air filter: slightly dirty, preventive replacement recommended. $55.
- Tire rotation: due by mileage. $45.

Service advisor note: Since the car is already in the shop, now is a great time to take care of these items. Saves you a trip. Total additional estimate: $415.'),

('Dealer Service Visit',
 'Took a 2-year-old car to the dealership for an oil change. Came out with a 7-item service checklist.',
 'Vehicle: 2022 Honda CR-V, 22,100 miles. Brought to dealership for first scheduled oil change.

Oil change and tire rotation (included in service package): $0.

Multi-point inspection findings — dealer recommendations:
- Brake fluid: Honda recommends replacement every 3 years regardless of mileage. Vehicle is 2 years old. $99.
- Cabin air filter: showing dust accumulation, recommend replacement for air quality. $89.
- Engine air filter: recommend replacement for optimal performance. $69.
- Fuel system cleaning: dealer-branded induction service, improves throttle response. $199.
- Wheel alignment: technician recommends checking alignment annually. $119.
- Tire balancing: minor vibration noticed at highway speed during road test. $89.
- Honda Care extended warranty: protect your investment past 36k miles. $1,495.

Service advisor note: These are all Honda-recommended maintenance items. We can get everything done today while you wait. Total estimate: $2,159 (including warranty).');
