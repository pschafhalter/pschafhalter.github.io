---
title: "Notes on \"Understanding the Limitations of Causally and Totally Ordered Communication\""
date: 2020-07-24
categories:
    - OS Prelim
    - Distributed Systems
paper_authors:
    - Devid R. Cheriton
    - Dale Skeen
year: 1993
venue: ACM
---

Demonstrates limitations of causally and totally ordered communication support (CATOCS) in the context of reliable distributed systems.
Argues that CATOCS violates the end-to-end principle, and finds "limited merit and several potential problems" with CATOCS.
Suggests that the Lamport view of logical clocks are better applied at the state level instead of the communication level.

The criticisms fall into the following categories:

1. *Unrecognized causality.* CATOCS cannot enforce causal relationships at the semantic level. This commonly occurs due to an external communication channel (e.g. a shared DB).
   - Demonstrates how this can cause bugs (fire detection).
   - Argues that forcing all communication to be CATOCS is impractical and expensive.
   - Suggests adding prescriptive ordering information to messages which allows external communication and eliminates the need for CATOCS.
2. *Lack of serialization ability.* CATOCS cannot ensure serializable ordering between operations corresponding to groups of messages.
   - A consistent total ordering of accesses to data structure do not ensure the data structure's consistency.
   - Locking and optimistic concurrency control do ensure consistency and can be used without CATOCS.
   - Examines the case of a server rejecting a message.
     - In CATOCS, this corresponds to a failure and retry of the operation (expensive).
     - Alternatively, aborting the transaction is equivalent to message re-ordering which breaks message ordering guarantees, eliminating the need for CATOCS.
     - Other transaction mechanisms can guarantee atomicity.
3. *Unexpressed semantic ordering constraints.* For example, CATOCS cannot enforce causal memory, linearizability, or serializability.
4. *Lack of efficiency gain over state-level techniques.* Appears less efficient and less scalable than other techniques.
   1. CATOCS does not replace "prescriptive ordering" (e.g. timestamps) needed for "end-to-end semantics".
   2. Delays messages based on *false causality* -- messages that appear causal but are actually independent. The amount of false causality depends on application behavior and the number of processes in the group.
   3. Increases memory requirements by buffering unstable messages (scales poorly).
   4. Adding and checking ordering information slows message transmission and reception.

## CATOCS Limitations in Applications

1. Data dissemination applications -- generalized as order-preserving data caches.
   1. *Netnews*: Communication support for Usenet newsgroups.
      1. CATOCS: Requires a new causal group for each inquiry to deliver up-to-date information. This adds a large amount of overhead and does not scale.
      2. Non-CATOCS: Maintain order information in a local news database (semantic ordering), presenting the option of displaying out-of-order responses.
   2. *Trading Application*: disseminate trading information to trader workstations.
      1. CATOCS: Cannot enforce semantic ordering constraints, too expensive.
      2. Non-CATOCS: time-version security prices to preserve dependencies across the application.
2. Global predicate evaluation (e.g. distributed deadlock collection, distributed GC, orphan detection).
   1. General purpose detection protocols are cheaper than CATOCS-based protocols which require using CATOCS on every communication interaction.
   2. Run relatively infrequently, making the cost of CATOCS hard to justify.
   3. "wait-for" relationships can be detected incrementally, does not require strong ordering of events.
3. Transactional applications -- use optimistic transaction systems.
   1. CATOCS doesn't work with 2PC.
   2. Leader can order commit messages, eliminating the need for CATOCS ordering.
4. Replicated data -- optimized atomic transactions are better.
   1. Begin transaction/end transaction provides simple high-level interface, and can atomically group updates and abort groups of updates.
   2. Replicated data management systems can be optimized to match the behavior of CATOCS in the presence of failures.
   3. CATOCS provides limited asynchrony -- requires trading concurrency for asynchrony.
   4. Issues appear in the Deceit file system.
5. Replication.
   1. Exploit application state-specific techniques to ensure consistency of updates.
   2. Exploit application-specific tolerance of inconsistencies and anomalies to improve availability and performance.
6. Distributed real-time applications.
   1. CATOCS may miss semantic causal relationships.
   2. CATOCS does not support to execute groups of operations at the same real time.
   3. Message delays affect real-time correctness.

## Takeaways

CATOCS guarantees ordering on the communication level; however, this paper argues that this violates the end-to-end principle.
Protocol-level limitations may introduce bugs and result in worse performance.
These limitations manifest themselves in several applications explored at a high level.
While the authors analyze several database-motivated applications, there are no experiments in the paper.
CATOCS does provide strong guarantees on message ordering, but its limitations seem restrictive to other state-based techniques.