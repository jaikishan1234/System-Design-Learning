# Story of an App Growing Up

> From a **hostel-room computer** to **Instagram.com with billions of users** in **9 stages**.
> Running example: **Instagram**. A user uploads photos, and other users see them in a feed.

---

## Core Vocabulary (used again and again)

| Term | Meaning (in simple words) | Example from class |
|---|---|---|
| **Client** | The user or device sending a request | User on the Instagram app |
| **Server** | The machine running your code and/or DB | "Laptop" |
| **Request / Response** | Client asks, server answers | Request: show my feed. Response: the feed |
| **Bottleneck** | One slow narrow point that slows the whole system | 8-lane road squeezing into a tiny gap |
| **Single Point of Failure (SPOF)** | One component whose failure breaks everything | 500 customers depend on 1 delivery partner |
| **Redundancy** | Keep extra copies of important parts so failure doesn't hurt | Car has 4 wheels plus a spare (stepney) |
| **Separation of responsibility** | Each machine does one job | Code on Laptop 1, DB on Laptop 2 |

---

## The 3 Big Ideas (the theory behind every stage)

### 1. Bottleneck
- **Idea:** a system is only as fast as its slowest part.
- **Example:** an 8-lane highway narrows to a tiny gap. The traffic is slow even though the lanes before and after are wide.
- **In apps:** one overloaded DB or one weak server slows every user.
- **Fix:** find the slow part and scale it or split it up.

### 2. Single Point of Failure (SPOF)
- **Idea:** if one thing dies and everything dies with it, that thing is a SPOF.
- **Example:** you have 500 customers and 1 delivery partner. If he is unavailable, all 500 are affected.
- **Fix:** add more of that component (redundancy).

### 3. Redundancy
- **Idea:** repeat the critical component so there is a backup.
- **Example:** a car has 4 wheels and a spare (stepney). If one wheel **fails**, you **replace** it with the spare and keep going.
- **Note:** repetition looks wasteful, but it buys reliability.

---

## Stage 0: Everything on ONE laptop

```
Client (User) ---request---> [ Laptop: Code + Database ] ---response---> Client
```

- One laptop holds the **code** and the **database**.
- This is fine for a hostel project and for a few users.
- **Problems later:** it has every issue above. It is a bottleneck, a SPOF, and has no redundancy.

---

## Stage 1: Separation of responsibility (Code and DB on different machines)

```
Laptop 1 [ Code ]  <------>  Laptop 2 [ Database ]
```

**Theory:** the code and the database need different resources, so give each its own machine.

| | Laptop 1 (Code) | Laptop 2 (Database) |
|---|---|---|
| Needs | **More CPU, more RAM** (compute-heavy) | **More disk** (512 GB, 1 TB), less RAM and CPU |
| Job | Runs logic, handles requests | Stores data |

**Why do it:** each machine can be tuned and upgraded for its own job, and a problem in one doesn't hog the other's resources.

---

## Stage 2: Vertical Scaling ("make the machine bigger")

```
User ---> [ Laptop: Code ]      8-core CPU, 16 GB RAM, 128 GB disk
                                 upgrade to
                                 12-core CPU, 32 GB RAM, 1 TB disk
```

- **Definition:** keep one machine but upgrade its hardware (more CPU, RAM, disk).
- **Example:** replace an 8-core, 16 GB RAM laptop with a 12-core, 32 GB RAM one.
- **Problems ("choke and slow")**
  - There is a hard limit, because you can't upgrade forever.
  - It is expensive.
  - It is still one machine, so it is still a **SPOF**.
  - It eventually chokes and slows down anyway.

---

## Stage 3: Horizontal Scaling ("add more machines")

```
                         +--> Laptop 1 (Code)  60%  --+
User --> Load Balancer --+--> Laptop 2 (Code)  30%  --+--> Laptop (Database)
                         +--> Laptop 3 (Code)  90%  --+
```

- **Definition:** instead of one big machine, use **many machines** that run the same code.
- **Load Balancer (LB):** sits in front and distributes incoming requests among the servers.
- The sketch shows uneven load: Laptop 1 at 60%, Laptop 2 at 30%, Laptop 3 at 90%. A good LB tries to spread requests so no one server is overloaded.
- All code servers talk to **one shared database**.

