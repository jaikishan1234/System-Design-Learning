# Day 3 --- Measuring / Estimating a System

## Why do we measure a system?

Before designing or scaling a system, we need a rough idea of how much
work it must handle and how quickly it should respond.

System measurement helps us answer questions such as:

-   How many users and requests should the system support?
-   How much data will move through the system?
-   How much storage might be required?
-   What response time will users experience?
-   What happens when traffic increases suddenly?
-   Which part of the system is likely to become a bottleneck?

These calculations are estimates, not exact predictions. The goal is to
get the order of magnitude right and identify the assumptions that need
validation.

## 1. Latency

**Latency** is the time taken for an operation or request to complete.
It is usually measured in milliseconds (ms), microseconds (µs), or
nanoseconds (ns).

For a web application, a simple request-response flow looks like this:

1.  A user sends a request.
2.  The request travels to the server.
3.  The server processes it, possibly querying a database or another
    service.
4.  The server sends a response back.
5.  The user receives the response.

The time taken across this flow contributes to the user's perceived
latency.

### Rough latency intuition

The lecture used the following broad response-time guide:

  Response time        General interpretation
  -------------------- ------------------------------------------
  Under 100 ms         Very responsive
  100--300 ms          Usually feels responsive
  Around 1 second      Noticeable delay
  More than 1 second   Can feel slow; investigate the operation

These are rules of thumb, not universal service-level objectives. The
acceptable latency depends on the operation and user expectations.

### Examples of latency at different levels

The lecture also compared different kinds of reads and network
distances:

  Operation / path                          Approximate example from the lecture
  --------------------------------------- --------------------------------------
  RAM read                                                              \~100 ns
  SSD read                                                              \~100 µs
  HDD read                                                               \~10 ms
  Bengaluru ↔ Mumbai network round trip                                  \~20 ms
  India ↔ USA network round trip                                        \~120 ms

These are illustrative estimates only. Actual timings vary with
hardware, network route, congestion, distance, and workload. Also, a
storage read time is not the same thing as a complete application
request latency.

## 2. Throughput

**Throughput** is the amount of work a system completes in a given
period.

For web services, it is commonly expressed as:

-   Requests per second (RPS)
-   Queries per second (QPS)
-   Messages processed per second
-   Transactions per second (TPS)

For example, if a service processes 1,000 requests in one second, its
throughput during that interval is 1,000 requests/second.

Throughput answers: **How much work can the system handle?**

## 3. Bandwidth

**Bandwidth** is the amount of data that can be transferred over a
connection in a given period. It is commonly measured in bits per second
(bps), such as Mbps or Gbps.

A useful distinction:

-   **Throughput:** How many requests or operations are completed per
    second?
-   **Bandwidth:** How many bits of data are transferred per second?
-   **Latency:** How long does an operation or request take?

A system can have high request throughput but relatively low bandwidth
if each request carries very little data. Conversely, a smaller number
of requests carrying large files can consume substantial bandwidth.

## 4. Traffic patterns: normal traffic vs. peak traffic

Traffic is not always uniform. A service may receive moderate traffic
most of the day and experience a large spike during a popular event,
sale, announcement, or product launch.

When estimating capacity:

1.  Estimate the average or normal traffic.
2.  Identify likely peak periods.
3.  Apply a peak factor to the average as an initial planning
    assumption.
4.  Validate the estimate using real traffic metrics and load tests.

For example, a team might initially model peak traffic as 3×, 5×, or 10×
normal traffic. These are scenario assumptions---not fixed industry
rules.

Designing only for average traffic can leave a system unprepared for
spikes.

## 5. Read-heavy and write-heavy systems

Workloads can be described by the balance between reads and writes.

-   **Read-heavy system:** Reads happen much more frequently than
    writes. Examples can include content browsing, video viewing, and
    product catalogue pages.
-   **Write-heavy system:** Writes happen frequently, such as event
    ingestion, telemetry, frequent location updates, or activity
    recording.
-   **Mixed workload:** Both reads and writes are significant, as in
    messaging and many social applications.

The workload matters because reads and writes can stress different parts
of a system. For example, a read-heavy service may benefit from caching
and read replicas, while a write-heavy service may need careful database
write scaling, queues, batching, or partitioning.

The right solution depends on consistency requirements and the actual
access pattern.

## 6. Uniform usage vs. hotspots

A system's load may be unevenly distributed.

-   **Uniform usage:** Requests are spread relatively evenly across
    users, records, or servers.
-   **Hotspot:** A small number of users, records, keys, or servers
    receive a disproportionate share of traffic.

Hotspots can overload one database partition, cache key, server, or
resource even when the system's overall traffic looks manageable.

For example, if 100 users are active, it is possible that 90 users
experience 50 ms responses while 10 users experience 2,000 ms responses.
The overall average is:

\[ `\frac{(90 \times 50) + (10 \times 2000)}{100}`{=tex} =
245`\text{ ms}`{=tex} \]

The average of 245 ms hides the fact that some users are waiting 2
seconds. This is why averages alone are not enough.

## 7. Percentile latency: p95 and p99

Latency percentiles help describe how long requests take across a
system.

-   **p95:** 95% of requests complete at or below this latency; the
    slowest 5% take longer.
-   **p99:** 99% of requests complete at or below this latency; the
    slowest 1% take longer.

These percentiles help reveal slow requests that an average can hide.
The slowest requests are often referred to as **tail latency**.

For example, if p99 latency is 2 seconds, 99% of requests complete in 2
seconds or less, while 1% take longer.

