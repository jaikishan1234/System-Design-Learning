# SSRF (Server-Side Request Forgery)

## What is SSRF?

SSRF (Server-Side Request Forgery) is a security vulnerability where an attacker tricks the server into making requests to internal or private resources on behalf of the attacker.

Instead of attacking directly, the hacker abuses the server as a middleman.

---

# Basic SSRF Flow

## How SSRF Works

1. Hacker sends a malicious URL to the application.
2. Web server accepts user-provided URL.
3. Server makes request internally.
4. Internal/private services become accessible.
5. Sensitive data may leak.

---

# Example Scenario

Suppose your backend fetches images from URLs.

```js
app.get("/image", async (req, res) => {
  const imageUrl = req.query.url;

  const response = await fetch(imageUrl);

  const data = await response.text();

  res.send(data);
});
```

At first glance this looks fine.

But attacker can send:

```bash
https://example.com/image?url=http://localhost:3000/admin
```

Now your server itself requests:

```bash
http://localhost:3000/admin
```

The attacker gains access to internal resources.

---

# Why SSRF is Dangerous

Attackers can:

- Access internal APIs
- Read cloud metadata
- Scan internal ports
- Attack private services
- Leak credentials
- Trigger RCE (Remote Code Execution)

---

# Internal Network Attack

In SSRF, the public web server becomes an entry point into the private network.

```text
Hacker
   ↓
Public Web Server
   ↓
Internal Services
   ↓
Database / Admin Panels / Metadata APIs
```

---

# Real World AWS Metadata Attack

One famous SSRF target is:

```bash
http://169.254.169.254/
```

This is AWS EC2 Metadata Service.

Attackers may try:

```bash
http://169.254.169.254/latest/meta-data/
```

Or:

```bash
http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

Possible result:

```json
{
  "AccessKeyId": "AKIA...",
  "SecretAccessKey": "SECRET_KEY",
  "Token": "TOKEN"
}
```

This can expose AWS credentials.

---

# Common Causes of SSRF

## 1. Unvalidated User Input

### Vulnerable Code

```js
const userUrl = req.query.url;

const response = await fetch(userUrl);

