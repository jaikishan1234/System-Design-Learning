# Security — SSJI (Server-Side JavaScript Injection)

## What is SSJI?

SSJI (Server-Side JavaScript Injection) is a security vulnerability where attackers inject malicious JavaScript code into the backend server and the server executes that code.

Unlike XSS, where code executes in the browser, SSJI executes directly on the server.

This is extremely dangerous because attackers may:

- Execute arbitrary code
- Access databases
- Read sensitive files
- Crash the application
- Execute OS commands
- Gain full server control

---

# Common Causes of SSJI

The major reasons SSJI vulnerabilities happen are:

- Inadequate input validation
- Direct execution of user-provided code
- Using dangerous JavaScript functions
- Insecure deserialization

---

# 1. Inadequate Input Validation

## What Does It Mean?

Applications accept user input without properly validating or sanitizing it.

Attackers can inject malicious payloads into the application.

---

# Vulnerable Example

```js
const userInput = req.body.input;

// Dangerous usage
const query = `SELECT * FROM users WHERE name = '${userInput}'`;
```

If attacker sends:

```js
'; DROP TABLE users; --
```

The query becomes:

```sql
SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
```

This may destroy database data.

---

# Secure Validation Example

```js
// User-provided input
const userInput = req.body.input;

if (!isValidInput(userInput)) {
  return res.status(400).send("Invalid input");
}

function isValidInput(input) {
  // Allow only letters, numbers, and spaces
  const regex = /^[a-zA-Z0-9\s]+$/;

  return regex.test(input);
}
```

---

# Why Input Validation Matters

Without validation:

- Attackers can inject payloads
- SQL injection becomes possible
- Command injection becomes possible
- Backend logic may break

Validation acts as the first security layer.

---

# 2. Direct Execution of User-Provided Code

## Dangerous Pattern

One of the worst security mistakes is directly executing user input as JavaScript code.

---

# Vulnerable Example Using eval()

```js
const userCode = req.body.code;

// Extremely dangerous
// Never do this

eval(userCode);
```

---

# Why eval() is Dangerous

If attacker sends:

```js
process.exit()
```

The server may shut down.

Or attacker may send:

```js
require('fs').readFileSync('/etc/passwd')
```

This can expose server files.

---

# Another Dangerous Payload

```js
require('child_process').exec('rm -rf /')
```

This can execute system commands.

---

# Secure Alternative

Never execute raw user-provided JavaScript.

Instead:

- Use predefined logic
- Use safe parsers
- Use strict validation
- Avoid dynamic execution

Example:

```js
const operation = req.body.operation;

const allowedOperations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

if (!allowedOperations[operation]) {
  return res.status(400).send("Invalid operation");
}
```

---

# 3. Using Dangerous Functions

Some JavaScript functions are inherently dangerous.

Examples:

- eval()
- new Function()
- setTimeout(string)
- setInterval(string)

---

# Vulnerable Example Using new Function()

```js
const userCode = req.body.code;

// Dangerous
const func = new Function(userCode);

func();
```

---

# Why new Function() is Dangerous

Attacker controls executable code.

Payload example:

```js
return process.env
```

This may expose environment variables:

- API keys
- Database passwords
- JWT secrets
- AWS credentials

---

# Safer Alternative

Avoid dangerous functions completely.

Instead:

- Use static code
- Use templates safely
- Restrict dynamic behavior

Example:

```js
const templates = {
  welcome: "Welcome User",
  goodbye: "Goodbye User"
};

const selectedTemplate = req.body.template;

if (!templates[selectedTemplate]) {
  return res.status(400).send("Invalid template");
}

res.send(templates[selectedTemplate]);
```

---

# 4. Insecure Deserialization

## What is Deserialization?

Deserialization means converting serialized data back into objects.

Example:

```js
const obj = JSON.parse(data);
```

If malicious data is deserialized without validation, attackers may manipulate application behavior.

---

# Vulnerable Example

```js
const serializedData = req.body.data;

// Dangerous deserialization
const deserializedObject = deserialize(serializedData);
```

