# Product Explorer

## Live demo

[Open Product Explorer](https://farhan-ad.github.io/ProductExplorer/)

## Overview
Product Explorer is a small product catalogue where you can browse products from DummyJSON and inspect their details. You can filter and sort the catalogue, then add products to a cart that stays saved in your browser between visits.

## Features
- Search products by title.
- Filter the catalogue by category.
- Sort by price from low to high or high to low.
- Open a product details page to view its image, description, category, rating, stock, and price.
- Add products to the cart, change quantities, remove items, and view line totals and the cart total.
- Responsive layouts for smaller and larger screens, with keyboard-focus styles and reduced-motion support.

## Technologies
- **HTML** for the catalogue, product details, and cart pages.
- **CSS** for the shared design system, responsive layouts, and interaction states.
- **Vanilla JavaScript** for fetching products, rendering the pages, filtering, sorting, and cart behaviour.
- **DummyJSON** as the sample product API.
- **`localStorage`** to persist cart data in the browser.

## Run locally
1. Open the `ProductExplorer` folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. In the Explorer panel, right-click `index.html` and select **Open with Live Server** (or select **Go Live** in the status bar).
4. Use the Shop and Cart navigation links to explore the app.

## Implementation decisions
- **Calculate money in paise:** prices are rounded to integer paise for line-total and cart-total calculations, then divided by 100 for display. This avoids accumulating floating-point fractions during the total calculation.
- **Save before updating in-memory cart state:** cart operations create a proposed next cart and write it to `localStorage` first. The in-memory cart is updated only after saving succeeds, so a failed save does not make the UI state appear successfully persisted.
- **Refresh after cached navigation:** the `pageshow` handlers reload cart data when a page is restored from the browser's back-forward cache and re-render the cart page. The cart page also attempts to restore keyboard focus to the relevant control.

## Limitations
- Cart data is stored in `localStorage` for the current browser and site origin; it is not synced across browsers or devices.
- There is no checkout flow or payment processing.
- Sample prices come from DummyJSON and are displayed as INR; the app does not convert currencies.
