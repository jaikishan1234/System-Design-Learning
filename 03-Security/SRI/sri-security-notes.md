# SRI (Subresource Integrity) – Security Notes

# What is SRI?

**SRI (Subresource Integrity)** is a browser security feature used to ensure that files loaded from third-party sources or CDNs have not been modified or tampered with.

It verifies the integrity of external resources like:

- CSS files
- JavaScript files
- Fonts
- Libraries from CDNs

---

# Why Do We Need SRI?

Modern websites often use external CDN resources:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"
/>
```

Problem:

❌ What if the CDN is hacked?  
❌ What if someone modifies the file maliciously?  
❌ What if the file changes unexpectedly?

The browser would still load it.

This creates a major security risk.

---

# Solution → SRI

SRI allows the browser to verify:

> “Is this file exactly the same as expected?”

If the file changes even slightly:

❌ Browser blocks it

---

# High Level Architecture

## Diagram

```text
+-------------------+             +----------------------+
|     a.com         | ----------> |      cdn.b.com      |
|   Your Website    |             |  Third Party CDN    |
+-------------------+             +----------------------+

         Browser downloads resource
                   |
                   v
        Browser verifies HASH
                   |
           +-------+--------+
           |                |
        Match            Mismatch
           |                |
           v                v
      Resource Loads     Resource Blocked
```

---

# Basic SRI Example

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
  crossorigin="anonymous"
/>
```
