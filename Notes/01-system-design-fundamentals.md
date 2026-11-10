# System Design --- Lecture 1 Notes

> **Topic:** Introduction to System Design\
> **Source:** Lecture notes and board screenshots\
> **Focus:** Core ideas, trade-offs, client-server communication, HLD
> vs. LLD, and non-functional requirements.

------------------------------------------------------------------------

## 1. System Design Is About Trade-offs

System design is the process of deciding how the parts of a software
system should work together to meet its requirements.

There is rarely one solution that is best in every way. A design
decision usually involves trade-offs between factors such as:

-   Time
-   Cost
-   Comfort or user experience
-   Performance
-   Reliability
-   Scalability

### Example: Travelling from Delhi to Patna

The lecture uses different travel options to illustrate trade-offs:

  Travel option     Time     Price                    Comfort
  ----------------- -------- ------------------------ ---------
  Flight            Best     Worst (most expensive)   Medium
  AC 3-tier train   Medium   Medium                   Best
  General train     Medium   Best (least expensive)   Worst

**Takeaway:** The best option depends on what matters most to the person
making the decision. The fastest option may be expensive, while the
cheapest option may offer less comfort.

The same principle applies to software architecture: choose based on
requirements and priorities, not because one technology or design is
always "best".

------------------------------------------------------------------------

## 2. Client-Server Architecture

A basic system can be understood through two main components:

-   **Client:** The application or device that initiates a request.
    Examples include a browser or mobile app.
-   **Server:** The system that receives the request, processes it, and
    sends back a response.

### Request-response cycle

1.  The client sends a request to the server.
2.  The server processes the request.
3.  The server sends a response to the client.
4.  The client uses the response, for example, to display data.

``` text
Client  ─────── Request ───────>  Server
Client  <────── Response ───────  Server
```

This is the basic interaction behind many web applications and APIs.

------------------------------------------------------------------------

## 3. High-Level Design (HLD) vs. Low-Level Design (LLD)

System design is commonly discussed at two levels.

### High-Level Design (HLD)

HLD focuses on the overall architecture and the major components of a
system.

It answers questions such as:

-   What are the main components?
-   How do those components communicate?
-   Which databases or external services are needed?
-   How will the system handle growth and failures?

**Think of HLD as planning the overall system before getting into
implementation details.**

### Low-Level Design (LLD)

LLD focuses on the internal design and implementation of individual
components.

It covers details such as:

-   Classes, objects, and interfaces
-   Methods and relationships between classes
-   Data models and component behaviour
-   Design patterns and implementation choices

LLD is more closely connected to coding and machine-level implementation
details than HLD.

  ---------------------------------------------------------------------
  HLD                                LLD
  ---------------------------------- ----------------------------------
  Overall system architecture        Internal component design

  Focuses on major services and      Focuses on classes, methods, and
  their interactions                 object relationships

  Answers "What components do we     Answers "How should each component
  need, and how do they interact?"   be implemented?"

  Architecture and planning          Detailed design and implementation
  ---------------------------------------------------------------------

------------------------------------------------------------------------

## 4. Non-Functional Requirements (NFRs)

Functional requirements describe **what a system should do**.

Non-functional requirements describe **how well the system should do
it** and the qualities it should provide.

Important NFRs introduced in the lecture:

### 4.1 Scalability

Scalability is the ability of a system to handle an increase in
workload.

For example, a service that handles 100 requests today may need to
handle 1,000 or 100,000 requests as its user base grows.

A scalable system should be able to accommodate this growth without
unacceptable degradation.

### 4.2 Performance and Latency

-   **Performance** describes how efficiently a system performs.
-   **Latency** is the time taken for an operation or request to receive
    a response.

For example, users generally expect a page or API request to respond
quickly.

### 4.3 Availability

Availability describes how often a system is operational and accessible
when users need it.

It is commonly expressed as a percentage.

  Availability     Approximate downtime per year
  -------------- -------------------------------
  99%               3 days, 15 hours, 36 minutes
  99.9%                      8 hours, 46 minutes
  99.99%                  52 minutes, 34 seconds
  99.999%                  5 minutes, 15 seconds

**Takeaway:** Even a small increase in the availability percentage can
significantly reduce the allowed downtime.

### 4.4 Reliability and Fault Tolerance

-   **Reliability:** The ability of a system to operate correctly and
    consistently over time.
-   **Fault tolerance:** The ability of a system to continue operating,
    possibly with reduced functionality, when some components fail.

A reliable design anticipates failures instead of assuming that every
component will always work.

### 4.5 Consistency

Consistency means that users or components see data that follows the
system's defined correctness rules.

**Example --- bank balance:** If money is transferred between two
accounts, the system must maintain correct balances. It should not leave
the accounts in an incorrect state because of a partial or conflicting
update.

Consistency is especially important in systems that manage financial or
other critical data.

### 4.6 Durability

Durability means that once data has been successfully committed or
saved, it should not be lost, even if a process or machine subsequently
fails.

**Example:** After a successful bank transaction, the transaction record
and updated balance should persist.

### 4.7 Security

Security protects the system and its data from unauthorized access,
misuse, and attacks.

It includes concerns such as authentication, authorization, data
protection, and secure communication.

### 4.8 Cost

Cost includes the resources required to build, run, and maintain a
system, such as:

-   Servers and cloud infrastructure
-   Storage and database usage
-   Network traffic
-   Third-party services
-   Operational and maintenance effort

A design should meet its requirements while keeping costs reasonable.

### 4.9 Maintainability

Maintainability is how easily a system can be understood, fixed,
modified, and extended.

Readable code, clear separation of responsibilities, useful
documentation, and good tests can improve maintainability.

------------------------------------------------------------------------

## 5. Quick Revision

  Concept           Remember
  ----------------- -------------------------------------------------
  Trade-off         Improving one quality may affect another
  Client            Sends requests
  Server            Processes requests and returns responses
  HLD               Overall architecture and component interactions
  LLD               Detailed design of individual components
  Scalability       Handles increasing workload
  Performance       How efficiently the system works
  Latency           Time taken to respond
  Availability      How often the system is accessible
  Reliability       Operates correctly over time
  Fault tolerance   Continues operating despite failures
  Consistency       Data follows correctness rules
  Durability        Committed data persists
  Security          Protects systems and data
  Cost              Resources needed to build and operate
  Maintainability   Ease of understanding and changing the system

------------------------------------------------------------------------

## 6. Key Takeaways

1.  System design is about making decisions based on requirements and
    trade-offs.
2.  There is no universally perfect architecture; the right choice
    depends on the problem.
3.  Client-server architecture follows a request-response model.
4.  HLD deals with the overall architecture, while LLD deals with
    implementation-level details.
5.  Non-functional requirements are essential when designing systems
    that need to serve real users reliably.

------------------------------------------------------------------------

## 7. Questions to Think About

-   If an application suddenly gets 10 times more traffic, what parts
    might become bottlenecks?
-   Can a system be highly available but still unreliable?
-   Why might a bank prioritize consistency over response speed for
    certain operations?
-   What trade-offs might arise when choosing between a single server
    and multiple servers?
