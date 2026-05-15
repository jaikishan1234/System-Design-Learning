# Permission Policy (Feature Policy) – Security Notes

# What is Permission Policy?

Permission Policy is a browser security feature that allows a website to control which browser features or APIs can be used in:

- Main webpage
- Embedded iframes
- Cross-origin iframes

It helps prevent untrusted third-party content from accessing sensitive browser APIs like:

- Camera
- Microphone
- Geolocation
- Fullscreen
- Payment API
- USB
- Accelerometer

---

# Why Do We Need Permission Policy?

Imagine your website embeds a third-party iframe:

- Advertisement iframe
- External widget
- Analytics tool
- Embedded app

Without restrictions, that iframe might try to:

- Access user location
- Use microphone
- Open fullscreen
- Use camera

This becomes a security and privacy risk.

Permission Policy lets the website owner decide:

> Which feature can be used by whom?

---

# Basic Idea

Your website sends a response header like:

```http
Permissions-Policy: geolocation=(self)
```

Meaning:

- ✅ Your own website can use geolocation
- ❌ External iframes cannot

---

# High Level Architecture

## Diagram

```text
+--------------------------------------------------+
|                  Your Website                    |
|                                                  |
|   +------------------------------------------+   |
|   |          Your Main Application           |   |
|   +------------------------------------------+   |
|                                                  |
|          ↓ Embedded External iframe              |
|                                                  |
|      +------------------------------+            |
|      |   Third Party iframe         |            |
|      |   ads.example.com            |            |
|      +------------------------------+            |
|                                                  |
+--------------------------------------------------+

Permission Policy controls:
Which APIs the iframe can access
```

---

# Cross-Origin iframe Problem

## Scenario

```text
Your Website
    |
    |---- embeds ----> Third Party iframe
                             |
                             |---- tries to access:
                                   - camera
                                   - geolocation
                                   - microphone
```

Without Permission Policy:

❌ Browser may allow access

With Permission Policy:

✅ Access can be blocked

---

# Example Flowchart

```text
User Opens Website
        |
        v
Browser Requests Page
        |
        v
Server Sends Response Headers
        |
        v
Permissions-Policy Applied
        |
        v
Browser Checks iframe Permissions
        |
   +----+----+
   |         |
Allowed?   Denied?
   |         |
   v         v
API Works   Browser Blocks API
```

---

# How Permission Policy Works

The server sends a special HTTP response header.

## Syntax

```http
Permissions-Policy: feature=(allowed-origins)
```

---

# Example 1 — Allow Only Same Origin

```http
Permissions-Policy: geolocation=(self)
```

Meaning:

- ✅ Main website can use geolocation
- ❌ External websites cannot

---

# Example 2 — Allow Trusted Website

```http
Permissions-Policy:
geolocation=(self "https://trusted-site.com")
```

Meaning:

- ✅ Your website can use geolocation
- ✅ trusted-site.com iframe can use it
- ❌ Others cannot

---

# Example 3 — Disable Completely

```http
Permissions-Policy: camera=()
```

Meaning:

❌ Nobody can access the camera

---

# Visual Understanding

```text
Permissions-Policy:
geolocation=(self "https://trusted.com")

                Browser
                   |
                   v

     +-----------------------------+
     |      Your Website           |
     +-----------------------------+
           |              |
           |              |
           v              v

   Same Origin      trusted.com
      iframe           iframe
        ✅                ✅


         ad.com iframe
               ❌
```

---

# iframe `allow` Attribute

Even if the server allows a feature,
the iframe must also request permission.

## Example

```html
<iframe
  src="https://trusted-site.com"
  allow="geolocation"
></iframe>
```

---

# Important Rule

Both conditions must pass:

```text
Server Permission Policy
            +
iframe allow attribute
            =
Feature Access
```

---

# Full Security Flow

## Diagram

```text
+------------------------------------------------------+
|                  Browser                             |
+------------------------------------------------------+
               |
               v

1. User visits website
               |
               v

2. Server sends:
   Permissions-Policy Header
               |
               v

3. Browser stores rules
               |
               v

4. iframe requests feature access
               |
               v

5. Browser validates:
      - Is origin allowed?
      - Is iframe allow="" present?
               |
        +------+------+
        |             |
       YES           NO
        |             |
        v             v

 Feature Allowed   Feature Blocked
```

---

# Real Example

## Backend Header

### Express.js

```js
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    'geolocation=(self "https://trusted-site.com")'
  );

  next();
});
```

---

## Frontend iframe

```html
<iframe
  src="https://trusted-site.com"
  allow="geolocation"
></iframe>
```

---

# What Happens Internally?

## Case 1 — Allowed iframe

```text
trusted-site.com iframe
        |
        v

Requests Geolocation
        |
        v

Browser Checks:
✔ trusted-site.com allowed?
✔ iframe allow="geolocation" present?
        |
        v

ACCESS GRANTED
```

---

## Case 2 — Blocked iframe

```text
ad-site.com iframe
        |
        v

Requests Geolocation
        |
        v

Browser Checks:
✘ Not in permission policy
        |
        v

ACCESS DENIED
```

---

# Common Features Controlled

| Feature | Purpose |
|---|---|
| geolocation | User location |
| camera | Webcam access |
| microphone | Audio recording |
| fullscreen | Fullscreen mode |
| payment | Payment Request API |
| usb | USB devices |
| accelerometer | Motion sensors |
| gyroscope | Device orientation |

---

# Security Benefits

## 1. Better Privacy

Prevents third-party content from accessing sensitive APIs.

---

## 2. Reduces Attack Surface

Blocks malicious iframes from abusing browser features.

---

## 3. Safer Ads and Widgets

Advertisement scripts cannot freely access device APIs.

---

## 4. Better Control

Website owner decides permissions centrally.

---

# Relationship with Other Security Headers

| Header | Purpose |
|---|---|
| CSP | Controls resource loading |
| CORS | Controls cross-origin requests |
| X-Frame-Options | Controls iframe embedding |
| Permissions-Policy | Controls browser feature access |

---

# Difference Between CSP and Permission Policy

| CSP | Permission Policy |
|---|---|
| Controls what resources load | Controls browser APIs |
| Stops malicious scripts | Stops API misuse |
| Example: script-src | Example: geolocation |

---

# Important Interview Questions

## Q1. What is Permission Policy?

A security mechanism that controls access to browser features and APIs.

---

## Q2. Why is it useful?

It prevents untrusted iframes or third-party content from accessing sensitive browser capabilities.

---

## Q3. Difference between CORS and Permission Policy?

- CORS controls cross-origin network requests
- Permission Policy controls browser feature access

---

## Q4. What is the role of iframe allow attribute?

It explicitly requests access to a browser feature inside the iframe.

---

# Modern Browser Support

Supported by:

- Chrome
- Edge
- Firefox (partial)
- Safari (partial)

---

# Best Practices

## Always Disable Unused Features

```http
Permissions-Policy:
camera=(),
microphone=(),
geolocation=()
```

---

## Allow Only Trusted Origins

```http
Permissions-Policy:
geolocation=(self "https://trusted.com")
```

---

## Use Together with CSP

Best security comes from combining:

- CSP
- Permission Policy
- Secure Cookies
- HTTPS

---

# Quick Revision

## Permission Policy

Controls access to browser APIs.

---

## Main Goal

Prevent untrusted iframes/scripts from accessing sensitive features.

---

## Implemented Through

```http
Permissions-Policy
```

header.

---

## Common Protected Features

- Camera
- Microphone
- Geolocation
- Fullscreen

---

## Core Concept

```text
Server decides
who can use
which browser feature
```

