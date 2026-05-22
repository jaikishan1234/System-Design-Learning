# Unit Testing & Integration Testing — Complete Deep Notes
(For Express.js + React Applications)

## Introduction

In modern full-stack apps, we commonly do:

- Unit Testing
- Integration Testing

on both:

- React frontend
- Express backend

This is one of the most important skills in real-world development because companies care a lot about code reliability.

---

# 1. What is Testing?

Testing means:

> Writing code that checks whether your actual application code works correctly.

Instead of manually checking everything again and again, tests automatically verify behavior.

Example:

You create:

- Login API
- Button component
- Payment logic
- Authentication middleware

Tests ensure they keep working even after future code changes.

---

# 2. Why Testing is Important

Without testing:

- Bugs reach production
- Refactoring becomes scary
- New features break old features
- Team collaboration becomes difficult

With testing:

- Safer code changes
- Faster debugging
- Better code quality
- Easier maintenance
- More confidence

---

# 3. Types of Testing

Main types:

| Type | What It Tests |
|---|---|
| Unit Testing | Small isolated pieces |
| Integration Testing | Multiple modules working together |
| End-to-End (E2E) | Entire app flow |

Example:

| Scenario | Type |
|---|---|
| Testing one React button | Unit |
| Testing login API + DB | Integration |
| Testing full login flow in browser | E2E |

---

# 4. Unit Testing

## Definition

Unit Testing means:

> Testing one small unit of code in isolation.

A “unit” can be:

- Function
- Component
- Utility
- Hook
- Middleware

---

## Goal of Unit Testing

We ONLY test:

- Internal logic
- Small functionality
- Independent behavior

We DO NOT test:

- Database
- Real API
- External services

Those are mocked/faked.

---

# Unit Testing in Express.js

Commonly tested things:

- Utility functions
- Controllers
- Services
- Middleware
- Validators

---

## Example — Utility Function

```js
function add(a, b) {
  return a + b;
}
```

Unit Test:

```js
test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

---

## Example — Password Validator

```js
function validatePassword(password) {
  return password.length >= 8;
}
```

Test:

```js
test("password should be minimum 8 chars", () => {
  expect(validatePassword("123")).toBe(false);
});
```

---

# React Unit Testing

In React we unit test:

- Components
- Hooks
- Utility functions

---

## Example — React Button Component

```jsx
function Button() {
  return <button>Submit</button>;
}
```

Test:

```js
import { render, screen } from "@testing-library/react";
import Button from "./Button";

test("renders submit button", () => {
  render(<Button />);

  expect(screen.getByText("Submit")).toBeInTheDocument();
});
```

---

# 5. Integration Testing

## Definition

Integration Testing means:

> Testing multiple parts of the application working together.

Instead of testing isolated functions:

we test the interaction between modules.

---

## Real Example

Suppose login flow:

```text
Route → Controller → Service → Database
```

Integration testing checks:

- Does route work?
- Is controller connected properly?
- Does DB interaction work?
- Is response correct?

Everything together.

---

# Difference Between Unit & Integration

| Unit Testing | Integration Testing |
|---|---|
| Small isolated unit | Multiple modules together |
| Fast | Slower |
| Mock dependencies | Real dependencies often used |
| Easier debugging | More realistic |
| Tests logic | Tests flow |

---

# Express Integration Testing

Very common.

We test:

- APIs
- Authentication
- Middleware chain
- Database interaction
- Request/response flow

---

# Common Tools

| Tool | Purpose |
|---|---|
| Jest | Test runner |
| Supertest | API testing |
| Mongo Memory Server | Fake DB |
| Vitest | Alternative to Jest |

---

## Express Integration Example

Route:

```js
app.get("/users", async (req, res) => {
  const users = await User.find();

  res.json(users);
});
```

Test:

```js
import request from "supertest";
import app from "./app";

