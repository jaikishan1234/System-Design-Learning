# Security Headers Theory Notes

# Introduction

Security headers are HTTP response headers that improve the security of web applications.

They help browsers understand:

- How to handle requests
- How to process content
- How to enforce secure communication
- How to prevent attacks

These headers are important in backend development and system design.

---

# Security Headers Overview

The main security headers discussed are:

1. X-Powered-By
2. Referrer-Policy
3. X-Content-Type-Options
4. X-XSS-Protection
5. HSTS (Strict Transport Security)

---

# 1. X-Powered-By

## What is it?

Many backend frameworks expose the technology being used.

Example:

```txt
X-Powered-By: Express
```

This tells attackers that the server uses Express.js.

---

## Why is it risky?

Attackers can:

- Detect backend technology
- Search for known vulnerabilities
- Target framework-specific attacks

This process is called:

```txt
Technology Fingerprinting
```

---

## Best Practice

Remove this header to hide backend implementation details.

---

## Benefit

- Reduces information leakage
- Makes attacks harder

---

# 2. Referrer-Policy

## What is Referrer Information?

When a user clicks a link from one website to another, the browser may send:

```txt
Referer Header
```

Example:

```txt
https://example.com/products/123
```

---

## Problem

Sensitive information inside URLs may leak to external websites.

Example:

```txt
https://myapp.com/reset-password/token123
```

If shared, attackers may see sensitive tokens.

---

## Referrer-Policy

This header controls how much referrer information browsers share.

---

## Common Policies

### no-referrer

No referrer information is sent.

### origin

Only domain is shared.

Example:

```txt
https://example.com
```

### strict-origin

Only secure origins are shared.

---

## Benefits

- Protects user privacy
- Prevents sensitive URL leakage
- Improves security

---

# 3. X-Content-Type-Options

## What is MIME Type?

Every response has a content type.

Example:

```txt
Content-Type: application/json
```

or

```txt
Content-Type: text/html
```

---

## Problem: MIME Sniffing

Browsers sometimes ignore server content type and try to guess file type.

This is called:

```txt
MIME Sniffing
```

---

## Dangerous Scenario

Server sends:

```txt
Content-Type: text/plain
```

Browser guesses:

```txt
This looks like JavaScript
```

Browser may execute malicious code.

---

## Solution

```txt
X-Content-Type-Options: nosniff
```

This tells browser:

```txt
Do NOT guess content types
```

Only trust server-defined content types.

---

## Benefits

- Prevents malicious script execution
- Stops MIME confusion attacks
- Improves browser security

---

# 4. X-XSS-Protection

## What is XSS?

XSS means:

```txt
Cross Site Scripting
```

Attackers inject malicious JavaScript into web pages.

---

## Example Attack

Attacker injects:

```html
<script>alert("Hacked")</script>
```

If browser executes it:

- Cookies may be stolen
- User sessions may be hijacked
- Sensitive data may leak

---

## X-XSS-Protection Header

This header enables browser XSS filtering.

Example:

```txt
X-XSS-Protection: 1; mode=block
```

---

## Meaning

### 1

Enable XSS filtering.

### mode=block

Block page rendering if attack detected.

---

## Important Note

Modern browsers now rely more on:

- Content Security Policy (CSP)

and less on X-XSS-Protection.

But conceptually it is important for interviews and learning.

---

# 5. HSTS (Strict Transport Security)

# Full Form

```txt
HTTP Strict Transport Security
```

---

# Purpose

HSTS forces browsers to always use HTTPS.

Even if users type:

```txt
http://example.com
```

browser automatically upgrades to:

```txt
https://example.com
```

---

# Why HSTS is Important

HTTP traffic is insecure.

Attackers can intercept communication.

This creates risks like:

- Data theft
- Cookie hijacking
- Man-in-the-middle attacks

---

# First Insecure Request Flow

## Step 1

User enters:

```txt
http://example.com
```

---

## Step 2

Browser sends insecure HTTP request.

---

## Step 3

Server responds:

```txt
301 Redirect → https://example.com
```

---

## Step 4

Browser reconnects using HTTPS.

---

## Step 5

Server sends:

```txt
Strict-Transport-Security header
```

Browser stores this rule.

---

# Subsequent Insecure Requests

Next time user enters:

```txt
http://example.com
```

browser automatically converts it internally to:

```txt
https://example.com
```

WITHOUT sending insecure request first.

---

# HSTS Header Example

```txt
Strict-Transport-Security:
max-age=31536000; includeSubDomains
```

---

# Understanding max-age

```txt
31536000 seconds = 1 year
```

Browser remembers HTTPS-only rule for 1 year.

---

# includeSubDomains

Also applies HTTPS enforcement to:

- api.example.com
- admin.example.com
- cdn.example.com

---

# Benefits of HSTS

- Prevents downgrade attacks
- Prevents SSL stripping attacks
- Forces encrypted communication
- Improves browser trust

---

# Security Header Summary Table

| Header | Purpose |
|---|---|
| X-Powered-By | Hides backend technology |
| Referrer-Policy | Controls referrer information |
| X-Content-Type-Options | Prevents MIME sniffing |
| X-XSS-Protection | Helps block XSS attacks |
| HSTS | Forces HTTPS communication |

---

# Important Interview Questions

## 1. What are security headers?

HTTP headers used to improve browser and application security.

---

## 2. What is MIME sniffing?

When browsers guess content types instead of trusting server headers.

---

## 3. What does HSTS do?

Forces browser to always use HTTPS.

---

## 4. Why remove X-Powered-By?

To avoid revealing backend framework information.

---

## 5. What is XSS?

Cross Site Scripting attack where malicious scripts are injected into pages.

---

# Final Notes

Security headers are a very important part of:

- Backend Development
- System Design
- Web Security
- Production Deployments

They provide an extra layer of browser-side protection and help reduce common attack vectors.
