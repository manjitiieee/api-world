# API WORLD — Digital API Marketplace

A modern, developer-focused e-commerce website that sells software APIs as digital products.

## Features

- **Home** — Hero, categories, featured APIs, how-it-works
- **API Marketplace** — Filterable product catalog with search
- **Shopping Cart** — Persistent (localStorage), quantity controls
- **Checkout** — PayPal-only payment flow (simulated for demo)
- **Documentation** — Auth, rate limits, quickstart, error handling
- **Contact** — Support form + contact info
- **Success page** — Order confirmation after payment

## Design

- Dark tech aesthetic with cyan accent
- Fully responsive
- Clean typography (Inter + JetBrains Mono)
- Smooth cart sidebar & toast notifications

## How to run

Simply open `index.html` in a modern browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## PayPal Integration (Production)

The checkout currently simulates PayPal for demo purposes. To connect real PayPal:

1. Create a PayPal Business account and get Client ID + Secret
2. Include the PayPal JS SDK:
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
   ```
3. Replace the simulated button in `js/app.js` → `initCheckout()` with official `paypal.Buttons({...})` rendering.

## Product Catalog

12 sample APIs across categories: Weather, Finance, Data, AI/ML, Location, Communication.  
All prices are monthly subscriptions. Cart data is stored in `localStorage` under the key `apiworld_cart`.

## File Structure

```
api-world/
├── index.html          # Home
├── marketplace.html    # Product catalog
├── docs.html           # Documentation
├── contact.html        # Contact form
├── checkout.html       # Checkout + PayPal
├── success.html        # Order confirmation
├── css/styles.css      # All styles
├── js/app.js           # Cart, products, checkout logic
└── README.md
```

Built as a pure static site — no backend required for the demo.

## Admin Panel

Open `admin.html` and sign in with:

- **Username:** `admin`
- **Password:** `admin123`

Features:
- Dashboard with live stats (total products, categories, avg price, endpoints)
- Full product management: Add, Edit, Delete
- Search products by name, category, tags, badge
- Category filter
- Reset to original 12 default products
- All changes are saved to `localStorage` and immediately reflected on the public marketplace

Copyright: © 2008 API WORLD. All rights reserved.
