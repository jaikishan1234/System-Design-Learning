# Web Security Learning Notes
# XSS (Cross-Site Scripting) + CSP (Content Security Policy)

---

# Table of Contents

1. Introduction to XSS
2. How XSS Works
3. Capturing Keystrokes
4. Stealing Critical Information
5. Phishing Attacks
6. Types of XSS
7. Dangerous JavaScript Patterns
8. Preventing XSS
9. Content Security Policy (CSP)
10. CSP Allowed Sources
11. CSP Script Nonces
12. CSP Report-Only Mode
13. Important CSP Directives
14. Strong CSP Examples
15. Best Practices
16. Final Summary

---

# 1. Introduction to XSS

Cross-Site Scripting (XSS) is a web security vulnerability where attackers inject malicious JavaScript into a trusted website.

When another user opens the vulnerable page, the browser executes the attacker’s script.

---

## Main Goal of XSS Attacks

Attackers try to:

- Steal cookies
- Hijack sessions
- Capture keystrokes
- Perform actions as the victim
- Show fake login forms
- Steal sensitive information
- Redirect users to malicious websites

---

# 2. How XSS Works

## Basic Flow

```text
User input enters application
            ↓
Application does not sanitize input
            ↓
Malicious script stored or reflected
            ↓
Victim opens webpage
            ↓
Browser executes attacker script
```

---

# 3. Capturing Keystrokes (Keylogging Concept)

## What Happens

A malicious script listens for keyboard activity.

Whenever a user types:

- Username
- Password
- Credit card details
- Messages

The attacker may try to collect that data.

---

## How It Works Internally

### Step 1 — Listen for Keyboard Events

JavaScript can detect key presses using:

```js
addEventListener('keypress', ...)
```

---

### Step 2 — Store Typed Data

Typed characters are temporarily saved:

```js
buffer += typedCharacter
```

---

### Step 3 — Send Data

The script may send data to another server using:

- XMLHttpRequest
- fetch()

---

## Educational Flow

```text
User types
    ↓
Script captures keys
    ↓
Data stored temporarily
    ↓
Data transmitted
```

---

## Why This Is Dangerous

Possible stolen information:

- Passwords
- Banking information
- OTP codes
- Private messages

---

## Protection Methods

### Use CSP

```http
Content-Security-Policy: default-src 'self';
```

---

### Use HttpOnly Cookies

```http
Set-Cookie: session=abc; HttpOnly; Secure
```

---

### Sanitize User Input

Never trust user-generated content.

---

# 4. Stealing Critical Information

## What the Attack Tries To Do

Attackers inject malicious HTML elements with JavaScript event handlers.

Example events:

- onerror
- onclick
- onload

---

## Common Goal

Steal:

- Cookies
- Session IDs
- Page content
- Authentication tokens

---

## Example Concept

An image intentionally fails to load.

When it fails:

```text
onerror event executes JavaScript
```

---

## Safe Educational Example

```html
<img src="missing.png" onerror="console.log('Image failed')">
```

This demonstrates how `onerror` works safely.

---

## Why Cookies Matter

Cookies often contain session identifiers.

If stolen:

```text
Attacker may impersonate the user.
```

---

## Security Features That Help

### HttpOnly
Blocks JavaScript access to cookies.

### Secure
Allows cookies only over HTTPS.

### SameSite
Reduces CSRF-related risks.

---

# 5. Phishing Attacks Through Injected HTML

## Goal of the Attack

Attackers inject fake login forms into trusted websites.

Victims believe the form is legitimate.

---

## Typical Flow

```text
Victim visits vulnerable page
            ↓
Fake login form appears
            ↓
Victim enters credentials
            ↓
Credentials sent to attacker
```

---

## Why Phishing Works

Users trust the original website.

The fake form visually looks real.

---

## Safe HTML Demonstration

```html
<form>
  <input type="text" placeholder="Username">
  <input type="password" placeholder="Password">
</form>
```

---

## Prevention

### Escape HTML

Never directly render raw user input.

---

### Use Modern Frameworks

Examples:

- React
- Angular
- Vue

These frameworks escape dangerous content automatically.

---

### Use CSP

Restrict execution of untrusted scripts.

---

# 6. Types of XSS

---

## 1. Stored XSS

Malicious script is permanently saved.

Examples:

- Comments
- Chat messages
- User profiles

---

## 2. Reflected XSS

Malicious input is reflected immediately.

Examples:

- Search parameters
- URL query strings

---

## 3. DOM-Based XSS

The vulnerability exists inside frontend JavaScript.

Unsafe example:

```js
container.innerHTML = userInput
```

---

# 7. Dangerous JavaScript Patterns

## Avoid Using

```js
innerHTML
```

Because:

```text
Browser interprets input as HTML
```

---

## Safer Alternative

```js
textContent
```

This treats input as plain text.

---

## Unsafe Example

```js
container.innerHTML = userInput
```

---

## Safe Example

```js
container.textContent = userInput
```

---

