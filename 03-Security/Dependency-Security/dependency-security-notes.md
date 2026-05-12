# Dependency Security

## What is Dependency Security?

Modern frontend and backend applications use many third-party packages from:

- npm
- pip
- Maven
- Composer

These external libraries are called **dependencies**.

Dependency Security means:

```txt
Protecting your application from vulnerable or malicious packages
```

---

# Why Dependency Security is Important

A single vulnerable package can:

- Leak user data
- Allow remote code execution
- Cause XSS attacks
- Break authentication
- Install malware

---

# Real-World Example

Suppose your project uses:

```bash
npm install lodash
```

If lodash has a vulnerability:

```txt
Your application also becomes vulnerable
```

even though your own code is correct.

---

# 1. Regular Audit of Dependencies

## npm audit

```bash
npm audit
```

Scans installed packages for vulnerabilities.

---

## Fix Vulnerabilities

```bash
npm audit fix
```

Automatically fixes safe vulnerabilities.

---

## Update Dependencies

```bash
npm update
```

Updates packages to newer versions.

---

# 2. Enforcing Auditing

Enable automatic auditing:

```bash
npm set audit true
```

Now every:

```bash
npm install
```

will run security checks automatically.

---

# 3. Code & Dependency Monitoring (CodeQL)

## GitHub Actions Security Scan Example

```yaml
name: Security Scan

on:
  push:
    branches:
      - main

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 14

      - name: Install Dependencies
        run: npm ci

      - name: Security Scan
        run: npm audit
```

---

# What is npm ci?

```bash
npm ci
```

Installs dependencies using exact versions from:

```txt
package-lock.json
```

---

# 4. Dependency Locking

## package-lock.json

Stores:

- Exact versions
- Dependency tree
- Integrity hashes

Benefits:

✅ Reproducible builds  
✅ Better consistency  
✅ Safer deployments

---

# 5. Security Tools

| Tool | Purpose |
|---|---|
| OWASP ZAP | Web vulnerability scanning |
| Snyk | Dependency vulnerability scanning |
| Dependabot | Dependency updates |
| CodeQL | Static security analysis |
| npm audit | Package vulnerability scanning |

---

# Example Using Snyk

Install:

```bash
npm install -g snyk
```

Authenticate:

```bash
snyk auth
```

Test:

```bash
snyk test
```

---

# Best Practices

## Keep Dependencies Updated

```bash
npm update
```

## Remove Unused Packages

```bash
npm uninstall package-name
```

## Use package-lock.json

Never delete:

```txt
package-lock.json
```

---

# CI/CD Security Flow

```txt
Developer Pushes Code
          ↓
GitHub Actions Trigger
          ↓
Install Dependencies
          ↓
Run npm audit
          ↓
Run CodeQL Scan
          ↓
Block Deployment if Vulnerable
```

---

# Interview Questions

## Q1. What is npm audit?

A tool that scans installed npm packages for known vulnerabilities.

---

## Q2. Difference between npm install and npm ci?

| npm install | npm ci |
|---|---|
| Flexible install | Exact install |
| Updates lock file | Uses existing lock file |
| Slower | Faster |

---

## Q3. What is package-lock.json?

A file storing exact dependency versions.

---

## Q4. What is CodeQL?

GitHub’s static analysis tool for security scanning.

---

# Short Summary

Dependency Security protects applications from vulnerable third-party packages.

Important techniques include:

- npm audit
- npm audit fix
- npm ci
- package-lock.json
- CodeQL
- Dependabot