## 8. Back-of-the-envelope estimation: WhatsApp example

The lecture used a simplified WhatsApp-style messaging example to
practise estimating request volume and network bandwidth.

### Assumptions

Treat these as hypothetical assumptions for the exercise---not verified
current WhatsApp statistics.

  Input                                         Assumption
  --------------------------- ----------------------------
  Daily active users (DAU)          50 crore = 500 million
  Messages per user per day                             40
  Text messages                 90% = 36 messages/user/day
  Photo messages                 10% = 4 messages/user/day
  Average text message size                      200 bytes
  Average photo size                                200 KB
  Seconds in a day                                  86,400

For simplicity, this calculation assumes every active user sends 40
messages per day and that the 90%/10% message split applies uniformly.

### A. Estimate total messages per day

\[ 500{,}000{,}000 `\times 40`{=tex} = 20{,}000{,}000{,}000 \]

**Estimated volume: 20 billion messages per day.**

### B. Estimate average messages per second

\[ `\text{Messages/second}`{=tex} =
`\frac{20{,}000{,}000{,}000}{86{,}400}`{=tex} \]

\[ `\approx 231{,}`{=tex}481 `\text{ messages/second}`{=tex} \]

So the average message rate is approximately **231K messages per
second**.

This is an average. Real traffic will vary by time zone, time of day,
and special events. A production design should also estimate peak
traffic.

### C. Estimate data generated by one user per day

Each user sends 36 text messages and 4 photo messages.

Text data:

\[ 36 `\times 200`{=tex} = 7{,}200 `\text{ bytes}`{=tex} \]

Photo data, using decimal KB (1 KB = 1,000 bytes):

\[ 4 `\times 200`{=tex} `\times 1{,}`{=tex}000 = 800{,}000
`\text{ bytes}`{=tex} \]

Total per user per day:

\[ 7{,}200 + 800{,}000 = 807{,}200 `\text{ bytes}`{=tex} \]

That is approximately **807.2 KB per user per day** (using decimal
units).

### D. Estimate total data per day

\[ 807{,}200 `\times 500{,}`{=tex}000{,}000 =
403{,}600{,}000{,}000{,}000 `\text{ bytes/day}`{=tex} \]

That is approximately **403.6 TB per day** using decimal units.

### E. Estimate average bandwidth

Convert daily bytes to bytes per second:

\[ `\frac{403{,}600{,}000{,}000{,}000}{86{,}400}`{=tex}
`\approx 4.67`{=tex} `\times 10`{=tex}\^9 `\text{ bytes/second}`{=tex}
\]

Convert bytes to bits (1 byte = 8 bits):

\[ 4.67 `\times 10`{=tex}\^9 `\times 8`{=tex} `\approx 37.37`{=tex}
`\times 10`{=tex}\^9 `\text{ bits/second}`{=tex} \]

**Estimated average payload bandwidth: approximately 37.4 Gbps.**

This is a simplified payload estimate. It excludes protocol overhead,
encryption overhead, retries, delivery acknowledgements, metadata,
replication, and other infrastructure traffic. It also assumes the full
photo size is transferred for every photo message.

### Important distinction

The 231K messages/second figure is an average message rate. The 37.4
Gbps figure is an average one-way payload data rate under the stated
assumptions. Neither figure alone tells us how many servers, database
nodes, or storage machines are required.

## 9. What this estimate does not yet tell us

A useful first estimate is only the beginning. A real system design
would also need to investigate:

-   Peak messages per second and peak bandwidth.
-   Whether media is uploaded directly to object storage.
-   How messages are queued, delivered, retried, and acknowledged.
-   How long messages and media are retained.
-   Replication, backups, and disaster recovery.
-   Regional distribution and cross-region traffic.
-   Encryption, protocol overhead, and metadata.
-   Database read/write patterns and storage growth.
-   Availability, durability, and latency targets.

For media-heavy applications, storage and CDN traffic can be major parts
of the design. The example above estimates daily data generated under
simplified assumptions; it is not a complete storage-capacity estimate.

## 10. Key takeaways

1.  **Latency** measures how long an operation takes.
2.  **Throughput** measures how much work is completed per second.
3.  **Bandwidth** measures how much data is transferred per second.
4.  Average traffic is not enough---estimate peak traffic too.
5.  Identify whether a workload is read-heavy, write-heavy, or mixed.
6.  Watch for hotspots and uneven load distribution.
7.  Use p95 and p99 to understand slow requests and tail latency.
8.  Back-of-the-envelope calculations turn vague scale requirements into
    useful starting estimates.
9.  Always state assumptions, check units, and remember what the
    estimate excludes.

## Quick revision

  -----------------------------------------------------------------------
  Term                    Meaning                 Common unit
  ----------------------- ----------------------- -----------------------
  Latency                 Time taken for an       ms, µs, ns
                          operation               

  Throughput              Work completed per unit RPS, QPS, TPS
                          time                    

  Bandwidth               Data transferred per    bps, Mbps, Gbps
                          unit time               

  DAU                     Daily active users      Users/day

  Peak factor             Assumed multiplier from 3×, 5×, 10×, etc.
                          normal to peak load     

  p95 / p99 Latenc        y percentiles ms        
  -----------------------------------------------------------------------

------------------------------------------------------------------------

**Learning note:** These are Day 3 notes from my System Design learning
journey. The goal is to understand the concepts and practise estimating
scale---not to memorise numbers without understanding the assumptions
behind them.
