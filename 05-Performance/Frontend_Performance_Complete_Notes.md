# Frontend Performance - Complete Deep Notes

> Based on Frontend System Design concepts and real-world web performance engineering.

---

# Table of Contents

1. Why Performance Matters
2. Understanding Real Users
3. Performance Metrics
4. Core Web Vitals
5. Browser Rendering Pipeline
6. Critical Rendering Path
7. JavaScript Performance
8. React Performance
9. Image Optimization
10. Network Optimization
11. Caching Strategies
12. Rendering Strategies
13. Performance Monitoring
14. Interview Questions

---

# 1. Why Performance Matters

Performance is not just about speed.

It affects:

- User Experience
- Customer Satisfaction
- Revenue
- SEO
- Infrastructure Costs
- Conversion Rates

## User Experience

Users expect websites to respond immediately.

### Human Perception

| Delay | Perception |
|---------|------------|
| 0-100ms | Instant |
| 100-300ms | Responsive |
| 300ms-1s | Noticeable |
| 1-3s | Slow |
| >3s | Frustrating |

If an Add to Cart button takes 2 seconds to respond, users may click multiple times or leave.

---

## Revenue Impact

Every delay affects conversion.

Example:

- Store A loads in 1 second
- Store B loads in 5 seconds

Store A generally converts better because users remain engaged.

---

## SEO Impact

Google uses performance signals.

Better performance often means:

- Better rankings
- More traffic
- Better discoverability

---

# 2. Understanding Real Users

Developers often test using:

- Fast laptops
- High-speed WiFi
- Latest browsers

Real users may have:

- Budget Android phones
- Slow networks
- Weak CPUs

Always optimize for average users.

## Device Constraints

### Low-End Devices

Problems:

- Slow JavaScript execution
- Limited RAM
- Thermal throttling

### High-End Devices

Can hide performance issues that users actually experience.

---

## Network Constraints

Every request involves:

1. DNS Lookup
2. TCP Handshake
3. TLS Handshake
4. Request
5. Response

More requests = more waiting.

---

# 3. Performance Metrics

## TTFB (Time To First Byte)

Measures time until first byte arrives from server.

Lower is better.

Caused by:

- Slow backend
- Slow database
- Slow server location

---

## FCP (First Contentful Paint)

Measures when first visible content appears.

Examples:

- Text
- Images
- SVGs

Target:

< 1.8 seconds

---

## LCP (Largest Contentful Paint)

Measures when the largest visible element loads.

Examples:

- Hero image
- Main heading
- Banner

Target:

< 2.5 seconds

---

## CLS (Cumulative Layout Shift)

Measures visual stability.

Bad Example:

- User clicks button
- Advertisement loads
- Layout shifts

Target:

< 0.1

---

## INP (Interaction to Next Paint)

Measures responsiveness after user interaction.

Target:

< 200ms

---

# 4. Core Web Vitals

Current Core Web Vitals:

- LCP
- CLS
- INP

These are Google's most important user-centric metrics.

## Improving LCP

- Optimize images
- Reduce render-blocking resources
- Use CDN
- Preload critical assets

## Improving CLS

- Reserve image dimensions
- Avoid injecting content above existing content
- Use placeholders

## Improving INP

- Reduce main-thread work
- Split large tasks
- Optimize event handlers

---

# 5. Browser Rendering Pipeline

Understanding this pipeline is critical.

## Step 1: HTML Parsing

Browser parses HTML.

Builds:

DOM Tree

Example:

HTML -> DOM

---

## Step 2: CSS Parsing

Browser parses CSS.

Builds:

CSSOM Tree

---

## Step 3: Render Tree

DOM + CSSOM

Combines into:

Render Tree

Contains only visible elements.

---

## Step 4: Layout

Browser calculates:

- Position
- Width
- Height

for every visible element.

Also called:

Reflow

---

## Step 5: Paint

Browser paints pixels.

Examples:

- Text
- Colors
- Borders

---

## Step 6: Composite

GPU combines layers.

Final result appears on screen.

---

# 6. Critical Rendering Path

The Critical Rendering Path describes the steps required before content appears.

Flow:

HTML
↓
DOM
↓
CSSOM
↓
Render Tree
↓
Layout
↓
Paint
↓
Screen

