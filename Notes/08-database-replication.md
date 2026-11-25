# 08 - Database Replication

*System Design Episode 8 (Padho with Pratyush)*

---

## Why Replicate?

- A single database serving many app servers gets overloaded.
- **Horizontal scaling:** keep copies of the data on multiple DB nodes so load and reads are spread out.
- **Fault tolerance:** if one node dies, the others still have the data.
- Most systems are **read-heavy** (~90% reads), so replicas help a lot.

---

## 1. Leader-Follower (Master-Slave)

- The **default** model.
- One node (**A**) is the **leader**; the rest (**B, C, D**) are **followers**.
- **Writes** go to the leader only (avoids write conflicts).
- **Reads** can go to any node.

### Synchronous vs Asynchronous Replication

| | Synchronous | Asynchronous |
|---|---|---|
| Leader waits for follower ack? | Yes | No |
| Pro | Safe | Fast |
| Con | Slow | Stale reads |

### Problems from Replication Lag

**1. Read-your-own-writes**
- User updates profile picture, and the write goes to leader A.
- User refreshes, and the read goes to follower D, which hasn't caught up, so the old picture shows.
- **Fix:** for a short window after a write (~1 min), route that user's reads to the leader.

**2. Going back in time (monotonic reads)**
- Read from B returns new data.
- Refresh hits C, which has old data. Refresh again hits B, which has new data.
- **Fix:** always route a given user's reads to the **same follower**.

---

## 2. Multi-Leader

- One leader **per region**:
  - **Asia:** A (leader), B, C, D
  - **SA:** E (leader), F, G, H
  - **NA:** I (leader), J, K, L
- Users write to their nearest leader (e.g. India, NZ, America users writing to the closest region), giving **low latency**.

### Conflict Problem

- The same record is edited on a **phone at 12:00:00** and a **laptop at 12:00:01** in different regions.
- **Fix: Last Write Wins (LWW)**, where the latest timestamp wins.

---

## 3. Leaderless and Quorum

- **No leader.** A write is sent to all nodes, and success requires a minimum number of acks.
- A read queries several nodes and takes the **latest** version.

### Example (N = 3)

| Node A | Node B | Node C |
|---|---|---|
| 21 (stale) | 23 | 23 |

Reading from multiple nodes and taking the newest value returns **23**.

### Quorum Rule

```
W + R > N
```

- **W** = number of nodes that must confirm a write
- **R** = number of nodes read from
- **N** = total nodes

**Example:** W = 2, R = 2, N = 3, so 2 + 2 > 3 holds. Every read overlaps with at least one node holding the latest write.

---

## Quick Summary

| Model | Writes | Reads | Main Trade-off |
|---|---|---|---|
| Leader-Follower | Leader only | Any node | Replication lag, stale reads |
| Multi-Leader | Nearest regional leader | Local | Write conflicts (LWW) |
| Leaderless | Any node (quorum) | Quorum | Needs W + R > N |
