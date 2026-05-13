# Security — Input Validation and Sanitization

## Overview
Input Validation and Sanitization are critical security practices used in frontend and backend applications to ensure that user-provided data is:

- Correct
- Safe
- Expected
- Non-malicious

Without proper validation and sanitization, attackers can:

- Inject malicious scripts
- Perform SQL Injection
- Upload malware
- Access unauthorized data
- Crash applications
- Execute XSS attacks

---

# What is Input Validation?

Input validation checks whether the user input follows the expected rules.

## Example
Checking:
- Is email valid?
- Is password strong?
- Is age a number?
- Is phone number correct length?

### Example
```js
if (!email.includes('@')) {
  throw new Error('Invalid email')
}
```

---

# What is Sanitization?

Sanitization removes or escapes dangerous content from user input.

## Example
Converting:

```html
<script>alert('hack')</script>
```

into:

```html
&lt;script&gt;alert('hack')&lt;/script&gt;
```

This prevents browsers from executing malicious scripts.

---

# Why Validation and Sanitization are Important

## Protects Against

| Attack | Description |
|---|---|
| SQL Injection | Attackers inject SQL queries |
| XSS | Malicious JavaScript injection |
| CSRF | Unauthorized actions using user session |
| File Upload Attacks | Uploading malicious files |
| Buffer Overflow | Oversized input crashes systems |
| Authentication Bypass | Invalid credential handling |

---

# Complete Notes

# 1. Use Framework Libraries

Modern libraries provide built-in validation and sanitization.

## Popular Libraries

### Frontend
- React Hook Form
- Formik
- Yup
- Zod

### Backend
- Joi
- Express Validator
- Validator.js

---

## Example Using Zod

```js
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

---

## Benefits

```txt
✔ Cleaner code
✔ Reusable validation
✔ Fewer security bugs
✔ Better scalability
✔ Strong typing support
```

---

# 2. Whitelist Validation

Whitelist validation means:

Only allow expected input.

Instead of blocking bad values, allow only safe values.

---

## Good Example

Allow only:

```txt
A-Z
0-9
_
```

### Example

```js
const usernameRegex = /^[a-zA-Z0-9_]+$/
```

---

## Bad Example

Trying to block every dangerous input.

```txt
Do not allow <script>
```

Attackers can bypass blacklist checks.

---

# 3. Regular Expressions

Regular Expressions (Regex) help validate patterns.

---

## Email Validation

```js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

---

## Phone Validation

```js
const phoneRegex = /^[0-9]{10}$/
```

---

## Password Validation

```js
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/
```

### Rules
- Minimum 8 characters
- One uppercase letter
- One number

---

# 4. Escape User Input

Escaping prevents browsers from executing dangerous code.

---

## Dangerous Input

```html
<script>alert('Hacked')</script>
```

---

## Escaped Output

```html
&lt;script&gt;alert('Hacked')&lt;/script&gt;
```

---

## Prevents

- XSS attacks
- Script injection
- HTML injection

---

# 5. Parameterized Queries

Never directly place user input into database queries.

---

## Vulnerable Query

```js
const query = `SELECT * FROM users WHERE id = ${id}`
```

---

## Safe Query

```js
db.query('SELECT * FROM users WHERE id = ?', [id])
```

---

## Prevents

```txt
SQL Injection
```

---

# 6. Validate Data Types

Always verify the type of incoming data.

---

## Example

```js
if (typeof age !== 'number') {
  throw new Error('Invalid age')
}
```

---

## Common Types

- String
- Number
- Boolean
- Object
- Array

---

# 7. Length and Size Checks

Restrict the size of user input.

---

## Example

```js
if (username.length > 20) {
  throw new Error('Too long')
}
```

---

## Why Important?

Prevents:

- Buffer overflow
- Database abuse
- Denial of Service attacks
- Memory issues

---

# 8. Images and File Validation

Uploaded files can contain malware.

---

## Always Validate

- File type
- File size
- MIME type
- Extension

---

## Example

```js
const allowedTypes = ['image/png', 'image/jpeg']
```

---

## Dangerous Practice

Only checking extension:

