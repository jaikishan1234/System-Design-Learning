# Security — Compliance and Regulations

## Overview
Compliance and regulations are important in frontend and backend system design because applications often handle sensitive user data such as:

- Personal information
- Payment information
- Healthcare records
- Government data
- Authentication credentials

Organizations must follow different standards and laws depending on the industry and country.

---

# Compliance and Regulations Table

| Category | Compliance | Country/Region | Description | Important Actions |
|---|---|---|---|---|
| **Data Protection** | **GDPR (General Data Protection Regulation)** | EU | Protects the privacy and personal data of EU citizens. | 1. Implement data encryption in transit and at rest using strong algorithms.<br>2. Establish data access controls based on the principle of least privilege.<br>3. Implement secure data deletion procedures.<br>4. Obtain explicit consent before collecting and processing personal data. |
| **Healthcare** | **HIPAA (Health Insurance Portability and Accountability Act)** | USA | Protects health information and ensures the confidentiality and integrity of patient data. | 1. Encrypt patient health information both in transit and at rest.<br>2. Implement multi-factor authentication for accessing patient records.<br>3. Regularly update and patch healthcare systems to address vulnerabilities.<br>4. Implement audit logging to track access to patient data.<br>5. Implement data retention policies to delete patient records when no longer needed. |
| **Financial Services** | **PCI DSS (Payment Card Industry Data Security Standard)** | Global | Ensures the secure processing, transmission, and storage of credit card information. | 1. Use tokenization for sensitive data to reduce the impact of a potential breach.<br>2. Regularly perform vulnerability scans and penetration testing on payment systems.<br>3. Monitor and log all access to cardholder data.<br>4. Implement secure coding practices for payment applications. |
| **Government** | **FISMA (Federal Information Security Management Act)** | USA | Establishes information security standards and guidelines for federal agencies. | 1. Implement continuous monitoring of security controls and incidents.<br>2. Regularly update and patch systems to address vulnerabilities.<br>3. Develop and maintain comprehensive security documentation, including security plans and risk assessments. |
| **Cloud Services** | **ISO/IEC 27001** | Global | International standard for Information Security Management Systems (ISMS). | 1. Regularly review and update security policies based on risk assessments.<br>2. Implement access controls and logging for cloud service configurations.<br>3. Conduct regular third-party security assessments for cloud providers. |
| **Accessibility** | **WCAG (Web Content Accessibility Guidelines)** | Global | Ensures web content is accessible to people with disabilities. | 1. Conduct accessibility audits and testing involving users with disabilities.<br>2. Provide accessible alternatives for multimedia content.<br>3. Ensure keyboard navigation and screen reader compatibility. |
| **Privacy** | **CCPA (California Consumer Privacy Act)** | USA | Grants California residents rights concerning their personal information. | 1. Implement a mechanism for users to opt out of the sale of their personal information.<br>2. Establish a process for responding to data access and deletion requests within the specified timeframe.<br>3. Update privacy policies in plain language. |
| **Cybersecurity** | **NIST Cybersecurity Framework** | USA | Provides a framework for improving cybersecurity posture across various industries. | 1. Conduct regular security risk assessments based on the NIST framework.<br>2. Establish an incident response plan and conduct regular drills.<br>3. Implement security awareness training for employees.<br>4. Use network segmentation to isolate critical assets. |
| **Web Application Security** | **OWASP Top Ten** | Global | Highlights the most critical web application security risks. | 1. Injection Attacks (SQL Injection).<br>2. Cross-Site Scripting (XSS).<br>3. Authentication and Session Management issues.<br>4. Insecure Deserialization.<br>5. Security Misconfiguration.<br>6. Sensitive Data Exposure.<br>7. XML External Entity (XXE).<br>8. Broken Access Control.<br>9. Missing Security Headers.<br>10. Cross-Site Request Forgery (CSRF). |

---

# Detailed Notes

## 1. GDPR (General Data Protection Regulation)

### What is GDPR?
GDPR is a European Union regulation focused on protecting user privacy and personal data.

### Key Features
- User consent is mandatory.
- Users can request deletion of their data.
- Companies must disclose data breaches.
- Data collection should be minimal.

### Example
If your application stores:
- User email
- Phone number
- Location

Then you must:
- Ask for permission
- Store data securely
- Allow users to delete their account and data

### Best Practices
```txt
✔ Encrypt sensitive data
✔ Use HTTPS
✔ Limit database access
✔ Add privacy policy
✔ Ask explicit consent
```

---

## 2. HIPAA

### What is HIPAA?
HIPAA protects healthcare information in the United States.

### Protected Information
- Medical history
- Patient reports
- Prescriptions
- Insurance data

### Security Requirements
- Encryption
- Audit logs
- MFA authentication
- Role-based access

