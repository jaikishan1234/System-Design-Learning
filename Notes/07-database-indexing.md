# Database Indexing: System Design Episode 7

Notes from the lecture, in the order the board unfolds.

## 1. The problem: why indexing?

- **Library analogy:** a library has millions of books, and you need to *find* or *update* one. Without any organization, you'd scan every shelf.
- **Instagram login example:** with 10 users, checking `user / pass` by scanning is fine. With millions of rows (name, pass), a full scan on every login is far too slow.
- The question "Database kaunsa?" (which database?) leads to **indexing**, along with choosing SQL or NoSQL (BASE), ACID properties, and thinking about distribution (when, how, where).

## 2. The core idea: a sorted lookup

- A library with 10 subjects keeps a lookup list: Phy → shelf 1, Geography → shelf 2, Chem → shelf 3, English → shelf 4, Math → shelf 5, History → shelf 6.
- Because the list is **sorted by subject**, you can use **binary search** to find "Math" quickly and go straight to its shelf.
- For a users table, keep a separate sorted list of **emails**, where each entry points to the full row (name, email, pass, job, age). Searching an email means binary searching the index, then following the pointer to the row.

## 3. Types of indexes

### 3.1 Primary (clustered) index
- Built on the **primary key** (e.g. CS001, CS002, CS003).
- The table's rows are physically stored in that sorted order.
- Inserting CS005 between CS003 and CS006 means making room in the sorted order, which is costly.

### 3.2 Secondary (non-clustered) index
- Built on other columns (email, phone, etc.).
- It's a separate structure whose entries point to the rows.

### 3.3 Composite index
- Example: `(lastname, firstname)`.
- Entries are sorted by last name first, then first name: Kumar Aman, Kumari Riya, Sharma Aman, Sharma Riya.
- Queries on `lastname` alone or on `lastname + firstname` can use it.
- A query on `firstname` alone can't use it efficiently (the leftmost-prefix rule).
- Example: Indigo bookings searched by `(PNR, lastname)`.

## 4. Why a sorted array isn't enough

- A sorted array (aman, pappu, Riya) gives fast search.
- Inserting a new value like **Rajeev** means shifting elements to keep the order, which is slow for large data.
- The fix is a **B-tree**, a multi-way tree where each node holds several keys and has several children. Search, insert, and delete all stay fast without shifting everything.
- Library analogy for a tree: Class 9 → Physics → ICSE; Fiction → floor 1, Non-fiction → floor 2, Education → floor 3, Comics → floor 4; CBSE → section 1, ICSE → section 2. You narrow down level by level, which is what a B-tree does.

## 5. Write-heavy systems: LSM trees

- **Cassandra** uses an **LSM (Log-Structured Merge) tree**, which is optimized for **writes**.
- Writes first go to an in-memory "rough copy" (e.g. R1 → Noida).
- Periodically they're flushed into a temp index and merged into the main index (e.g. R2 → X means deleted, R5 → Patna overrides Delhi).
- A read like `R1?` or `R5?` checks the newest structures first, then the older ones.

## 6. The trade-off

- **Indexes make reads faster but writes slower.**
- With indexes on name, email, DOB, and age, every write must update *all* of them, so the data write has to wait for the index updates.
- So index only the columns you actually query on (email, name, DOB, phone, username, PNR + lastname, etc.).

## Quick summary

| Concept | One-liner |
|---|---|
| Index | Sorted lookup structure pointing to rows |
| Clustered/primary | Table itself sorted by primary key |
| Secondary | Separate index on other columns |
| Composite | Multi-column, follows leftmost-prefix |
| B-tree | Balanced multi-way tree for fast search and insert |
| LSM tree | Write-optimized, merges in the background |
| Trade-off | Faster reads, slower writes, extra storage |
