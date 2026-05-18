# Cross Site Request Forgery (CSRF) – Detailed Notes

# What is CSRF?

CSRF (Cross Site Request Forgery) is a web security attack where an attacker tricks an authenticated user into performing unwanted actions on a trusted website.

The attack works because:

- HTTP is stateless
- Browsers automatically attach cookies/session IDs with requests
- The website trusts the authenticated session

---

# Simple Definition

> CSRF means forcing a logged-in user to send a malicious request unknowingly.

Example:

- You are logged into your bank account
- Attacker sends you a malicious link
- You click it
- Browser automatically sends your bank cookies
- Bank thinks YOU made the request

Result:
Money transfer happens without your intention.

---

# Real World Example

Suppose a bank API looks like this:

```txt
http://bank.com/fundtransfer?accId=21312&amount=10000
```

If the user is already logged into `bank.com`, then cookies/session tokens are already stored in the browser.

Now attacker creates a malicious email:

```html
<a href="http://bank.com/fundtransfer?accId=9999&amount=10000">
    Click here to win iPhone
</a>
```

When user clicks:

- Browser sends request to bank.com
- Browser automatically includes authentication cookies
- Bank server thinks request is legitimate
- Money gets transferred

---

# Complete CSRF Attack Flow

## Step 1 — Attacker Creates Malicious Request

Attacker prepares a request like:

```txt
bank.com/fundtransfer?accId=9999&amount=10000
```

---

## Step 2 — Attacker Sends Link

Attacker embeds this request inside:

- Email
- Fake website
- Ads
- Messages
- Hidden form
- Image tags

Example:

```html
<a href="http://bank.com/fundtransfer?accId=9999&amount=10000">
    Offer
</a>
```

---

## Step 3 — User Clicks the Link

Victim is already logged into bank website.

Browser automatically attaches:

```txt
Cookie: sessionId=abc123
```

---

## Step 4 — Bank Validates Session

Bank sees:

- Valid session cookie
- Authenticated user

Bank assumes request is genuine.

---

## Step 5 — Action Happens

Money transfer occurs.

Attacker succeeds.

---

# Why CSRF Happens

## 1. Statelessness of HTTP

HTTP itself does not remember users.

So websites use:

- Cookies
- Sessions
- JWT tokens

to identify users.

---

## 2. Browser Automatically Sends Cookies

This is the MAIN reason.

Whenever request goes to same domain:

```txt
bank.com
```

browser automatically sends:

```txt
Cookie: session=xyz
```

Even if request originated from malicious site.

---

# Main Vulnerability

## Using GET APIs for Sensitive Actions

BAD:

```txt
GET /fundtransfer?accId=123&amount=1000
```

GET requests should NEVER:

- update data
- delete data
- transfer money
- modify state

GET should only fetch/read data.

---

# Dangerous CSRF Attack Examples

# 1. Anchor Tag Attack

```html
<a href="http://bank.com/fundtransfer?accId=123&amount=100000">
    Click for iPhone
</a>
```

When clicked → GET request sent.

---

# 2. Image Tag Attack

Even more dangerous:

```html
<img src="http://bank.com/fundtransfer?accId=123&amount=100000" />
```

Problem:

- User doesn't even need to click
- Browser auto-loads image
- Request gets triggered automatically

---

# 3. Hidden Form Attack (POST Request)

Attackers can even attack POST endpoints.

```html
<form action="http://bank.com/fundtransfer" method="POST">
    <input type="hidden" name="accId" value="1231231"/>
    <input type="hidden" name="amount" value="100000"/>

    <input type="submit" value="Click for iPhone"/>
</form>
```

User clicks submit.

Browser sends authenticated POST request.

---

# Important Point

CSRF does NOT steal data directly.

Instead it:

- performs actions
- changes state
- abuses user authentication

---

# Difference Between CSRF and XSS

| Feature | CSRF | XSS |
|---|---|---|
| Main Goal | Perform unwanted actions | Execute malicious JS |
| Needs logged-in user? | Yes | Not always |
| Exploits | Trust in authenticated user | Trust in website content |
| Uses cookies automatically? | Yes | Can steal them |
| Typical Damage | Money transfer, password change | Token theft, script execution |

---

# CSRF Mitigation Techniques

# 1. Anti-CSRF Token (Most Important)