```txt
.jpg
.png
```

Attackers can rename malicious files.

---

## Risks

- Malware upload
- Server compromise
- Remote code execution
- Storage abuse

---

# 9. Add Client-Side Validation

Client-side validation improves user experience.

---

## Example

```html
<input type="email" required>
```

---

## Important

Client-side validation is NOT secure alone.

Attackers can bypass frontend validation.

Always validate on backend too.

---

# 10. Error Handling

Never expose internal system details.

---

## Bad Example

```txt
SQL Syntax Error near users table
```

---

## Good Example

```txt
Something went wrong
```

---

## Why?

Detailed errors help attackers understand:

- Database structure
- Backend logic
- Server technology

---

# 11. Security Headers

Security headers improve browser security.

---

## Content Security Policy (CSP)

```http
Content-Security-Policy: default-src 'self'
```

### Prevents
- XSS attacks

---

## X-Frame-Options

```http
X-Frame-Options: DENY
```

### Prevents
- Clickjacking

---

## Strict Transport Security

```http
Strict-Transport-Security: max-age=31536000
```

### Prevents
- MITM attacks

---

# 12. Regular Updates and Patching

Outdated software often contains vulnerabilities.

---

## Always Update

- Frameworks
- Libraries
- Databases
- Node.js
- Operating systems

---

## Example

Old npm packages may contain:

```txt
Known security vulnerabilities
```

---

# 13. Security Audits and Testing

Regular testing helps identify vulnerabilities.

---

## Types of Testing

- Penetration testing
- Vulnerability scanning
- Code review
- Dependency scanning

---

## Tools

- OWASP ZAP
- npm audit
- Snyk
- Burp Suite

---

# 14. Education and Training

Developers should continuously learn security practices.

---

## Important Topics

- OWASP Top 10
- XSS
- CSRF
- SQL Injection
- Secure authentication
- Secure APIs

---

## Why Important?

Human mistakes are one of the biggest security risks.

---

# 15. Avoid Using Untrusted Third-Party Libraries

Third-party libraries can introduce vulnerabilities.

---

## Risks

- Malware packages
- Supply chain attacks
- Abandoned libraries
- Hidden vulnerabilities

---

## Best Practices

```txt
✔ Use trusted packages
✔ Check GitHub activity
✔ Read security advisories
✔ Remove unused dependencies
✔ Regularly run npm audit
```

---

## Example

```bash
npm audit
```

---

# Frontend Security Example

## React Example

### Unsafe

```jsx
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

### Safe

```jsx
<div>{userInput}</div>
```

React automatically escapes values.

---

# Backend Validation Example

## Express.js Example

```js
app.post('/register', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Invalid input'
    })
  }

  res.json({ success: true })
})
```

---

# Common Security Mistakes

| Mistake | Problem |
|---|---|
| Trusting frontend validation only | Easily bypassed |
| Storing raw passwords | Huge security risk |
| No file validation | Malware uploads |
| Detailed error messages | Information leakage |
| Using outdated libraries | Vulnerable dependencies |

---

# Best Practices Summary

```txt
✔ Validate every input
✔ Sanitize dangerous content
✔ Use HTTPS
✔ Use secure headers
✔ Limit file uploads
✔ Use parameterized queries
✔ Validate on backend
✔ Keep dependencies updated
✔ Follow OWASP guidelines
```

---

# Interview Quick Revision

| Topic | Key Point |
|---|---|
| Validation | Checks correctness |
| Sanitization | Makes input safe |
| Regex | Pattern validation |
| Escaping | Prevents XSS |
| Parameterized Queries | Prevents SQL Injection |
| Security Headers | Browser protection |
| File Validation | Prevents malicious uploads |
| Backend Validation | Mandatory for security |

---

# Final Summary

Input validation and sanitization are essential for building secure applications.

A secure system should:

- Validate all incoming data
- Sanitize dangerous input
- Protect against common attacks
- Use secure coding practices
- Continuously test vulnerabilities

Strong validation protects applications from:

- SQL Injection
- XSS
- CSRF
- File upload attacks
- Authentication bypass
- Data leaks

