# Security Headers in Express.js

## Introduction

When building backend applications, security is very important.

Browsers and servers communicate using **HTTP headers**.  
Some headers are specially designed to improve security.

These headers help protect applications from attacks like:

- XSS (Cross Site Scripting)
- MIME sniffing attacks
- Data leakage
- Insecure HTTP communication
- Technology fingerprinting

In this project, we are using Express.js middleware to add security headers.

---

# Full Code

```js
const express = require('express');

const app = express();

const redirectToHttps = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // Redirect to HTTPS
    return res.redirect(
      ['https://', req.get('Host'), req.url].join('')
    );
  }

  next();
};

app.use(redirectToHttps);

app.use((req, res, next) => {
  res.setHeader("referrer-policy", "origin");

  res.removeHeader('X-Powered-By');

  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  next();
});

app.get('/list', (req, res) => {
  res.send([
    {
      id: 1,
      title: "Frontend System Design"
    }
  ]);
});

const port = process.env.PORT || 5010;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

---

# Understanding Middleware

## What is Middleware?

Middleware is a function that runs:

- Before the request reaches the route
- Before the response is sent

It can:

- Modify request
- Modify response
- Add headers
- Redirect users
- Validate authentication
- Log requests

Example:

```js
app.use((req, res, next) => {
  console.log("Middleware running");
  next();
});
```

`next()` tells Express to continue to the next middleware or route.

Without `next()`, the request gets stuck.

---

# HTTPS Redirection Middleware

```js
const redirectToHttps = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(
      ['https://', req.get('Host'), req.url].join('')
    );
  }

  next();
};
```

---

## Why do we need HTTPS?

HTTP is insecure.

Data can be intercepted by attackers.

HTTPS encrypts communication between:

- Browser
- Server

This protects:

- Passwords
- Tokens
- Cookies
- User data

---

# Referrer-Policy Header

```js
res.setHeader("referrer-policy", "origin");
```

This controls how much referrer information is shared with external websites.

Using `origin` means only the domain is shared, not the full URL path.

---

# X-Powered-By Header

```js
res.removeHeader('X-Powered-By');
```

Express normally reveals:

```txt
X-Powered-By: Express
```

Removing it hides backend technology from attackers.

---

# X-Content-Type-Options Header

```js
res.setHeader("X-Content-Type-Options", "nosniff");
```

This prevents browsers from MIME-sniffing file types.

It tells browsers:

```txt
Do NOT guess content types
```

---

# HSTS (Strict Transport Security)

```js
res.setHeader(
  "Strict-Transport-Security",
  "max-age=31536000; includeSubDomains"
);
```

This forces browsers to always use HTTPS.

`max-age=31536000` means 1 year.

`includeSubDomains` also secures subdomains.

---

# Route Explanation

```js
app.get('/list', (req, res) => {
  res.send([
    {
      id: 1,
      title: "Frontend System Design"
    }
  ]);
});
```

When user visits `/list`, server sends JSON data.

---

# Final Summary

| Security Feature | Purpose |
|---|---|
| HTTPS Redirect | Forces secure communication |
| Referrer-Policy | Prevents leaking sensitive URLs |
| Remove X-Powered-By | Hides backend technology |
| X-Content-Type-Options | Prevents MIME sniffing |
| HSTS | Forces browser to use HTTPS |

---

# Best Practice

In production apps, developers commonly use:

```bash
npm install helmet
```

Example:

```js
const helmet = require('helmet');

app.use(helmet());
```

Helmet automatically adds many security headers.
