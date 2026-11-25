# ADR-003: Environment Variables

## Status
Accepted

## Required Environment Variables

### Public (Build-time)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://targetpaymentbenefits.com` |

### Server-only (Runtime)
| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token(s), comma-separated for multi-bot | `123456:ABC-DEF` |
| `TELEGRAM_CHAT_ID` | Telegram chat ID(s), comma-separated | `-1001234567890` |
| `GATE_REFERRER` | Optional. Domain that grants gate cookie on referral | `targetpayandbenefits.com` |

### Vercel Dashboard Setup
1. Go to Project Settings → Environment Variables.
2. Add each variable above for Production + Preview environments.
3. `NEXT_PUBLIC_SITE_URL` should be set for all environments.
4. `DATABASE_URL` requires a Neon project — create one at neon.tech and copy the connection string.
5. For Telegram, create a bot via `@BotFather`, get the token, add bot to a group, and get the chat ID.

### Telegram Webhook Setup
After deployment, set the webhook URL:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://targetpaymentbenefits.com/api/telegram
```
