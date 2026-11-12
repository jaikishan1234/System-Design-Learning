# How the System Works

## 1. Client and Server

A **client** is a device or application that requests information or a
service. Examples include a phone, laptop, browser, or mobile app.

A **server** is a computer (and the software running on it) that
receives requests, processes them, and sends responses.

Example: - A user opens Chrome on a phone. - The browser requests
`instagram.com`. - The request travels across the network to the
appropriate server. - The server processes the request and sends data
back. - The browser displays the result.

``` text
Client (phone / browser)  ── Request ──>  Server
Client (phone / browser)  <─ Response ──  Server
```

A server is a computer designed/configured to provide services to other
computers. It may have powerful CPU resources, substantial RAM, storage,
and network connectivity. A server does not have to be a special
physical machine; servers can also run as virtual machines or in the
cloud.

------------------------------------------------------------------------

## 2. IP Address

An **IP address (Internet Protocol address)** is a numerical address
used to identify an interface on an IP network so that data can be
routed to the right destination.

Think of it as a network address. It is not necessarily a permanent
address for a device: addresses can change, and one device can have
multiple network interfaces and addresses.

### IPv4

IPv4 addresses are 32 bits long and are usually written as four decimal
numbers (octets) separated by dots.

Example:

``` text
10.17.18.200
```

Each octet ranges from `0` to `255`, because 8 bits can represent 256
values.

``` text
IPv4 = 4 octets × 8 bits = 32 bits
```

### Private and public IP addresses

-   **Private IP address:** Used inside a private network, such as a
    home or office network. Private addresses are not directly routed
    across the public internet.
-   **Public IP address:** Used for addressing on the public internet.
    It is typically assigned by an internet service provider (ISP) or
    cloud/network provider.

Common private IPv4 ranges:

  Range           Address block
  --------------- ------------------------------------
  Private range   `10.0.0.0` -- `10.255.255.255`
  Private range   `172.16.0.0` -- `172.31.255.255`
  Private range   `192.168.0.0` -- `192.168.255.255`

The example `10.17.18.200` belongs to the private `10.0.0.0/8` range.

### Loopback address

`127.0.0.1` is a commonly used IPv4 loopback address. It refers to the
local machine itself and is often used when testing software locally.

------------------------------------------------------------------------

## 3. DNS (Domain Name System)

People find websites easier to remember by names such as:

``` text
instagram.com
```

Computers use IP addresses to communicate over IP networks. **DNS
translates domain names into the corresponding IP address records**,
allowing a client to find the destination for a domain name.

DNS is often described as the phonebook of the internet.

### Basic DNS lookup

1.  A user enters `instagram.com` in the browser.
2.  The client checks whether it already has a usable cached DNS answer.
3.  If needed, it asks a DNS resolver for the domain's records.
4.  The resolver finds the answer by consulting DNS infrastructure (and
    may use its own cache).
5.  The IP address is returned to the client.
6.  The client can then connect to the destination.

``` text
Browser
   |
   | asks for instagram.com
   v
DNS Resolver
   |
   | returns an IP address
   v
Browser connects to the destination
```

### DNS resolver example

`8.8.8.8` is a public DNS resolver operated by Google.

**Important:** DNS does not itself load the website. It helps the client
discover the address it needs to connect to.

------------------------------------------------------------------------

## 4. How Data Travels: Packets

When a client sends information over a network, the data is divided into
smaller units called **packets** (at the network layer, IP packets).

A useful analogy from the lecture is sending a book:

-   A large book can be thought of as being divided into smaller parts.
-   Those parts are sent across the network.
-   The receiving side uses the information carried with the data to
    handle and reassemble it appropriately.

Packets carry information needed for delivery, including source and
destination IP addresses. Other protocol layers add their own
information.

### Why use packets?

-   Networks can share capacity among many communications.
-   Large data can be transmitted in manageable pieces.
-   Different packets may take different routes through the network.
-   The receiving system can reassemble the data at the appropriate
    layer.

``` text
Original data
     |
     v
 [Packet 1] [Packet 2] [Packet 3]
     |
     v
   Network
     |
     v
Receiver processes and reassembles the data
```

