# nfcWaterCheck

A Next.js + TypeScript app that reads NFC sticker text values (liters of water consumed) and keeps a running daily total.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, press **Start NFC Scan**, then scan a text-based NFC tag containing a number such as `0.25`.

> Web NFC currently works on supported mobile Chromium browsers and secure contexts (HTTPS or localhost).
