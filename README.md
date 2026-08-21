# Splitzy

**Splitzy** is a modern shared expense splitting web app — think Splitwise, built for friends, roommates, and travel groups. Track who paid what, split bills fairly, view balances in real time, and settle up when you're ready.

> **Live app:** [splitzy-snowy.vercel.app](https://splitzy-snowy.vercel.app/)  
> **Repository:** [github.com/Nisarg-13/Splitzy](https://github.com/Nisarg-13/Splitzy)

---

## Features

- **Group & individual expenses** — Split costs with a group or one-on-one with a friend
- **Flexible split types** — Equal, percentage, or exact amount splits
- **Real-time balances** — See who owes whom instantly as expenses are added
- **Settlements** — Record payments and clear outstanding debts
- **Dashboard analytics** — Monthly spending charts and year-to-date totals
- **Contacts & groups** — Manage people you share expenses with and create expense groups
- **Payment reminders** — Automated daily email reminders for outstanding debts
- **AI spending insights** — Monthly AI-generated spending reports via Google Gemini
- **Secure authentication** — Sign in with Clerk; data synced to Convex in real time

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) |
| Auth | [Clerk](https://clerk.com/) |
| Backend / Database | [Convex](https://www.convex.dev/) |
| Background jobs | [Inngest](https://www.inngest.com/) |
| Email | [Resend](https://resend.com/) |
| AI | [Google Gemini](https://ai.google.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |

---

## Project Structure

```
Splitzy/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign-in & sign-up (Clerk)
│   ├── (main)/             # Authenticated app (dashboard, expenses, groups, etc.)
│   └── api/inngest/        # Inngest webhook endpoint
├── components/             # Shared UI and domain components
│   └── ui/                 # shadcn/ui primitives
├── convex/                 # Backend — schema, queries, mutations, actions
├── hooks/                  # Custom React hooks (Convex wrappers, user sync)
├── lib/                    # Utilities, landing content, Inngest jobs
├── public/                 # Static assets
└── middleware.js           # Clerk route protection
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm
- Accounts for: [Clerk](https://clerk.com/), [Convex](https://www.convex.dev/), [Resend](https://resend.com/), [Inngest](https://www.inngest.com/), and [Google AI Studio](https://aistudio.google.com/) (Gemini API key)

### 1. Clone the repository

```bash
git clone https://github.com/Nisarg-13/Splitzy.git
cd Splitzy
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is required due to a peer dependency conflict between `date-fns@4` and `react-day-picker@8`.

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Resend (for email notifications)
RESEND_API_KEY=re_...

# Google Gemini (for AI spending insights)
GEMINI_API_KEY=...
```

Also set the following in your **Convex dashboard** environment variables:

```env
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

Configure Clerk as an auth provider in the Convex dashboard so JWT tokens are validated correctly.

### 4. Start Convex

```bash
npx convex dev
```

This syncs your Convex functions and starts the development deployment.

### 5. Start the Next.js dev server

In a separate terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Set up Inngest (optional — for background jobs)

Register your local app with the Inngest dev server pointing at `/api/inngest`. See the [Inngest Next.js guide](https://www.inngest.com/docs/getting-started/nextjs-quick-start) for details.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## App Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/sign-in`, `/sign-up` | Clerk authentication |
| `/dashboard` | Overview — balances, spending chart, groups |
| `/expenses/new` | Add a new expense |
| `/contacts` | Manage contacts and create groups |
| `/groups/[id]` | Group detail — expenses, balances, members |
| `/person/[id]` | One-on-one expense history with a contact |
| `/settlements/[type]/[id]` | Record a settlement payment |

Protected routes are guarded by Clerk middleware in `middleware.js`.

---

## Data Model

Convex stores four main tables:

| Table | Description |
|-------|-------------|
| `users` | User profiles synced from Clerk |
| `expenses` | Shared expenses with split details |
| `settlements` | Payment records between users |
| `groups` | Expense groups with member roles |

See `convex/schema.js` for the full schema definition.

---

## Background Jobs

Two Inngest cron jobs run automatically in production:

| Job | Schedule | Description |
|-----|----------|-------------|
| Payment reminders | Daily at 10:00 UTC | Emails users with outstanding one-on-one debts |
| Spending insights | 1st of each month at 08:00 UTC | AI-generated monthly spending report via Gemini |

---

## Seeding Demo Data

After at least 3 users have signed up, you can populate the database with sample data:

```bash
npx convex run seed:seedDatabase
```

---

## Deployment

The app is deployed on Vercel at **[https://splitzy-snowy.vercel.app/](https://splitzy-snowy.vercel.app/)**.

### Vercel + Convex (recommended)

This project uses the [Convex Vercel integration](https://docs.convex.dev/production/hosting/vercel). The build is handled by `scripts/vercel-build.mjs`:

- **Production** (`main` branch): runs `npx convex deploy --cmd 'npm run build'`
- **Preview** (PR branches): runs `npm run build` only, using `NEXT_PUBLIC_CONVEX_URL`

**Required Vercel environment variables:**

| Variable | Environment | Purpose |
|----------|-------------|---------|
| `CONVEX_DEPLOY_KEY` | **Production only** | Production deploy key from Convex dashboard |
| `NEXT_PUBLIC_CONVEX_URL` | Preview | Convex deployment URL for PR preview builds |
| `NEXT_PUBLIC_CONVEX_URL` | Production | Set automatically by `convex deploy` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | All | Clerk frontend key |
| `CLERK_SECRET_KEY` | All | Clerk backend key |
| `RESEND_API_KEY` | All | Email notifications |
| `GEMINI_API_KEY` | All | AI spending insights |

> **Important:** In Vercel, scope `CONVEX_DEPLOY_KEY` to **Production only**. If the production deploy key is also enabled for Preview, builds fail with: *"Detected a non-production build environment and CONVEX_DEPLOY_KEY for a production Convex deployment."*

**Required Convex dashboard environment variables:**

| Variable | Purpose |
|----------|---------|
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk JWT validation for Convex auth |

Generate the production deploy key in the [Convex dashboard](https://dashboard.convex.dev/) under **Deployment Settings → Deploy Keys**, and add it to Vercel with **Production** checked only.

### Manual deployment

1. Deploy Convex functions: `npx convex deploy`
2. Set all environment variables in your hosting provider
3. Build and deploy the Next.js app: `npm run build && npm start`
4. Register the production Inngest endpoint at `/api/inngest`

---

## Author

**[Nisarg-13](https://github.com/Nisarg-13)**

---

## License

This project is private.