### Example
A hospital dashboard should:
- Allow only doctors to access patient reports
- Track who opened patient records
- Automatically log out inactive users

---

## 3. PCI DSS

### What is PCI DSS?
PCI DSS protects payment and card information.

### Important Rules
- Never store raw card CVV.
- Encrypt payment data.
- Perform regular security testing.
- Monitor suspicious activities.

### Example
E-commerce websites like Amazon or Flipkart:
- Use secure payment gateways
- Tokenize card details
- Use HTTPS everywhere

### Tokenization
Instead of storing:
```txt
4111-1111-1111-1111
```
Store:
```txt
tok_x8ad92j3
```

---

## 4. FISMA

### What is FISMA?
FISMA defines security requirements for US federal agencies.

### Goals
- Continuous monitoring
- Risk management
- Security documentation
- Vulnerability management

### Example
Government systems should:
- Monitor cyberattacks continuously
- Maintain incident reports
- Keep systems updated

---

## 5. ISO/IEC 27001

### What is ISO 27001?
An international standard for managing information security.

### Focus Areas
- Risk assessment
- Security policies
- Access management
- Continuous improvement

### Example
Cloud companies implement:
- Access logs
- Security audits
- Employee security training

---

## 6. WCAG (Web Content Accessibility Guidelines)

### What is WCAG?
WCAG ensures websites are accessible for everyone, including users with disabilities.

### Accessibility Features
- Screen reader support
- Keyboard navigation
- Proper color contrast
- Alt text for images

### Example
Bad:
```html
<img src="profile.png">
```

Good:
```html
<img src="profile.png" alt="User profile image">
```

### Keyboard Accessibility
Users should navigate websites using:
- Tab key
- Enter key
- Arrow keys

---

## 7. CCPA

### What is CCPA?
CCPA gives California residents more control over their personal information.

### User Rights
- Know what data is collected
- Delete personal data
- Opt out of selling data

### Example
Websites should provide:
```txt
Do Not Sell My Personal Information
```
button or page.

---

## 8. NIST Cybersecurity Framework

### What is NIST?
A cybersecurity framework for improving security posture.

### Main Functions
1. Identify
2. Protect
3. Detect
4. Respond
5. Recover

### Example
A company should:
- Detect attacks quickly
- Create incident response plans
- Train employees against phishing attacks

---

## 9. OWASP Top Ten

### What is OWASP?
OWASP lists the most critical web application security risks.

---

### 1. SQL Injection

#### Vulnerable Code
```js
const query = `SELECT * FROM users WHERE id = ${id}`
```

#### Safe Code
```js
db.query('SELECT * FROM users WHERE id = ?', [id])
```

---

### 2. Cross-Site Scripting (XSS)

#### Vulnerable
```html
<div>${userInput}</div>
```

#### Safe
Sanitize user input before rendering.

---

### 3. Broken Authentication

Problems:
- Weak passwords
- No MFA
- Poor session handling

Solutions:
- Use JWT carefully
- Add MFA
- Secure cookies

---

### 4. Security Misconfiguration

Examples:
- Default passwords
- Open admin panels
- Exposed APIs

---

### 5. Sensitive Data Exposure

Always:
- Use HTTPS
- Encrypt passwords using bcrypt
- Hide secrets in environment variables

---

### 6. Broken Access Control

Example:
A normal user accessing:
```txt
/admin
```
without permission.

---

### 7. CSRF (Cross-Site Request Forgery)

Attackers force users to perform unwanted actions.

### Protection
- CSRF tokens
- SameSite cookies
- Re-authentication

---

# Common Security Best Practices

## Frontend Security

### 1. Use HTTPS
Always secure communication between client and server.

### 2. Store Tokens Carefully
Prefer:
```txt
HttpOnly Cookies
```
instead of localStorage for sensitive tokens.

### 3. Validate User Input
Never trust user input.

### 4. Use CSP Headers
Content Security Policy helps prevent XSS attacks.

### Example
```http
Content-Security-Policy: default-src 'self';
```

### 5. Use Secure Authentication
- MFA
- Secure sessions
- Password hashing

---

# Quick Interview Revision

| Topic | Important Point |
|---|---|
| GDPR | Protects EU user data |
| HIPAA | Protects healthcare data |
| PCI DSS | Secures payment card data |
| ISO 27001 | Information security management |
| WCAG | Accessibility standards |
| CCPA | California privacy rights |
| NIST | Cybersecurity framework |
| OWASP | Top web security risks |

---

# Final Summary

Modern applications must follow:

- Privacy regulations
- Security standards
- Accessibility guidelines
- Secure coding practices

A good software engineer should:

- Protect user data
- Prevent vulnerabilities
- Follow compliance requirements
- Build secure and accessible systems

