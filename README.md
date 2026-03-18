# CodeReview·AI – Instant AI Code Reviews

Paste any code snippet and get an instant AI-powered review: bugs, security issues, performance tips, and style suggestions. No account needed to try.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KlaraKovarova/ai-code-review)

## Features

- **Instant analysis** – results in seconds, no waiting
- **4 review categories** – bugs, security, performance, style
- **3 free reviews** – no sign-up required
- **Bring Your Own Key (BYOK)** – unlimited reviews with your Anthropic API key
- **Any language** – works with JavaScript, Python, Go, Rust, SQL, and more
- **Your code is never stored** – stateless, privacy-first

## What It Catches

| Category | Examples |
|----------|---------|
| Bugs | Null pointer dereferences, off-by-one errors, unchecked errors |
| Security | SQL injection, XSS, hardcoded secrets, insecure dependencies |
| Performance | N+1 queries, unnecessary re-renders, memory leaks |
| Style | Naming conventions, dead code, overly complex logic |

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Local Development

```bash
git clone https://github.com/KlaraKovarova/ai-code-review
cd ai-code-review
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No server-side API key needed — users provide their own key in the UI (stored in browser only).

### Deploy to Vercel

1. Fork this repo
2. Import into [Vercel](https://vercel.com)
3. Deploy — no environment variables required (BYOK model)

### Using BYOK

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. Paste it into the key field in the app (saved to localStorage, never sent to our servers)
3. Enjoy unlimited reviews at your own cost (~$0.001 per review)

## Tech Stack

- [Next.js 15](https://nextjs.org) – React framework
- [Anthropic Claude](https://anthropic.com) – AI backbone
- [Tailwind CSS](https://tailwindcss.com) – Styling

## Pricing Model

| Tier | Reviews | Cost |
|------|---------|------|
| Free | 3 per session | $0 |
| BYOK | Unlimited | ~$0.001/review (your API cost) |

## Contributing

PRs welcome. Open an issue first for major changes.

## License

MIT – see [LICENSE](LICENSE)

---

Built by [AI Works](https://github.com/KlaraKovarova/ai-services-website) · AI-powered tools for developers
