# PITWALL

### An F1-inspired AI repair-decision copilot for drivers who deserve a fair shot.

---

![PitWall Landing Page](screenshots/landing.png)

---

## The Problem

Every year, millions of drivers sit across from a mechanic they don't fully understand, holding a quote they can't interpret, under pressure to approve work they can't evaluate.

Research shows that **women are disproportionately quoted higher prices** at auto repair shops when they're perceived as uninformed — not because they're less capable, but because information asymmetry is a real and exploitable gap. A well-cited NBER field experiment found women were quoted significantly more than men for the same repair when no expected price was mentioned.

Most people don't know what to ask. Most people don't know what can wait. Most people just say yes.

**PitWall changes that.**

---

## What It Does

PitWall acts as your **AI race engineer** during a repair visit — analyzing mechanic recommendations, separating urgent work from optional upsells, and giving you the exact words to say before you approve anything.

> *In F1, no driver makes a pit stop decision alone. They have a race engineer on the wall reading the data, managing the risk, and calling the play. That's PitWall for everyday drivers.*

---

![PitWall Briefing Page](screenshots/demo.png)

---

## Features

- **Paste or upload a repair quote** — text, mechanic notes, or an estimate
- **AI analysis in seconds** — powered by Llama 3.3 70B via Groq
- **Urgency classification per item** — PIT NOW / NEXT LAP / MONITOR / UNCLEAR
- **Plain-English explanations** — no mechanic jargon
- **Verification flags** — items that need a second look before approval
- **Questions for the garage** — specific, respectful, grounded questions to ask
- **What to Say Next** — a calm, confident script tailored to your exact situation
- **8 demo scenarios** — including real-world targeting scenarios
- **Live pit checks counter** — every analysis stored to Supabase in real time

---

## Demo Scenarios

![Demo Scenario Grid](screenshots/pitcheck.png)

PitWall ships with 8 ready-to-run scenarios including:

| Scenario | What it demonstrates |
|----------|----------------------|
| Mixed Repair Quote | Separating safety-critical work from upsells |
| Urgent Safety Issue | Immediate action required — brake line failure |
| The Oil Change That Grew | $40 visit becomes $895 in pressure |
| First Car, First Repair | Intimidation tactics on a first-time owner |
| Vague Safety Warnings | No evidence, no specifics, all urgency |
| Dashboard Warning Lights | Multiple codes — some serious, some not |
| High-Mileage 100k Bundle | Real maintenance vs opportunistic additions |
| Preventive Maintenance Upsell | When "recommended" doesn't mean "required" |

---

## F1 Theme

PitWall maps the driver experience to the F1 pit wall model:

| Real World | PitWall |
|-----------|---------|
| Driver | You |
| Mechanic recommendation | The incoming data |
| PitWall app | Your race engineer |
| Repair decision | The pit stop call |
| PIT NOW | Safety-critical, act today |
| NEXT LAP | Address soon |
| MONITOR | Can wait, keep watching |
| UNCLEAR | Get a second opinion first |

The UI is built on a **Mercedes W14 pit wall aesthetic** — near-black carbon background, platinum silver typography, Petronas teal accents, and Space Mono for all data values.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript + Tailwind CSS |
| UI | Custom F1 theme (Space Grotesk + Space Mono) |
| Backend | FastAPI (Python) |
| AI | Llama 3.3 70B via Groq API |
| Database | Supabase (PostgreSQL) |
| Routing | React Router v6 |

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Groq API key](https://console.groq.com) (free)
- A [Supabase](https://supabase.com) project

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Open `http://localhost:5173`

### Database

```bash
supabase link --project-ref your-project-ref
supabase db push
supabase db query -f supabase/seed.sql --linked
```

---

## Project Structure

```
PitWall/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── PitCheckPage.tsx
│   │   │   └── BriefingPage.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       └── supabase.ts
│   └── index.html
├── backend/
│   └── app/
│       ├── main.py
│       ├── routes/
│       │   ├── analyze.py
│       │   ├── demo.py
│       │   └── stats.py
│       ├── services/
│       │   ├── ai_client.py
│       │   └── prompt_builder.py
│       └── schemas/
│           ├── request_models.py
│           └── response_models.py
└── supabase/
    ├── migrations/
    └── seed.sql
```

---

## Built At

**CodeQuantum 2026** — hosted by UTSA
Solo build · 8 hours · F1 Theme + Best Pitch tracks

---

*PitWall is not a legal or mechanical authority. It is an informational decision-support tool. Always consult a qualified mechanic for safety-critical repairs.*
