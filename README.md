# TrustPay — Multi-Step Escrow Transaction App

## Stack

- React (Vite)
- Tailwind CSS v4
- No external state libraries

---

## Setup Instructions

### 1. Scaffold a Vite + React project

```bash
npm create vite@latest trustpay -- --template react
cd trustpay
npm install
```

### 2. Install Tailwind CSS v4 + Vite plugin

```bash
npm install -D tailwindcss @tailwindcss/vite
```

> ⚠️ No `tailwind.config.js` or `postcss.config.js` needed — Tailwind v4 handles this automatically.

---

### 3. Update `vite.config.js`

Replace the entire file content with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

### 4. Update `src/index.css`

Replace **all** existing content with just this single line:

```css
@import "tailwindcss";
```

---

### 5. Replace `src/App.jsx` with the provided `App.jsx` file

---

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## Screens

| Step | Screen        | Description                                       |
| ---- | ------------- | ------------------------------------------------- |
| 1    | Create Order  | Form: Item, Amount, Buyer, Seller                 |
| 2    | Order Summary | Review details, status: "Payment Secured"         |
| 3    | Delivery      | Random rider assigned, status: "Out for Delivery" |
| 4    | Confirmation  | Enter PIN → "Payment Released Successfully"       |

---

## Notes

- All state is managed with `useState` — no Redux, Zustand, etc.
- Conditional rendering handles screen transitions with a fade-in animation.
- Naira (₦) is used as the currency symbol — swap to your preferred currency if needed.
- Do **not** run `npx tailwindcss init -p` — that command only works with Tailwind v3.
