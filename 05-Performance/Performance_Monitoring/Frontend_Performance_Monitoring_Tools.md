# Frontend Performance Monitoring Tools

## Overview

Performance monitoring tools help developers measure, debug, and improve web application performance.

### Categories

1. Developer Mode Tools
2. Simulated Data Tools
3. Real User Monitoring (RUM) Tools

---

## Developer Mode Tools

### Lighthouse
- Google's auditing tool
- Measures FCP, LCP, CLS, TBT, Speed Index
- Generates optimization suggestions
- Uses simulated testing

### Network Tab
- Analyze network requests
- View DNS Lookup, TTFB, SSL, Download Time
- Debug APIs and assets

### Performance Tab
- Analyze rendering performance
- JavaScript execution
- Layout and paint operations
- Detect long tasks and bottlenecks

---

## Simulated Data Tools

### WebPageTest
- Test from different countries
- Test different devices and browsers
- Provides waterfall charts
- Measures FCP, LCP, CLS, TTFB

---

## Real User Monitoring (RUM)

### CRUX
Chrome User Experience Report

Measures:
- LCP
- CLS
- INP
- Real-world performance data

### PageSpeed Insights
Combines:
- Lighthouse (Lab Data)
- CRUX (Field Data)

### Microsoft Clarity
- Session recordings
- Heatmaps
- Scroll maps

### New Relic
- Frontend monitoring
- Backend monitoring
- End-to-end observability

### Sentry
- Error monitoring
- Performance monitoring
- Transaction tracing

### Google Analytics
- User behavior
- Sessions
- Bounce rate
- Conversion tracking

---

## Comparison Table

| Tool | Type | Purpose |
|------|------|------|
| Lighthouse | Simulated | Performance Audits |
| Network Tab | Developer | Request Analysis |
| Performance Tab | Developer | Rendering Analysis |
| WebPageTest | Simulated | Performance Testing |
| CRUX | Real User Data | Core Web Vitals |
| PageSpeed Insights | Mixed | Performance Reports |
| Microsoft Clarity | Real User Data | Behavior Analytics |
| New Relic | Real User Data | Full Stack Monitoring |
| Sentry | Real User Data | Error Monitoring |
| Google Analytics | Real User Data | User Analytics |

---

## Quick Revision

Developer Tools:
- Lighthouse
- Network Tab
- Performance Tab

Simulated Tool:
- WebPageTest

Real User Tools:
- CRUX
- PageSpeed Insights
- Microsoft Clarity
- New Relic
- Sentry
- Google Analytics
