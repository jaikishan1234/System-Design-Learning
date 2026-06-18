# Frontend Performance & Core Web Vitals – Detailed Notes

# 1. What is Web Performance?

Web performance measures how fast a website loads, becomes interactive, and remains visually stable for users.

A fast website:
- Loads quickly
- Responds quickly to user actions
- Does not shift content unexpectedly
- Provides a smooth experience

Performance directly impacts:
- User experience
- SEO rankings
- Conversion rates
- Retention

---

# 2. Browser-Centric vs User-Centric Metrics

## Browser-Centric Metrics

These focus on technical events happening inside the browser.

Examples:
- Time To First Byte (TTFB)
- DNS Resolution Time
- Network Requests
- Connection Time
- DOM Content Loaded
- Page Load Time

### Purpose
Used by developers to understand technical bottlenecks.

### Limitation
A page may be technically loaded but still feel slow to users.

---

## User-Centric Metrics

These measure what the user actually experiences.

Examples:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)
- TBT (Total Blocking Time)

### Purpose
Measure perceived performance.

### Advantage
More closely aligned with real user experience.

---

# 3. Core Web Vitals

Core Web Vitals are Google's most important user experience metrics.

Current Core Web Vitals:

1. LCP – Largest Contentful Paint
2. INP – Interaction to Next Paint
3. CLS – Cumulative Layout Shift

Historically:
- FID was used before INP.
- INP has replaced FID.

---

# 4. FCP (First Contentful Paint)

## Definition

FCP measures how long it takes for the first visible content to appear on the screen.

Examples:
- Text
- Image
- SVG
- Canvas

The user sees something useful for the first time.

---

## Timeline

Start Loading
        |
        V
First Text/Image Appears
        |
        V
FCP Achieved

---

## Why It Matters

Without FCP:
- User sees blank screen
- User thinks website is slow

With good FCP:
- User knows page is loading

---

## Optimization

- Reduce render-blocking CSS
- Minify CSS and JS
- Use CDN
- Optimize server response time
- Enable compression

---

# 5. LCP (Largest Contentful Paint)

## Definition

LCP measures when the largest visible content element becomes visible.

Examples:
- Hero image
- Main heading
- Large banner
- Featured video thumbnail

---

## Timeline

Start ---> FCP ---> LCP

FCP:
Something appears.

LCP:
Main content appears.

---

## Example

News Website:

1. Header loads
2. Navigation loads
3. Main article image loads

When the large article image appears,
LCP is recorded.

---

## LCP Thresholds

Good:
<= 2.5s

Needs Improvement:
2.5s – 4.0s

Poor:
> 4.0s

---

## Causes of Poor LCP

- Slow server
- Large images
- Blocking JavaScript
- Slow API requests
- Large CSS files

---

## Optimization

### Image Optimization

- Use WebP/AVIF
- Compress images
- Responsive images
- Lazy load non-critical images

### Server Optimization

- Use CDN
- Cache content
- Improve backend performance

### Rendering Optimization

- Remove unused CSS
- Reduce JS bundle size
- Code splitting

---

# 6. FID (First Input Delay)

## Definition

FID measures delay between:

User Action
      |
      V
Browser Starts Processing

Examples:
- Click
- Tap
- Key press

---

## What It Measures

User clicks button.

Browser is busy executing JavaScript.

Delay before browser responds = FID

---

## Thresholds

Good:
< 100 ms

Needs Improvement:
100–300 ms

Poor:
> 300 ms

---

## Problems Causing High FID

- Heavy JavaScript
- Long tasks
- Large bundles
- Main-thread blocking

---

## Optimization

- Split JavaScript
- Defer non-critical JS
- Reduce third-party scripts
- Web Workers

---

# 7. INP (Interaction to Next Paint)

## Definition

INP measures responsiveness throughout the entire page lifecycle.

It records:

User Interaction
      |
      V
Processing
      |
      V
Visual Update

Time taken = INP

---

## Why INP Replaced FID

FID measures only the first interaction.

INP measures:
- Clicks
- Taps
- Keyboard interactions

across the entire session.

More realistic metric.

---

## Thresholds

Good:
<= 200 ms

Needs Improvement:
200–500 ms

Poor:
> 500 ms

---

## Example

User:

1. Opens page
2. Clicks menu
3. Searches
4. Opens modal

INP measures responsiveness across all interactions.

---

## Optimization

- Reduce JavaScript execution
- Avoid long tasks
- Virtualize large lists
- Use memoization
- Use Web Workers

---

# 8. CLS (Cumulative Layout Shift)

## Definition

CLS measures unexpected movement of page elements.

---

## Example

User tries clicking:

"Login"

Suddenly:
Advertisement loads.

Button shifts downward.

User clicks wrong item.

High CLS.

---

## Common Causes

### Images Without Dimensions

Bad:

<img src="image.jpg">

Good:

<img src="image.jpg" width="800" height="400">

---

### Ads

Ad space loads later and pushes content.

---

### Dynamic Content

Popup
Banner
Notification

Inserted above existing content.

---

### Web Fonts

Font swap changes layout.

---

## CLS Thresholds

Good:
<= 0.1

Needs Improvement:
0.1 – 0.25

Poor:
> 0.25

---

## Optimization

### Reserve Space

Always reserve space for:
- Images
- Videos
- Ads
- Embeds

### Avoid Injecting Content Above Existing Content

Insert below current content whenever possible.

### Font Optimization

- preload fonts
- font-display: swap

---

# 9. TTFB (Time To First Byte)

## Definition

Time from request until first byte is received.

---

Browser Request
        |
        V
Server Processing
        |
        V
First Byte Arrives

TTFB Recorded

---

## Causes of High TTFB

- Slow backend
- Slow database
- No caching
- Slow hosting

---

## Optimization

- CDN
- Server caching
- Query optimization
- Faster hosting

---

# 10. TBT (Total Blocking Time)

## Definition

Measures how long the main thread remains blocked.

---

Blocked Thread Means:

- Can't click
- Can't type
- Can't scroll

---

## Causes

- Large JavaScript bundles
- Heavy calculations
- Third-party scripts

---

## Optimization

- Code splitting
- Lazy loading
- Reduce JS size
- Web Workers

---

# 11. Relationship Between Metrics

Start
 |
 |-------> TTFB
 |
 |-------> FCP
 |
 |-------> LCP
 |
 |-------> User Interacts
 |
 |-------> FID / INP
 |
 |-------> CLS Monitored Entire Time
 |
End

---

# 12. Lighthouse Performance Metrics

Lighthouse commonly reports:

- FCP
- LCP
- CLS
- TBT
- Speed Index

These help identify performance bottlenecks.

---

# 13. Common Interview Questions

## Difference Between FCP and LCP

FCP:
First visible content.

LCP:
Largest visible content.

---

## Difference Between FID and INP

FID:
Only first interaction.

INP:
All interactions.

---

## Why is CLS Important?

Prevents unexpected movement of content.

Improves usability.

---

## How Can You Improve LCP?

- Optimize images
- Use CDN
- Reduce render-blocking resources
- Improve server response time

---

## How Can You Reduce JavaScript Blocking?

- Code splitting
- Lazy loading
- Tree shaking
- Web Workers

---

# Quick Revision Sheet

FCP = First thing visible

LCP = Largest thing visible

FID = Delay before first interaction is handled

INP = Overall responsiveness

CLS = Unexpected layout movement

TTFB = Server response speed

TBT = Main thread blocking time

Core Web Vitals Today:
- LCP
- INP
- CLS