Goal:

Reduce work in this path.

---

## Render Blocking Resources

Common blockers:

### CSS

Browser must parse CSS before rendering.

### JavaScript

Synchronous scripts can block rendering.

Solution:

- defer
- async

---

# 7. JavaScript Performance

JavaScript goes through:

1. Download
2. Parse
3. Compile
4. Execute

Large bundles increase all four costs.

---

## Main Thread

The main thread handles:

- JavaScript
- Rendering
- User interactions

Heavy JavaScript blocks everything.

Symptoms:

- Laggy clicks
- Freezes
- Janky scrolling

---

## Code Splitting

Instead of shipping one giant bundle:

Load only what is needed.

Example:

Home Page:
- home.js

Dashboard:
- dashboard.js

---

## Lazy Loading

Load components only when needed.

Example:

```js
const Dashboard = React.lazy(() =>
  import("./Dashboard")
);
```

Benefits:

- Smaller initial bundle
- Faster first load

---

# 8. React Performance

## Unnecessary Re-renders

Every re-render costs CPU time.

Avoid unnecessary updates.

---

## React.memo

Prevents component re-renders when props haven't changed.

```jsx
export default React.memo(Card);
```

---

## useMemo

Memoizes expensive calculations.

```jsx
const result = useMemo(() => {
  return expensiveFn(data);
}, [data]);
```

---

## useCallback

Memoizes function references.

Useful when passing handlers to children.

---

## Virtualization

Render only visible rows.

Libraries:

- react-window
- react-virtualized

Useful for:

- Large tables
- Infinite feeds

---

# 9. Image Optimization

Images are usually the largest assets.

## Modern Formats

Prefer:

- WebP
- AVIF

Over:

- PNG
- JPEG

---

## Responsive Images

Serve different sizes.

```html
<img
  srcset="small.jpg 480w,
          large.jpg 1200w"
/>
```

---

## Lazy Loading Images

```html
<img loading="lazy" />
```

Images load only when needed.

---

# 10. Network Optimization

## Minimize Requests

Bad:

50 separate requests

Better:

Bundle resources efficiently.

---

## CDN

Content Delivery Networks place content closer to users.

Benefits:

- Lower latency
- Faster delivery

---

## Compression

Enable:

- Gzip
- Brotli

Reduces transfer size.

---

# 11. Caching Strategies

Caching reduces repeated downloads.

## Browser Cache

Stores:

- Images
- CSS
- JavaScript

---

## HTTP Cache Headers

Common headers:

```http
Cache-Control: max-age=31536000
```

---

## Service Workers

Can cache assets offline.

Used in:

- PWAs

---

# 12. Rendering Strategies

## CSR (Client Side Rendering)

Browser downloads JS and renders.

Pros:

- Rich interactions

Cons:

- Slower initial load

---

## SSR (Server Side Rendering)

HTML generated on server.

Pros:

- Faster first paint
- Better SEO

Cons:

- Increased server load

---

## SSG (Static Site Generation)

Pages generated at build time.

Pros:

- Extremely fast
- Cheap to host

Cons:

- Requires rebuilds

---

# 13. Performance Monitoring

Tools:

## Lighthouse

Measures:

- Performance
- Accessibility
- SEO

---

## Chrome DevTools

Useful tabs:

- Performance
- Network
- Memory

---

## WebPageTest

Tests websites from different locations and devices.

---

# 14. Common Interview Questions

## What is LCP?

Measures loading performance of the largest visible element.

Target:

< 2.5 seconds

---

## Difference Between Reflow and Repaint

Reflow:

Layout recalculation.

Repaint:

Only visual update.

Reflow is more expensive.

---

## What Blocks Rendering?

- CSS
- Synchronous JavaScript

---

## What is Code Splitting?

Breaking large bundles into smaller chunks loaded on demand.

---

## How Can You Improve React Performance?

- React.memo
- useMemo
- useCallback
- Lazy Loading
- Virtualization
- Code Splitting

---

# Final Mindset

Don't optimize for your machine.

Optimize for:

- Real users
- Real devices
- Real networks

Performance is ultimately about reducing:

- Waiting
- Work
- Waste