test("GET /users", async () => {
  const response = await request(app).get("/users");

  expect(response.statusCode).toBe(200);
});
```

---

# React Integration Testing

In React integration testing:

we test multiple components working together.

---

## Example

Suppose:

```text
Navbar → SearchBar → API Call → Results
```

Integration test checks:

- Typing search
- API call triggered
- Results shown

Everything connected.

---

# 6. Mocking

## What is Mocking?

Mocking means:

> Replacing real dependencies with fake versions.

---

## Why Mock?

Because unit tests should NOT depend on:

- Real DB
- Real APIs
- Internet
- External services

---

## Mock Example in Jest

```js
jest.mock("./db");
```

OR:

```js
axios.get = jest.fn(() =>
  Promise.resolve({
    data: []
  })
);
```

---

# 7. Testing Libraries

## Backend Testing Stack

| Library | Use |
|---|---|
| Jest | Test runner |
| Supertest | API testing |
| Sinon | Mocking |
| Vitest | Faster Jest alternative |

---

## Frontend Testing Stack

| Library | Use |
|---|---|
| React Testing Library | Component testing |
| Jest | Test runner |
| Vitest | Alternative |
| Cypress | E2E |
| Playwright | E2E |

---

# 8. Jest Deep Understanding

Jest is:

- Test runner
- Assertion library
- Mocking library

all-in-one.

---

## Important Jest Functions

| Function | Purpose |
|---|---|
| test() | Creates test |
| describe() | Groups tests |
| expect() | Assertion |
| beforeEach() | Runs before each test |
| afterEach() | Cleanup |

---

# 9. React Testing Philosophy

React Testing Library says:

> Test behavior, not implementation.

BAD:

```js
checking internal state
```

GOOD:

```js
checking visible UI
```

because users see UI, not internal state.

---

# 10. API Testing Strategy

Good API integration tests check:

- Status code
- Response body
- Validation
- Authentication
- Database effect

Example:

```js
expect(response.body.email)
  .toBe("test@gmail.com");
```

---

# 11. Test Lifecycle

## beforeEach()

Runs before every test.

```js
beforeEach(() => {
  connectDB();
});
```

---

## afterEach()

Cleanup.

```js
afterEach(() => {
  clearDatabase();
});
```

---

# 12. Folder Structure

## Express

```text
tests/
├── unit/
├── integration/
```

---

## React

```text
src/
├── components/
│   ├── Button.jsx
│   ├── Button.test.jsx
```

---

# 13. Coverage

Coverage means:

> How much of your code is tested.

Jest Coverage:

```bash
npm test -- --coverage
```

---

# 14. Common Mistakes Beginners Make

1. Testing implementation details

Test user-visible behavior.

2. Too much mocking

Over-mocking makes tests unrealistic.

3. Writing huge tests

Keep tests focused.

4. Not testing edge cases

Test:

- Empty values
- Invalid inputs
- Errors

---

# 15. Real Industry Flow

## Backend

- Unit test services
- Integration test APIs

## Frontend

- Unit test components
- Integration test flows

## E2E

- Critical user journeys

---

# 16. Testing Pyramid

```text
        E2E
      Integration
         Unit
```

Meaning:

- More unit tests
- Some integration tests
- Few E2E tests

Because:

- Unit tests are fastest
- E2E are slowest

---

# 17. Example Real Full Stack Flow

Suppose user login.

### Backend Unit Test

Test password compare function.

### Backend Integration Test

Test:

```text
POST /login
```

with DB + JWT.

### Frontend Unit Test

Test LoginButton renders.

### Frontend Integration Test

Test:

```text
Form submit → API call → Redirect
```

---

# 18. Best Practices

## Keep tests readable

Good test names:

```js
"should return 401 for invalid token"
```

---

## Test one thing at a time

Avoid giant tests.

---

## Use Arrange Act Assert

Pattern:

```text
Arrange → Setup
Act → Perform action
Assert → Verify
```

---

# 19. Important Realization

Unit tests answer:

> “Does this piece work?”

Integration tests answer:

> “Do these pieces work together?”

Both are VERY important.

---

# 20. What You Should Learn Practically

## For Express

Learn:

- Jest
- Supertest
- Mocking
- Mongo Memory Server

Practice:

- Auth APIs
- CRUD APIs
- Middleware testing

---

## For React

Learn:

- React Testing Library
- user-event
- Mock APIs
- Async testing

Practice:

- Forms
- API calls
- Modals
- Authentication flow

---

# 21. Final Summary

## Unit Testing

- Tests isolated code
- Fast
- Mock dependencies
- Good for logic

Examples:

- Functions
- Components
- Hooks

---

## Integration Testing

- Tests connected modules
- More realistic
- Tests full flows

Examples:

- API + DB
- React components together
- Authentication flow

---

# Most Common Stack

## Express

- Jest
- Supertest

## React

- Jest/Vitest
- React Testing Library

---

# Golden Rule

A good test should give confidence that:

> “If this test passes, the feature probably works correctly.”


---

# 22. Component Testing

## What is Component Testing?

Component Testing means:

> Testing an individual UI component independently.

This is VERY common in React applications.

Instead of testing the entire app, we test one component at a time.

Examples:

- Button component
- Navbar
- Login form
- Modal
- Card component

---

## Why Component Testing Matters

Component testing helps ensure:

- UI renders correctly
- Props work properly
- Events behave correctly
- State updates properly
- Conditional rendering works

---

## Example — Login Button

Component:

```jsx
function LoginButton() {
  return <button>Login</button>;
}
```

Test:

```js
import { render, screen } from "@testing-library/react";
import LoginButton from "./LoginButton";

