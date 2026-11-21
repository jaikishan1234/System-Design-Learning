# Scaling: System Design Notes

**Topic:** Vertical vs Horizontal Scaling, and when to use what.

**Questions to cover:**
- How does horizontal scaling work?
- How does a load balancer work?
- Consistent hashing
- Heartbeat
- Cookies
- Stateless servers

---

## 1. Vertical vs Horizontal Scaling

| | **Vertical** | **Horizontal** |
|---|---|---|
| **What** | Build a bigger system (more RAM/CPU on one machine) | Add more servers |
| **Complexity** | Simple, no code changes | Complex: needs a load balancer and stateless servers |
| **Cost** | Expensive | Cheaper |
| **Ceiling** | Yes, a machine can only get so big | No ceiling |
| **Downtime** | Yes, while upgrading | No downtime |

---

## 2. How Horizontal Scaling Works

Many users send requests to **one entry point**, the **load balancer**, which spreads them across multiple servers (C1, C2, C3).

```
User 1 ──┐
User 2 ──┼──► Load Balancer ──┬──► C1
User 3 ──┘                    ├──► C2
                              └──► C3
```

---

## 3. Load Balancer: Its Jobs

1. **Traffic spread:** distribute requests across servers
2. **Health check / heartbeat:** detect servers that are down
3. **Add / remove servers:** scale up or down without downtime
4. **Security:** a single protected entry point

---

## 4. Traffic Spread Algorithms (Load Balancing Algorithms)

The algorithm the load balancer uses to decide which server gets each request is called the **traffic spread algorithm**, also known as the **load balancing algorithm**.

### 4.1 Round Robin

Requests go to servers in order, then loop back to the start.

```
R1 → C1
R2 → C2
R3 → C3
R4 → C1
R5 → C2
R6 → C3
...
```

- **Pros:** simple
- **Cons:** assumes every request costs the same. Requests differ in cost:
  - Request → time ↑ (heavy, e.g. payment)
  - Request → time ↓ (light, e.g. login)
- A server can end up overloaded with heavy requests while others sit idle.

### 4.2 Load Based (Least Loaded / "sabse free")

Send the request to the server that is **most free** (lowest connections / CPU / memory).

- Needs the load balancer to track each server's current load.

### 4.3 Weighted Round Robin

Servers are not equal, so give stronger servers a bigger share.

| Server | Capacity | Weight |
|---|---|---|
| C1 | 8 GB | 1 |
| C2 | 128 GB | 2 |
| C3 | 1 TB | 3 |

Total weight = 1 + 2 + 3 = **6**. Out of every 6 requests:
- 1 request → C1
- 2 requests → C2
- 3 requests → C3

### 4.4 Hash Based

Convert some **information into a number** using a hash function, and use that number to pick a server.

**Inputs that can be hashed:** user id, IP, port, request type.

Example with `% 10`:

```
17 % 10 = 7
27 % 10 = 7
13 % 10 = 3
```

- The same input always gives the same hash, so it always goes to the same server.
- Example mapping: video → C1, payment → C2, orders → C3.
- **Use:** sticky routing (the same user always lands on the same server).
- **Weakness:** with plain `% N`, adding or removing a server remaps most keys. This is solved by **consistent hashing** (next topic).

---

## 5. Cookies, Sessions and Stateless Servers

### The problem

1. The user logs in with username and password. The request goes to server **C1**.
2. C1 verifies the credentials, creates a **session id** (e.g. "Pratyush") and remembers that this user is authenticated.
3. C1 sends the session id back to the **browser** as a **cookie**.
4. The browser sends the cookie with every later request.

If the next request goes to **C2**, C2 has no record of that session, so the user has to **log in again**.

```
User ──login──► C1  (session stored here)
User ─────────► C2  (no session, login again)
```

### The solution: a shared system

Move the cookie/session data into a **shared system** (shared session store) that every server can read.

- Stores state like **login**, **add to cart** and **payment info**.
- Servers no longer keep state themselves, so they are **stateless**.
- Any server can handle any request, which is what makes horizontal scaling work.

---

## 6. Summary

- **Vertical scaling:** simple but expensive, has a ceiling and causes downtime.
- **Horizontal scaling:** cheaper, no ceiling and no downtime, but needs a **load balancer** and **stateless servers**.
- The load balancer spreads traffic (**round robin, load based, weighted round robin, hash based**), runs health checks, and adds or removes servers.
- **Stateless servers** need shared session storage so any server can serve any user.
- **Next topic:** consistent hashing.
