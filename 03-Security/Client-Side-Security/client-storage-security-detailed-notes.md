
# Client Storage Security — Detailed Notes

## Introduction

Client-side storage is used to store data directly inside the browser.

Frontend applications commonly use browser storage for:

- Authentication tokens
- User preferences
- Cached API data
- Offline support
- Session management
- Performance optimization

Common browser storage mechanisms:

- localStorage
- sessionStorage
- Cookies
- IndexedDB
- Cache Storage

Although browser storage improves performance and user experience, it also introduces major security risks.

---

# Main Topics

1. Storing Sensitive Data
2. Authentication
3. Data Integrity
4. Storage Limits
5. Session Management

---

# 1. Storing Sensitive Data on Client Storage

## Problem

Storing sensitive information directly inside browser storage is risky.

Examples of sensitive data:

- Passwords
- JWT tokens
- API keys
- Banking information
- Session identifiers

Attackers can access browser storage through:

- XSS attacks
- Browser extensions
- Shared devices
- Malicious JavaScript

---

## Best Practice — Store Sensitive Data on Server

Safest approach:

```txt
Do not store highly sensitive data on frontend.
```

Instead:

- Store critical information on backend
- Use secure sessions
- Send only required data to frontend

---

## Bad Practice Example

```js
// Never store raw password directly
localStorage.setItem('password', 'mySecretPassword');
```

If attacker accesses localStorage:

```txt
Password becomes fully exposed
```

---

## Better Practice

```txt
Store sensitive data on backend server
```

---

## Encrypt Data Before Storage

If frontend must store sensitive data:

```txt
Encrypt the data before storing it
```

---

## Example — Encrypt Sensitive Data

```js
// Original sensitive information
const sensitiveData = 'mySecretPassword';

// Encrypt data before storage
const encryptedData = encryptFunction(sensitiveData);

// Store encrypted value instead of raw value
localStorage.setItem('encryptedData', encryptedData);
```

---

## Code Explanation

### Step 1

```js
const sensitiveData = 'mySecretPassword';
```

Sensitive data exists in readable form.

---

### Step 2

```js
encryptFunction(sensitiveData)
```

Encryption converts readable text into unreadable encrypted text.

Example:

```txt
mySecretPassword
```

becomes:

```txt
a8sdh12jkh12jk
```

---

### Step 3

```js
localStorage.setItem('encryptedData', encryptedData);
```

Store encrypted value instead of raw sensitive data.

---

## Important Security Note

Encryption keys should NOT be exposed on frontend.

Otherwise attackers can decrypt stored data.

---

## Real Attack Scenario

Suppose application stores token like this:

```js
localStorage.setItem('token', 'abc123');
```

Attacker injects malicious script:

```js
const token = localStorage.getItem('token');
sendToAttacker(token);
```

Now attacker can hijack user session.

---

## Token Expiry

Authentication tokens should expire after some time.

Short-lived tokens reduce attack duration.

---

## Example — Token Expiration

```js
// Generate authentication token
const token = generateToken();

// Store token temporarily
localStorage.setItem('token', token);

// Remove token after expiration time
setTimeout(() => {

  // Token expired
  localStorage.removeItem('token');

}, tokenExpirationTime);
```

---

## Why Token Expiry Matters

Without expiry:

```txt
Attacker gets permanent access
```

With expiry:

```txt
Attack window becomes very small
```

---

# 2. Authentication

## What is Authentication?

Authentication verifies user identity.

Examples:

- Username + Password
- Google Login
- OTP Login

---

## JWT Authentication

JWT stands for:

```txt
JSON Web Token
```

JWT is commonly used in frontend applications.

---

## JWT Flow

### Step 1

User logs in.

### Step 2

Server verifies credentials.

### Step 3

Server generates JWT token.

### Step 4

Frontend stores token.

### Step 5

Frontend sends token with API requests.

---

## JWT Example

```js
// Login response token
const token = 'jwt-token-value';

// Store token
localStorage.setItem('token', token);

// Send token in API request
fetch('/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## JWT Risks

If attacker steals JWT:

- User account may be hijacked
- APIs may become accessible
- Sessions may be compromised

---

## JWT Best Practices

- Use HTTPS
- Keep token expiry short
- Prefer HttpOnly cookies
- Avoid insecure storage

---

## OAuth Authentication

OAuth allows login using third-party providers.

Examples:

- Google Login
- GitHub Login
- Facebook Login

---

## MFA (Multi-Factor Authentication)

MFA adds additional security layer.

Examples:

- Password
- OTP
- Authenticator app
- Fingerprint

---

## MFA Flow

### Step 1

User enters password.

### Step 2

Server sends OTP.

### Step 3

User enters OTP.

### Step 4

Access granted.

---

## Why MFA Matters

Even if attacker steals password:

```txt
Second verification is still required
```

---

# 3. Data Integrity

## What is Data Integrity?

Data integrity means:

```txt
Stored data should not be modified unexpectedly
```

---

## Problem

Attackers may modify browser data.

Examples:

- Changing product prices
- Modifying tokens
- Altering cached data

---

## Solution — Checksum Validation

Checksums help detect data modification.

---

## Example — Checksum Validation

```js
// Original data
const dataToStore = 'myData';