# 8. Preventing XSS

## 1. Validate Input

Allow only expected characters.

---

## 2. Escape Output

Convert dangerous characters safely.

Example:

```text
< becomes &lt;
```

---

## 3. Use Sanitization Libraries

Examples:

- DOMPurify
- sanitize-html

---

## 4. Avoid Inline JavaScript

Avoid:

```html
onclick="..."
```

Prefer:

```js
addEventListener()
```

---

## 5. Use Security Headers

Examples:

- CSP
- X-Frame-Options
- X-Content-Type-Options

---

# 9. Content Security Policy (CSP)

## What is CSP?

CSP stands for:

```text
Content Security Policy
```

It is a browser security mechanism that controls:

- Which scripts can run
- Which resources can load
- Which domains are trusted

---

## Why CSP Exists

CSP helps reduce:

- XSS attacks
- Data injection attacks
- Malicious third-party scripts

---

# 10. CSP Allowed Sources

## What Are Allowed Sources?

CSP lets developers define trusted resource locations.

Examples:

- Scripts
- Images
- Fonts
- APIs
- CSS files

---

## Example

```http
Content-Security-Policy: default-src 'self';
```

Meaning:

```text
Only resources from the same domain are allowed.
```

---

## Allowing CDN Scripts

```http
Content-Security-Policy:
script-src 'self' https://cdn.jsdelivr.net;
```

Allowed:

- Local scripts
- jsDelivr CDN scripts

Blocked:

- Unknown external domains

---

# 11. CSP Script Nonces

## What is a Nonce?

A nonce is:

```text
A one-time random security token
```

The browser executes only scripts with the correct nonce.

---

## Why Nonces Are Powerful

Injected attacker scripts usually do not know the nonce.

Therefore:

```text
Malicious scripts get blocked.
```

---

## Example

### CSP Header

```http
Content-Security-Policy: script-src 'nonce-random123'
```

---

### Trusted Script

```html
<script nonce="random123">
  console.log('Trusted script');
</script>
```

---

### Blocked Script

```html
<script>
  alert('Malicious script');
</script>
```

The second script has no nonce.

So:

```text
Browser blocks execution.
```

---

# 12. CSP Report-Only Mode

## What is Report-Only Mode?

This mode helps developers test CSP safely.

Instead of blocking resources:

- Browser logs violations
- Reports are generated
- Developers analyze problems

---

## Why Developers Use It

Strict CSP rules may accidentally break websites.

Report-only mode helps test policies before enforcement.

---

## Example

```http
Content-Security-Policy-Report-Only:
default-src 'self';
report-uri https://example.com/csp-report;
```

Meaning:

```text
Violations are reported but NOT blocked.
```

---

# 13. Important CSP Directives

| Directive | Purpose |
|---|---|
| default-src | Default resource policy |
| script-src | Allowed JavaScript sources |
| style-src | Allowed CSS sources |
| img-src | Allowed image sources |
| connect-src | Allowed API/network requests |
| font-src | Allowed fonts |
| frame-src | Allowed iframes |
| object-src | Controls plugins |
| report-uri | Violation reporting endpoint |

---

# 14. Strong CSP Example

```http
Content-Security-Policy:
default-src 'self';
script-src 'self' 'nonce-random123';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
```

---

## Explanation

### default-src 'self'
Allow only same-origin resources.

### script-src
Only trusted scripts with nonce allowed.

### object-src 'none'
Disable plugins like Flash.

### frame-ancestors 'none'
Prevent clickjacking via iframes.

---

# 15. Best Practices

## 1. Never Trust User Input

Always sanitize and validate.

---

## 2. Prefer textContent Over innerHTML

Safe:

```js
textContent
```

Unsafe:

```js
innerHTML
```

---

## 3. Use DOMPurify

Sanitize HTML safely.

---

## 4. Avoid Unsafe CSP Rules

Avoid:

```http
unsafe-inline
unsafe-eval
```

These weaken CSP protection.

---

## 5. Use Report-Only Before Enforcing

Test policies safely first.

---

## 6. Combine Multiple Security Layers

Use together:

- CSP
- Input validation
- Output encoding
- Secure cookies
- HTTPS

---

# 16. Final Summary

## XSS Main Goal

```text
Execute malicious JavaScript inside victim browser.
```

---

## Common XSS Impacts

- Session hijacking
- Credential theft
- Fake login forms
- Unauthorized actions
- Sensitive data theft

---

## CSP Main Goal

```text
Restrict what the browser is allowed to execute.
```

---

## Most Important Security Rule

```text
Never trust user input.
```

Always:

- Validate
- Sanitize
- Encode
- Restrict
- Monitor

---

# Recommended Topics to Learn Next

1. DOMPurify
2. OWASP XSS Prevention Cheat Sheet
3. Same-Origin Policy
4. CSRF Attacks
5. Secure Authentication
6. Browser Security Model
7. JWT Security
8. Cookie Security
9. HTTPS and TLS
10. Secure Frontend Development