**New problem:** the **Load Balancer is now a Single Point of Failure**. If the LB dies, users can't reach any server.
**Fix (redundancy):** add a **second Load Balancer** as a backup.

| Vertical | Horizontal |
|---|---|
| Bigger machine | More machines |
| Has a hard limit | Practically unlimited |
| Still a SPOF | Removes the SPOF (with redundancy) |

---

## Stage 4: Database Bottleneck and Caching

**Problem:** many servers all hit **one database**, so the DB becomes the bottleneck ("choke").

### Read vs Write
| Operation | Example | Type |
|---|---|---|
| Photo upload | Save a new photo's data | **Write** |
| Like | See how many likes a post has | **Read** |

- Reads are **far more frequent** than writes (millions of people viewing likes).
- Hitting the DB for every like count is wasteful.

### Caching
- **Definition:** store frequently used data in **RAM** (fast memory) so the code doesn't ask the DB every time.
- **Example:** a post has "100 likes". Keep that number in the cache (RAM), and the code reads it from there instead of the DB.
- **Refresh:** the cache is updated periodically (e.g. every **10 sec, 1 min, or 1 hour**).
- **Cache update:** when the real data changes, the cache must be updated too. Otherwise it shows **stale** data.
- Account details can also be cached.

**Trade-off:** it is very fast and reduces DB load, but the data can be slightly outdated (e.g. a like count 2 minutes old). This is acceptable for likes, but not for something like a bank balance.

---

## Stage 5: Replication (Primary and Secondary Databases)

**Problem:** even with caching, one database handles too much, and it is also a SPOF.

```
                 writes (upload)
Servers  -------------------------> [ Primary DB ]
                                          |  data copy
                                          v
Servers  <----- reads ---------- [ Secondary DB 1 ]
                                 [ Secondary DB 2 ]
                                 [ Secondary DB 3 ]
```

- **Replication:** keep **copies** of the database on multiple machines.
- **Primary DB:** takes all **writes** (uploads). The data is then **copied** to the secondaries.
- **Secondary DBs:** serve **reads** (likes, feed).
- **Benefits**
  - Read load is spread over many DBs.
  - Backup copies exist (redundancy), so if the primary dies a secondary can take over.

### Full architecture so far
```
User -> LB (+ backup LB) -> Laptop 1, 2, 3 (code)
                                 |-- writes --> Primary DB --copy--> Secondary DBs
                                 |-- reads  --> Secondary DBs
```

---

## Stage 6: Photo Storage (Object Storage / Amazon S3)

**Problem:** photos and videos are huge.

**Example calculation from class**
- 1 photo is about 100 MB to 500 MB (as per class estimate)
- 10 lakh users x 500 MB = **a massive amount of data**
- A single disk is limited (1 TB, 2 TB, 5 TB, 10 TB), so you can't keep it all on app servers or in the DB.
- A laptop has about 128 GB. A single video can be about 128 GB.

**Solution: Object Storage** (like Google Drive: you upload files and get a link)

| What | Where |
|---|---|
| The actual photo or video (big, e.g. 10 MB or more) | **Object storage** |
| A small **link** to it (about 10 KB) | **Database** |

**Flow:** user uploads -> file stored in object storage -> a **link** is returned -> the link is saved in the **Primary DB**.

**Amazon S3 = Simple Storage Service**
- It is cheap ("sasta").
- It is effectively **unlimited** storage.
- The DB stores only the link, and S3 holds the real files.

---

## Stage 7: Queues (Asynchronous Processing)

**Problem:** a photo upload isn't just "save it". Many heavy tasks follow:

1. **Upload**, which depends on the file size
2. **Processing**, such as handling 4K and other large formats and converting them
3. **Copyright check**, plus Snapchat-style filters and abuse detection

If the user waits for all of this, the app feels **slow**.

### Message Queue
- **Message:** a small note, e.g. "process photo #123".
- **Queue:** a line where messages wait in order (first in, first out).
- Workers (background servers) take messages from the queue one by one.

```
User uploads --> App --> [ msg | msg | msg | msg ] --> Workers do heavy processing
                  |            (QUEUE)
                  +--> instantly tells user "uploaded!"
```

**Fast vs slow**
- **Fast:** accept the upload and reply immediately.
- **Slow:** process in the background.