**Note:** A web page is not necessarily sent as one packet. A page and
its resources may involve many requests and many packets.

------------------------------------------------------------------------

## 5. ISP and Network Connectivity

An **ISP (Internet Service Provider)** is a company or organization that
provides internet access to customers.

A home or phone connects to the ISP through an access network. The ISP
then connects that network to other networks and the wider internet.

Common ways to provide connectivity include:

-   **Fiber-optic:** Carries data as light through optical fibers. It
    can provide high bandwidth over long distances.
-   **Radio / wireless:** Uses radio waves, for example Wi-Fi or mobile
    networks, for wireless communication over an access link.
-   **Undersea fiber-optic cables:** Carry large amounts of
    international internet traffic between countries and continents.

The physical medium carries signals; networking protocols and equipment
move data between networks.

------------------------------------------------------------------------

## 6. What Is Inside a Server?

A server is a computer system that runs services for clients. Its
resources affect the work it can handle.

  ---------------------------------------------------------------------
  Component                          Purpose
  ---------------------------------- ----------------------------------
  CPU                                Executes instructions and performs
                                     computation

  RAM                                Temporarily stores data and
                                     programs currently in use

  Disk / Storage                     Stores operating systems,
                                     application files, and persistent
                                     data

  Network interface                  Sends and receives data over a
                                     network
  ---------------------------------------------------------------------

### CPU

The CPU (Central Processing Unit) executes program instructions. More or
faster CPU capacity can help with workloads that require substantial
computation, although performance also depends on software and other
resources.

### RAM

RAM is fast, temporary working memory. Running applications and active
data use RAM. Its contents are generally lost when power is removed.

### Disk / Storage

Storage keeps data persistently, such as files, databases, and
application data. Common storage technologies include SSDs and HDDs.

**Simple distinction:** - RAM: temporary working space - Disk: long-term
storage - CPU: executes instructions

------------------------------------------------------------------------

## 7. Putting It Together: Opening a Website

A simplified view of what happens when a user opens a website:

1.  The user enters a domain name in a browser.
2.  The browser/client obtains an IP address, often using DNS.
3.  The client establishes a network connection to the destination
    server.
4.  The browser sends an HTTP or HTTPS request.
5.  The server processes the request.
6.  The server sends a response.
7.  The browser processes the response and displays the page.

``` text
User
 |
 v
Browser / Client
 |
 | DNS lookup for domain
 v
DNS Resolver
 |
 | IP address
 v
Client ───── HTTP/HTTPS request ─────> Server
Client <──────── Response ──────────── Server
 |
 v
Web page displayed
```

This is a simplified model. Real-world communication can involve caches,
routers, firewalls, load balancers, CDNs, proxies, and multiple servers.

------------------------------------------------------------------------

## 8. Quick Revision

  Term           Meaning
  -------------- -----------------------------------------------------------
  Client         Requests data or a service
  Server         Processes requests and provides services
  IP address     Address used to identify a network interface
  IPv4           32-bit IP addressing format written as four octets
  Private IP     Address used within a private network
  Public IP      Address used on the public internet
  Loopback       Address used by a machine to refer to itself
  DNS            Resolves domain names to DNS records such as IP addresses
  DNS resolver   Receives DNS queries and finds/caches answers
  Packet         A unit of data carried across a network
  ISP            Provider of internet access
  Fiber-optic    Uses light to carry data through optical fiber
  CPU            Executes instructions
  RAM            Temporary working memory
  Disk           Persistent data storage

------------------------------------------------------------------------

## 9. Questions to Check Your Understanding

1.  What is the difference between a client and a server?
2.  Why do we use domain names if computers communicate using IP
    addresses?
3.  What is the difference between a private IP and a public IP?
4.  Why is `127.0.0.1` useful during development?
5.  What does DNS do, and what does it not do?
6.  Why is data sent in packets?
7.  What is the role of an ISP?
8.  How are CPU, RAM, and disk storage different?
9.  Can a server be a virtual machine rather than a physical computer?
10. What are the main steps between entering a website's domain name and
    seeing the page?