---

# Resource Exhaustion Example

```js
const userInput = '{"data":"' + 'A'.repeat(1000000) + '"}';

const data = JSON.parse(userInput);
```

Huge payloads may:

- Crash server memory
- Slow application
- Cause denial of service

---

# Dangerous Buffer Example

```js
const userInput = '{"type":"Buffer","data":[72,101,108,108,111]}';

const buffer = JSON.parse(userInput);

const text = Buffer.from(buffer).toString();
```

Attackers may abuse object structures.

---

# Secure Deserialization Example

```js
const serializedData = req.body.data;

try {
  const deserializedObject = JSON.parse(serializedData);

  if (!isValidData(deserializedObject)) {
    return res.status(400).send("Invalid data");
  }

  res.send(deserializedObject);
} catch (error) {
  res.status(500).send("Error while deserializing data");
}

function isValidData(data) {
  return typeof data === "object";
}
```

---

# Injection Attacks in SQL / NoSQL Databases

## Vulnerable Example

```js
const userInput = '{"username":"admin","password":{"$ne":null}}';

const query = `SELECT * FROM users WHERE data = '${userInput}'`;
```

---

# Why This is Dangerous

MongoDB operators like:

```js
$ne
```

mean:

```text
Not equal
```

Attackers may bypass authentication checks.

---

# Example NoSQL Injection Payload

```json
{
  "username": "admin",
  "password": {
    "$ne": null
  }
}
```

This may authenticate without knowing the password.

---

# Resource Exhaustion / Denial of Service (DoS)

Attackers may intentionally send massive payloads.

Example:

```js
'A'.repeat(10000000)
```

This may:

- Consume RAM
- Crash Node.js
- Freeze server threads

---

# SSJI Attack Flow

```text
Attacker
   ↓
Malicious Payload
   ↓
Backend Application
   ↓
JavaScript Execution
   ↓
Server Compromise
```

---

# Real World Impact of SSJI

SSJI vulnerabilities may lead to:

- Remote Code Execution (RCE)
- Database compromise
- Full server takeover
- Cloud credential theft
- Data leakage
- Application crash

---

# Prevention Techniques

## 1. Never Use eval()

Avoid:

```js
eval(userInput)
```

---

## 2. Avoid new Function()

Avoid:

```js
new Function(userInput)
```

---

## 3. Validate Input Strictly

Allow only expected values.

Example:

```js
const regex = /^[a-zA-Z0-9]+$/;
```

---

## 4. Use Parameterized Queries

Instead of:

```js
const query = `SELECT * FROM users WHERE name = '${userInput}'`;
```

Use:

```js
db.query("SELECT * FROM users WHERE name = ?", [userInput]);
```

---

## 5. Limit Payload Size

Example:

```js
app.use(express.json({ limit: '100kb' }));
```

---

## 6. Use Secure Serialization

Validate deserialized objects before usage.

---

## 7. Disable Dangerous Features

Restrict:

- Dynamic execution
- OS command access
- Unsafe modules

---

# Interview Questions

## What is SSJI?

A vulnerability where attackers inject malicious JavaScript into the backend server.

---

## Difference Between XSS and SSJI?

| XSS | SSJI |
|---|---|
| Executes in browser | Executes on server |
| Targets frontend users | Targets backend server |
| Browser compromise | Server compromise |

---

## Why is eval() dangerous?

Because it executes arbitrary JavaScript code.

---

## Why is new Function() dangerous?

Because attackers can create executable functions dynamically.

---

## What is insecure deserialization?

Unsafe conversion of serialized data into objects without validation.

---

# Final Summary

SSJI is extremely dangerous because attackers may:

- Execute arbitrary code
- Access sensitive data
- Crash servers
- Run OS commands
- Gain full backend access

Main prevention techniques:

✅ Avoid eval()  
✅ Avoid new Function()  
✅ Validate all user input  
✅ Use parameterized queries  
✅ Restrict payload sizes  
✅ Use safe deserialization  
✅ Avoid dynamic execution

