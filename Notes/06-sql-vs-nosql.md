# 06 - SQL vs NoSQL: What, When, Why

> System Design Free Course ke lecture notes (Hinglish)

---

## 1. SQL (Relational Databases)

- Data **tables** (rows aur columns) mein store hota hai.
- Basic operations: **store, find, update, delete** (write / read / write / write).
- **Fixed schema**: har row mein wahi columns. Example: Student table → `student_roll | Sub1 | Sub2`.
- **Joins aur complex queries** ke liye best. Example: student → sports, student → guardian → income.
- Examples: **PostgreSQL, MySQL**

### ACID Properties

| # | Property | Matlab |
|---|----------|--------|
| 1 | **Atomicity** | Transaction ya poora hoga ya bilkul nahi (500 kata to 200 bhi credit hona chahiye) |
| 2 | **Consistency** | Rules aur balance hamesha sahi rahein |
| 3 | **Isolation** | Parallel transactions ek dusre ko disturb na karein |
| 4 | **Durability** | Commit ke baad data disk par safe rahe |

### Disadvantage

- **Scaling mushkil** hai, kyunki data split karna padta hai (jaise 50 tables ek machine par, 50 doosri machine par).
- Split hone ke baad **joins painful** ho jaate hain.

---

## 2. NoSQL (4 Types)

### 2.1 Key-Value (e.g., Redis)

- Ek **key** → uski **value** (array, number, JSON, kuch bhi).
- Example:
  - `pratyush_cart → { iPhone, comp, socks }`
  - `pratyush_addr → { ... }`
- **Fast aur easy to grab.**
- Use cases: **sessions, cart, weather cache**

### 2.2 Document DB (e.g., MongoDB)

- Ek student/item ka saara data **ek document** (JSON jaisa) mein.
- Example (student data): `name`, `rollno`, `Math`, `Science`, `Hindi`, ...
- Har document mein alag fields ho sakte hain (flexible schema).
- Flipkart example: iPhone ke `ram, cpu, cam` hote hain, shirt ke `length, width`. SQL mein bahut saare empty columns bante, document DB mein nahi.

### 2.3 Wide Column (e.g., Cassandra)

- Use case: **WhatsApp chats**. Har conversation (Rahul-Priya, Priya-Aman, Mohit-Suri...) ke messages ek partition/row mein jama hote hain.
- **Huge volume of writes** ke liye best: **logs, sensor data, Uber** jaisa data.

### 2.4 Graph DB (e.g., Neo4j)

- Data **nodes** aur unke beech **relationships** ke form mein.
- Example (LinkedIn): `Pratyush → connection → Divya → connection → Aman`
- Use case: **2nd-degree connections**, friend suggestions.

---

## 3. BASE (NoSQL ka model)

1. **B**asically **A**vailable: system hamesha available rahega.
2. **S**oft state: data kuch der ke liye out of sync ho sakta hai.
3. **E**ventually **C**onsistent: thodi der mein saare replicas consistent ho jaate hain.

---

## 4. SQL vs NoSQL: Comparison

| | **SQL** | **NoSQL** |
|---|---|---|
| Structure | Tables | 4 types (KV, Document, Wide column, Graph) |
| Joins / Complex queries | Achhe | Mushkil |
| Scaling | Mushkil | Easy |
| Consistency model | ACID | BASE |
| Examples | PostgreSQL, MySQL | Redis, MongoDB, Cassandra, Neo4j |

---

## 5. Database kaise choose karein? (Decision Framework)

Har baar khud se ye 3 sawaal poochho:

1. **Kis target queries?**
   Joins aur complex queries chahiye → SQL. Simple lookup / key-based access → NoSQL.
2. **ACID / BASE?**
   Strict consistency chahiye (paisa, orders) → ACID (SQL). Thodi inconsistency chalegi (feed, cache) → BASE (NoSQL).
3. **Scale?**
   Bahut zyada data aur traffic → NoSQL (easy scaling).

> NoSQL chunne ke do main karan: **fast** aur **scale**.

---

## 6. Real-world Example: Zomato (Polyglot Persistence)

| # | Kaam | Database |
|---|------|----------|
| 1 | Orders, Payments | **SQL** (ACID chahiye) |
| 2 | Sessions | **Key-Value** |
| 3 | Menu | **Document DB** |
| 4 | Delivery (location data) | **Wide column** |
| 5 | Customer relations | **Graph** |

---

## Key Takeaway

Koi ek database "best" nahi hota. Har feature ke liye pehle **queries, ACID/BASE, scale** ke sawaal poochho, phir database chuno. Isi wajah se bade apps mein **ek saath kai databases** use hote hain.