Best protection.

---

## How It Works

Server generates unique random token:

```txt
csrf-token = A7X92P
```

This token is:

- tied to user session
- sent with forms
- validated on server

---

# Flow

## Step 1 — Server Sends Form

```html
<form action="/transfer" method="POST">
    <input type="hidden" name="csrfToken" value="A7X92P"/>
</form>
```

---

## Step 2 — User Submits Form

Request contains:

```txt
csrfToken=A7X92P
```

---

## Step 3 — Server Validates Token

Server checks:

- Is token valid?
- Does token belong to this session?

If yes → request accepted.

Else → rejected.

---

# Why It Stops CSRF

Attacker cannot guess token.

Malicious website cannot read token due to Same-Origin Policy.

So forged request fails.

---

# Express.js Example

```js
import csrf from "csurf";

app.use(csrf());

app.get("/form", (req, res) => {
  res.render("form", {
    csrfToken: req.csrfToken()
  });
});
```

Frontend:

```html
<input type="hidden" name="_csrf" value="<%= csrfToken %>" />
```

---

# 2. SameSite Cookies

Modern browsers support:

```txt
SameSite=Strict
```

or

```txt
SameSite=Lax
```

---

# Purpose

Prevents browser from sending cookies in cross-site requests.

---

# Example

```js
res.setHeader(
  "Set-Cookie",
  "sessionId=abc123; SameSite=Strict; Secure"
);
```

---

# SameSite Modes

| Mode | Meaning |
|---|---|
| Strict | Cookies NEVER sent in cross-site requests |
| Lax | Cookies sent only for safe navigation |
| None | Cookies always sent |

---

# Recommended

```txt
SameSite=Lax
```

or

```txt
SameSite=Strict
```

---

# Secure Attribute

```txt
Secure
```

means:

Cookie only sent over HTTPS.

---

# 3. Referer / Origin Validation

Server checks:

```txt
Origin
Referer
```

headers.

If request comes from unknown domain:

Reject it.

---

# Example

Allowed:

```txt
Origin: https://bank.com
```

Blocked:

```txt
Origin: https://evil.com
```

---

# 4. CAPTCHA

Before sensitive operations:

- money transfer
- password change
- account deletion

ask user to solve CAPTCHA.

Helps prevent automated attacks.

---

# 5. Content Security Policy (CSP)

CSP restricts:

- scripts
- resources
- external domains

Helps reduce attack surface.

Example:

```http
Content-Security-Policy:
default-src 'self';
```

---

# 6. Do NOT Use GET for State Changes

VERY IMPORTANT.

Bad:

```txt
GET /deleteAccount
```

Good:

```txt
POST /deleteAccount
```

Even better:

```txt
POST + CSRF token
```

---

# Best Practices Checklist

## Always

✅ Use CSRF tokens  
✅ Use SameSite cookies  
✅ Use HTTPS  
✅ Validate Origin/Referer  
✅ Use POST/PUT/DELETE for updates  
✅ Add CAPTCHA for sensitive actions  
✅ Expire sessions properly

---

## Never

❌ Perform updates using GET  
❌ Trust browser cookies alone  
❌ Disable CSRF protection  
❌ Store sensitive tokens insecurely

---

# Interview Notes

# What is CSRF in one line?

> CSRF tricks authenticated users into performing unwanted actions.

---

# Why does CSRF happen?

Because browsers automatically send authentication cookies.

---

# Best protection?

> Anti-CSRF token + SameSite cookies

---

# Why GET is dangerous?

Because links/images can automatically trigger GET requests.

---

# Can JWT apps have CSRF?

## If JWT stored in:

### localStorage

Less vulnerable to CSRF.

### Cookies

Still vulnerable to CSRF.

---

# CSRF vs Authentication

Authentication checks:

```txt
WHO are you?
```

CSRF protection checks:

```txt
DID YOU INTEND this request?
```

That’s the core idea.

---

# Final Summary

CSRF exploits user trust and browser behavior.

Main reasons:

- automatic cookie sending
- authenticated sessions
- unsafe state-changing APIs

Main defenses:

- CSRF tokens
- SameSite cookies
- Origin validation
- Avoid GET mutations

The safest combination is:

```txt
POST APIs
+ CSRF Tokens
+ SameSite Cookies
+ HTTPS
```
