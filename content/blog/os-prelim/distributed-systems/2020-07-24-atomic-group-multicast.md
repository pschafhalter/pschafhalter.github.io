---
title: "Notes on \"Lightweight Causal and Atomic Group Multicast\""
date: 2020-07-24
aliases:
    - /os prelim/distributed systems/2020/07/24/atomic-group-multicast.html
categories:
    - OS Prelim
    - Distributed Systems
paper_authors:
    - Kenneth Birman
    - André Schiper
    - Pat Stephenson
year: 1991
venue: ACM
---

Introduces CBCAST which implements fault-tolerant causally ordered message delivery.
CBCAST is extended to ABCAST for total ordering of messages.

In this programming model, processes are organized in groups which keep in sync via multicast.
Multicast is *atomic*, so broadcasting a message to all processes in the group appears as a single event.
Causality is preserved within groups; communication across groups may not be causally ordered.

Process groups can be organized in different ways:

1. Processes in a *peer group* cooperate in order to complete a task.
2. In a *client/server group*, a peer group of servers receives requests from a potentially large set of clients.
3. In a *diffusion group*, clients passively receive messages from servers, which multicast to all clients and servers.
4. A *hierarchical group*, is a tree-structured set of groups where the *root group* maps connections to appropriate subgroups.

![Types of process groups.](/data/pictures/posts/os_prelim/atomic_group_multicast_process_groups.png)

The paper describes the implementation of ABCAST and CBCAST, along with proofs and caveats.
The implementation relies on [vector clocks](https://en.wikipedia.org/wiki/Vector_clock) which are reset during changes to the group (e.g. failures).
[These notes](http://cs.brown.edu/courses/cs138/s17/lectures/23vsync-notes.pdf) from Thomas Doeppner contain a fantastic description of the protocols.