**Example from class:** 1 lakh uploads. Upload takes 1 min, one more step takes 1 min, and processing takes 20 min, so 1 + 1 + 20 = **22 min**. Without a queue, **User 1 waits 22 min, User 2 waits 22 min**, and so on. With a queue, the user is told "done" immediately and the 22 minutes of work happens behind the scenes.

**Benefits:** a faster user experience, spikes are absorbed (messages just wait), and workers can be added independently.

---

## Stage 8: Sharding (Splitting the Database)

**Problem:** even with replication, every database still holds **all the data**. Eventually it is too big and too busy for one machine.

```
              [ Data ]
             /    |    \
        Prim 1  Prim 2  Prim 3
        (users  (users  (users
         group A) group B) group C)
```

- **Sharding:** split the data into **parts (shards)**, and each part lives on its own database.
- Each shard (Prim 1, 2, 3) holds only **a portion** of the data, for example different sets of users.
- A user's request goes to the shard that owns their data.
- **Benefits:** storage is split, the write load is split, and each DB stays small and fast.

> Replication = **copies** of the same data. Sharding = **different slices** of the data.

---

## Stage 9: Microservices and Data Monitoring

**Problem:** one giant application (a monolith) does everything: photos, reels, posts, live streaming. A bug or load spike in one feature can hurt all of them.

**Microservices:** break the app into small independent services.

| Feature | Service |
|---|---|
| Photo | Service 1 |
| Reels | Service 2 |
| Posts | Service 3 |
| Live streaming | Service N |

**Benefits**
- Scale each service independently (e.g. add more machines only for Reels).
- A failure in one doesn't bring down the rest.
- Teams can build and deploy each one independently.

**Data Monitoring:** with so many moving parts, you must **watch** the system (health, load, errors, speed) to detect problems early.

---

## Full Journey: Cheat Sheet

| Stage | Name | Problem it solves | Key idea |
|---|---|---|---|
| 0 | Single laptop | (starting point) | Everything in one place |
| 1 | Separation of responsibility | Code and DB need different resources | Code machine and DB machine |
| 2 | Vertical scaling | Machine too slow | Bigger machine (limited) |
| 3 | Horizontal scaling | Hard limit and SPOF | More machines plus **Load Balancer** (+ backup LB) |
| 4 | Caching | DB overloaded by reads | Keep hot data in **RAM** |
| 5 | Replication | DB load and DB failure | **Primary** (writes) + **Secondaries** (reads) |
| 6 | Object storage (S3) | Photos and videos too big | Store files in S3, **link** in DB |
| 7 | Queues | Slow heavy processing | Reply fast, process **async** |
| 8 | Sharding | DB too big for one machine | Split data across **multiple primaries** |
| 9 | Microservices and monitoring | One huge app is risky | Independent services and watching everything |

---

## Final Architecture (big picture)

```
                    +-----> Service: Photo   ---> Shard / DB ---> S3 (files)
User -> LB (+backup) +-----> Service: Reels   ---> Shard / DB
                    +-----> Service: Posts   ---> Shard / DB
                    +-----> Service: Live    ---> ...
                              |
                              +--> Cache (RAM)
                              +--> Queue --> Workers (copyright, 4K, abuse checks)
                              
Each DB: 1 Primary (writes) + many Secondaries (reads), split by Sharding
Everything is watched by Monitoring
```

---

## Quick Revision Questions

1. What is a bottleneck? Give the road example.
2. What is a single point of failure? Give the delivery partner example.
3. Why do a car's spare wheel and redundancy go together?
4. Why do the code and the DB need different machines? What does each need?
5. Vertical vs horizontal scaling: differences and limits?
6. Why is the load balancer a SPOF, and how is it fixed?
7. Why are reads more frequent than writes? How does caching help? What is the trade-off?
8. Replication vs sharding: what is the difference?
9. Why don't we store photos in the DB? What goes in the DB instead?
10. What does S3 stand for, and why is it used?
11. How does a queue make uploads feel fast? (1 + 1 + 20 = 22 min example)
12. Why break an app into microservices? Why do we need monitoring?

---

## Things to Go Deeper On (later chapters)

- Load balancing algorithms (round robin, least connections)
- Cache eviction policies, cache invalidation, Redis
- Replication lag, failover, leader election
- Sharding keys, consistent hashing, hot shards
- Message brokers (Kafka, RabbitMQ, SQS)
- CDN for serving photos closer to users
- Service-to-service communication, API gateway
- Monitoring tools, logging, alerting