test("renders login button", () => {
  render(<LoginButton />);

  expect(
    screen.getByText("Login")
  ).toBeInTheDocument();
});
```

---

## Testing User Interactions

You can test:

- Clicks
- Typing
- Form submission
- Hover events

Example:

```js
await userEvent.click(button);
```

---

## Testing Props

Component:

```jsx
function Welcome({ name }) {
  return <h1>Hello {name}</h1>;
}
```

Test:

```js
render(<Welcome name="Jaikishan" />);

expect(
  screen.getByText("Hello Jaikishan")
).toBeInTheDocument();
```

---

# 23. Jest & JSDOM

## What is Jest?

Jest is the most popular JavaScript testing framework.

It provides:

- Test runner
- Assertions
- Mocking
- Coverage reports

---

## What is JSDOM?

JSDOM is:

> A JavaScript implementation of the browser DOM inside Node.js.

Node.js normally does NOT have:

- document
- window
- browser APIs

JSDOM creates fake browser environment for testing.

---

## Why JSDOM is Important in React Testing

React components need browser APIs.

Example:

```js
document.querySelector()
```

Without JSDOM:

React component tests would fail in Node.js.

---

## Example

```js
test("dom exists", () => {
  document.body.innerHTML =
    "<h1>Hello</h1>";

  expect(
    document.querySelector("h1").textContent
  ).toBe("Hello");
});
```

---

## How Jest Uses JSDOM

When running React tests:

```bash
npm test
```

Jest automatically creates JSDOM environment.

So React behaves like it is running inside browser.

---

# 24. Testing Library / React Testing Library

## What is React Testing Library?

React Testing Library (RTL) is:

> A library for testing React components the way users interact with them.

Created by:

entity["people","Kent C. Dodds","Creator of React Testing Library"]

---

## Main Philosophy

RTL encourages:

> “Test the app like a real user.”

Meaning:

- Find elements users see
- Click buttons users click
- Type like users type

NOT:

- Access internal state
- Test implementation details

---

## Core Functions

| Function | Purpose |
|---|---|
| render() | Render component |
| screen | Find elements |
| fireEvent | Trigger events |
| userEvent | Simulate real user |
| waitFor | Wait for async actions |

---

## Example — Render Component

```js
render(<App />);
```

---

## Example — Finding Elements

```js
screen.getByText("Submit");
```

---

## Example — Typing Input

```js
await userEvent.type(
  screen.getByPlaceholderText("Email"),
  "test@gmail.com"
);
```

---

## Example — Clicking Button

```js
await userEvent.click(
  screen.getByText("Login")
);
```

---

## Async Testing

Suppose data loads from API.

You use:

```js
await screen.findByText("Users");
```

This waits until element appears.

---

## Important Query Types

| Query | Meaning |
|---|---|
| getBy | Element must exist |
| queryBy | Element may not exist |
| findBy | Async query |

---

## Example

```js
expect(
  screen.queryByText("Loading")
).not.toBeInTheDocument();
```

---

# 25. Complete Frontend Testing Flow

Real-world React testing flow:

```text
Render Component
      ↓
Find Elements
      ↓
Simulate User Actions
      ↓
Check UI Updates
      ↓
Verify API Results
```

---

# 26. Real Interview Questions

## Difference Between Unit & Integration Testing

Unit:

- Tests isolated unit
- Mock dependencies

Integration:

- Tests modules together
- More realistic

---

## Why React Testing Library over Enzyme?

RTL focuses on:

- User behavior
- Accessibility
- Real interactions

Enzyme focused too much on implementation details.

---

## Why Use JSDOM?

Because Node.js has no browser environment.

JSDOM provides:

- document
- window
- DOM APIs

for React tests.

---

# 27. Recommended Learning Order

## Backend

1. Jest basics
2. Assertions
3. Mocking
4. Supertest
5. API integration testing

---

## Frontend

1. React Testing Library
2. Rendering components
3. Query methods
4. user-event
5. Async testing
6. Integration testing

---

# 28. Final Big Picture

## Unit Testing

Tests:

- Small logic
- Components
- Utilities

Fast and isolated.

---

## Integration Testing

Tests:

- Complete flows
- API + DB
- Component interactions

More realistic.

---

## Component Testing

Tests:

- UI behavior
- Rendering
- Props
- Events

Mostly done using React Testing Library.

---

## Jest + JSDOM

Provides:

- Testing framework
- Fake browser environment

so React tests can run in Node.js.

---

## React Testing Library

Helps test applications like real users interact with them.

This is the modern industry-standard approach for React testing.