// Generate checksum
const checksum = calculateChecksum(dataToStore);

// Store original data
localStorage.setItem('data', dataToStore);

// Store checksum
localStorage.setItem('checksum', checksum);

// Retrieve stored values
const storedData = localStorage.getItem('data');
const storedChecksum = localStorage.getItem('checksum');

// Compare checksum values
if (calculateChecksum(storedData) === storedChecksum) {

  console.log('Data is safe');

} else {

  console.log('Data has been tampered with');

}
```

---

## Explanation

### Step 1

Generate checksum from original data.

### Step 2

Store:

- Original data
- Checksum

### Step 3

Retrieve data later.

### Step 4

Generate checksum again.

### Step 5

Compare checksum values.

---

## Real World Example

Suppose ecommerce app stores:

```txt
Product Price = $10
```

Attacker changes it to:

```txt
Product Price = $1
```

Checksum validation detects modification.

---

# 4. Storage Limits

Browser storage has limited capacity.

---

## Approximate Storage Limits

| Storage Type | Approximate Size |
|---|---|
| localStorage | 5MB - 10MB |
| sessionStorage | 5MB - 10MB |
| IndexedDB | 50MB - 100MB+ |
| Cookies | 4KB - 20KB |
| Cache Storage | Around 100MB |

---

## localStorage

- Persistent storage
- Survives browser restart
- Small storage capacity

---

## sessionStorage

- Temporary storage
- Removed when tab closes

---

## IndexedDB

- Large structured storage
- Used in offline applications

---

## Cookies

- Very small storage
- Sent with every request

---

## Example — Checking Storage Usage

```js
function hasEnoughSpaceForData() {

  // Check if StorageManager API exists
  if ('storage' in navigator && 'estimate' in navigator.storage) {

    // Get storage information
    navigator.storage.estimate().then(estimate => {

      // Current storage usage
      console.log(
        'Usage: ' +
        (estimate.usage / 1024 / 1024).toFixed(2) +
        ' MB'
      );

      // Maximum available quota
      console.log(
        'Quota: ' +
        (estimate.quota / 1024 / 1024).toFixed(2) +
        ' MB'
      );

    });

  } else {

    console.log(
      'StorageManager API is not supported'
    );

  }
}
```

---

## Why Storage Limits Matter

Applications should:

- Avoid exceeding storage limits
- Prevent crashes
- Handle storage failures properly

---

## Real Problem Example

Suppose app stores huge video files in localStorage.

Result:

```txt
QuotaExceededError
```

---

# 5. Session Management

## What is Session Management?

Session management tracks authenticated users.

It helps applications:

- Maintain login state
- Identify users
- Control access securely

---

## HttpOnly Cookies

Best practice:

```txt
Store session IDs inside HttpOnly cookies
```

Benefits:

- JavaScript cannot access cookies
- Reduces XSS risk

---

## Secure Cookies

Use:

```txt
Secure flag
```

This ensures cookies travel only through HTTPS.

---

## Example — Session Management

```js
// Generate session ID
const sessionId = 'abcdef123456';

// Store session in secure cookie
// HttpOnly blocks JavaScript access
// Secure allows HTTPS-only transfer

document.cookie =
  `sessionId=${sessionId}; HttpOnly; Secure`;

// Server retrieves session information
const sessionData = getSessionData(sessionId);
```

---

## Real Attack Scenario

Without HttpOnly:

```js
const cookie = document.cookie;
sendToAttacker(cookie);
```

Attacker steals session cookie.

---

## With HttpOnly

JavaScript cannot access session cookie.

This blocks many XSS-based session theft attacks.

---

# Final Summary Table

| Topic | Main Goal |
|---|---|
| Sensitive Data Storage | Protect confidential information |
| Authentication | Verify user identity |
| Data Integrity | Detect tampering |
| Storage Limits | Handle browser capacity safely |
| Session Management | Maintain secure user sessions |

---

# Important Interview Questions

## 1. Why is localStorage risky?

Because JavaScript can access it, making it vulnerable to XSS attacks.

---

## 2. Why should tokens expire?

To reduce risk if tokens get stolen.

---

## 3. What is checksum used for?

To verify data integrity.

---

## 4. Why use HttpOnly cookies?

They prevent JavaScript from accessing session cookies.

---

## 5. Which browser storage supports large structured data?

IndexedDB.

---

# Final Notes

Important principles:

- Store minimum sensitive data
- Encrypt important information
- Use secure authentication
- Validate integrity
- Manage sessions safely
- Respect storage limits
