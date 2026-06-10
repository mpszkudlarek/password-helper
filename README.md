# Password Helper

A tiny client-side app for reading masked passwords character by character. Type a password (max 15 characters) and see each character with its position number - useful when a website asks for "the 3rd, 7th and 11th character of your password".

Nothing is sent or stored. The password only lives in React state in your browser.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Development

```bash
npm install
npm run dev
```

1Open http://localhost:3000.

## Deployment

Designed for [Vercel](https://vercel.com) - no configuration needed:

```bash
vercel
```
