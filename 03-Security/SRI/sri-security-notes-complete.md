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

---

# Important Attributes

| Attribute | Purpose |
|---|---|
| href | CDN file URL |
| integrity | Cryptographic hash |
| crossorigin | Handles CORS request |

---

# What is the Integrity Hash?

This is a cryptographic fingerprint of the file.

Example:

```text
sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN
```

If the file content changes:

✅ Hash changes  
✅ Browser detects mismatch  
✅ File gets blocked

---

# Supported Hash Algorithms

| Algorithm | Description |
|---|---|
| sha256 | 256-bit hash |
| sha384 | 384-bit hash |
| sha512 | 512-bit hash |

---

# How SRI Works Internally

## Flowchart

```text
User Opens Website
        |
        v
Browser Downloads CDN Resource
        |
        v
Browser Generates Hash
        |
        v
Compares Generated Hash
with integrity Attribute
        |
   +----+----+
   |         |
 Match    Mismatch
   |         |
   v         v
Load File  Block File
```

---

# Detailed Browser Flow

```text
+--------------------------------------------------+
|                Browser                           |
+--------------------------------------------------+

1. Website requests external CDN file
                    |
                    v

2. Browser downloads the file
                    |
                    v

3. Browser generates cryptographic hash
   using SHA256 / SHA384 / SHA512
                    |
                    v

4. Browser compares generated hash
   with integrity attribute
                    |
          +---------+---------+
          |                   |
         Same              Different
          |                   |
          v                   v

   Resource Loaded      Resource Blocked
```

---

# Real World Example

## Without SRI

```html
<script src="https://cdn.example.com/library.js"></script>
```

Problem:

❌ If CDN is compromised → malicious script executes

---

## With SRI

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-abc123xyz"
  crossorigin="anonymous"
></script>
```

Now:

✅ Browser verifies integrity before execution

---

# What Happens if File Changes?

Suppose:

Original file hash:

```text
sha384-ABC123
```

Attacker modifies file.

New hash becomes:

```text
sha384-XYZ999
```

Browser compares:

```text
Expected Hash != Generated Hash
```

Result:

❌ File blocked

---

# Security Benefits

## 1. Protects Against CDN Attacks

If third-party CDN gets hacked:

✅ Browser blocks modified files

---

## 2. Prevents Malicious Script Injection

Attackers cannot silently inject scripts through compromised CDN files.

---

## 3. Detects Unexpected Updates

If a library version changes unexpectedly:

✅ Integrity mismatch detected

---

## 4. Improves Trust

Ensures users receive verified content.

---

# Visual Security Understanding

```text
            Trusted Website
                    |
                    v

         Downloads CDN Resource
                    |
                    v

         Browser Calculates HASH
                    |
                    v

        Compare with integrity=""
                    |
             +------+------+
             |             |
            SAME      DIFFERENT
             |             |
             v             v

       Execute File     Block File
```

---

# Generating SRI Hash

## Using OpenSSL

```bash
openssl dgst -sha384 -binary bootstrap.min.css | openssl base64 -A
```

---

# Using Online Tools

Many CDNs provide integrity hashes automatically.

Example:

- jsDelivr
- cdnjs
- unpkg

---

# crossorigin Attribute

Usually used with SRI:

```html
crossorigin="anonymous"
```

Purpose:

- Enables proper CORS request handling
- Allows browser to verify cross-origin resources

---

# Common Resources Using SRI

| Resource | Example |
|---|---|
| Bootstrap CSS | CDN stylesheet |
| React CDN | React production bundle |
| jQuery | External JS |
| Font libraries | Font Awesome |

---

# SRI with JavaScript Example

```html
<script
  src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"
  integrity="sha384-xxxxxxxx"
  crossorigin="anonymous"
></script>
```

---

# SRI + HTTPS

SRI should always be combined with:

✅ HTTPS

Because:

- HTTPS protects during transmission
- SRI verifies content integrity

Together they provide stronger security.

---

# Limitations of SRI

## 1. File Updates Break Hash

If CDN file changes:

❌ Integrity hash becomes invalid

Need to update the hash.

---

## 2. Dynamic Content Problem

SRI works best for static resources.

Not suitable for frequently changing files.

---

## 3. Does Not Replace HTTPS

SRI is an additional layer, not a replacement.

---

# Best Practices

## Always Use SRI for CDN Resources

```html
<script
  src="https://cdn.example.com/app.js"
  integrity="sha384-xxxxx"
  crossorigin="anonymous"
></script>
```

---

## Use Trusted CDNs

Examples:

- jsDelivr
- cdnjs
- Google CDN

---

## Prefer SHA384 or SHA512

More secure than SHA256.

---

## Combine with CSP

Use together with:

- CSP
- HTTPS
- Secure Headers

---

# Difference Between SRI and CSP

| SRI | CSP |
|---|---|
| Verifies file integrity | Controls allowed resources |
| Detects modified files | Blocks unauthorized sources |
| Uses cryptographic hash | Uses security policies |

---

# Interview Questions

## Q1. What is SRI?

A browser security mechanism that verifies integrity of external resources using cryptographic hashes.

---

## Q2. Why is SRI important?

It prevents compromised CDN files from executing malicious content.

---

## Q3. What happens when hash mismatches?

Browser blocks the resource.

---

## Q4. Which hash algorithms are supported?

- SHA256
- SHA384
- SHA512

---

## Q5. Why is crossorigin needed?

To allow proper cross-origin fetching and integrity validation.

---

# Quick Revision

## SRI

Verifies integrity of external resources.

---

## Main Goal

Prevent modified CDN resources from executing.

---

## Implemented Using

```html
integrity=""
```

attribute.

---

## Browser Action

```text
Download Resource
       ↓
Generate Hash
       ↓
Compare Hash
       ↓
Allow / Block
```

---

# Core Concept

```text
Browser trusts
the file only if
its cryptographic hash matches
the expected value
```