res.send(await response.text());
```

### Problem

- No validation
- Any URL allowed
- Internal/private URLs accessible

---

# Dangerous Request

```bash
https://localhost:3001/user/image?imgUrl=http://169.254.169.254/latest/meta-data/iam/security-credentials/Admin-Role
```

Server fetches sensitive AWS metadata.

---

# Better Validation Example

```js
function isValidURL(url) {
  try {
    const parsed = new URL(url);

    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

app.get("/image", async (req, res) => {
  const userUrl = req.query.url;

  if (!isValidURL(userUrl)) {
    return res.status(400).send("Invalid URL");
  }

  const response = await fetch(userUrl);

  res.send(await response.text());
});
```

---

# Problem Still Exists

Even after validation:

```bash
https://evil.com
```

is technically valid.

So validation alone is NOT enough.

---

# 2. Lack of Whitelisting

## Best Practice: Allow Only Trusted Domains

```js
const allowedDomains = [
  "api.example.com",
  "images.example.com"
];

function isAllowedDomain(url) {
  const parsed = new URL(url);

  return allowedDomains.includes(parsed.hostname);
}

app.get("/fetch", async (req, res) => {
  const userUrl = req.query.url;

  if (!isAllowedDomain(userUrl)) {
    return res
      .status(403)
      .send("Access denied");
  }

  const response = await fetch(userUrl);

  res.send(await response.text());
});
```

---

# Why Whitelisting Helps

Instead of allowing:

```text
ANY URL
```

You allow only:

```text
api.example.com
images.example.com
```

Everything else blocked.

---

# 3. Insufficient Access Control

## Unsafe Backend Request

```js
const fetch = require("node-fetch");

async function makeRequest(url) {
  const response = await fetch(url);

  return await response.text();
}
```

### Problem

- Backend blindly requests anything.
- No permission checks.
- No IP filtering.

---

# Safer Approach

```js
import dns from "dns/promises";
import net from "net";

function isPrivateIP(ip) {
  return (
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  );
}

async function safeFetch(url) {
  const parsed = new URL(url);

  const result = await dns.lookup(parsed.hostname);

  if (isPrivateIP(result.address)) {
    throw new Error("Private IPs not allowed");
  }

  return fetch(url);
}
```

---

# Additional SSRF Protections

## Block Private IP Ranges

Prevent access to:

```text
127.0.0.1
localhost
10.x.x.x
172.16.x.x
192.168.x.x
169.254.x.x
```

---

# Disable Redirect Following

Attackers may bypass filters using redirects.

```js
fetch(url, {
  redirect: "error"
});
```

---

# Use Firewall Rules

Restrict server outbound traffic.

Example:

```text
Web server should NOT access:
- Database servers
- Redis
- Internal admin panels
```

---

# Use Network Segmentation

Separate:

- Public services
- Internal services
- Databases

into different networks.

---

# SSRF Prevention Checklist

| Protection | Purpose |
|---|---|
| Validate URLs | Prevent malformed input |
| Whitelist domains | Allow trusted domains only |
| Block private IPs | Stop internal access |
| Disable redirects | Prevent bypass |
| Firewall rules | Restrict outbound traffic |
| Least privilege IAM | Reduce cloud damage |
| Timeout limits | Prevent hanging requests |

---

# Advanced SSRF Attack Types

## Blind SSRF

Attacker cannot see response directly.

But server still makes request internally.

Used for:

- Port scanning
- Internal service discovery

---

# SSRF to RCE

SSRF may lead to:

- Remote Code Execution
- Internal admin exploitation
- Container escape

Example flow:

```text
SSRF
  ↓
Internal Admin Panel
  ↓
RCE Exploit
  ↓
Server Compromise
```

---

# XML External Entity (XXE)

## What is XXE?

XXE happens when XML parsers allow external entities.

Attackers can read local files.

---

# Malicious XML Example

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>

<foo>&xxe;</foo>
```

---

# What Happens?

XML parser replaces:

```xml
&xxe;
```

with contents of:

```text
/etc/passwd
```

Possible leaked data:

```text
root:x:0:0:root:/root:/bin/bash
```

---

# Vulnerable Node.js Example

```js
const xml2js = require("xml2js");

app.post("/xml", (req, res) => {
  xml2js.parseString(req.body, (err, result) => {
    res.send(result);
  });
});
```

---

# XXE Prevention

## Disable External Entities

Example:

```js
const parser = new XMLParser({
  processEntities: false
});
```

---

# Prefer JSON Over XML

JSON is safer and simpler.

---

# Keep XML Parsers Updated

Older parsers may contain vulnerabilities.

---

# Difference Between SSRF and XXE

| SSRF | XXE |
|---|---|
| Exploits server requests | Exploits XML parser |
| Targets internal network | Targets file/system access |
| Uses URLs | Uses XML entities |
| Can access metadata APIs | Can read local files |

---

# Interview Questions

## What is SSRF?

A vulnerability where attackers force the server to make unintended requests.

---

## Why is SSRF dangerous in cloud environments?

Because attackers may access metadata services and steal cloud credentials.

---

## What is the AWS metadata IP?

```text
169.254.169.254
```

---

## Best SSRF Prevention Technique?

- Domain allowlisting
- Blocking private IPs
- Restricting outbound requests

---

# Final Summary

SSRF is extremely dangerous because:

- Server trusts internal network
- Internal services are usually less protected
- Cloud credentials may leak
- Can lead to RCE

Main prevention techniques:

✅ Validate URLs  
✅ Allowlist domains  
✅ Block private IPs  
✅ Restrict outbound requests  
✅ Use proper access control  
✅ Separate internal services
