---
title: "Notes on \"The Structuring of Systems Using Upcalls\""
date: 2020-07-11
aliases:
    - /os prelim/os structure/2020/07/11/upcalls.html
categories:
    - OS Prelim
    - OS Structure
paper_authors:
    - David D. Clark
year: 1985
venue: ACM
---

Introduces *upcalls*, which allow invoked services invoke the client (e.g. through handlers bound at runtime).
A key advantage of this design is that it reduces overheads from IPCs (e.g. buffering),
and simplifies OS abstractions through neater organization of parallel components and by avoiding the need for system-wide formats for messages.
This was considered controversial as it challenged a widely-held assumption that layers of abstraction should only be able to invoke lower layers of abstraction.
Upcalls are implemented in the prototype Swift OS.

The ideas were motivated by applications in networking, but are part of a larger theme of service-based architectures which might be found in microkernels.
Indeed, the paper is cited mostly by networking and kernel papers.

![Upcalls design](upcalls_design.png)

The paper proposes a programming model of consisting of tasks and modules (layers). Modules perform a service (e.g. transport).
They may consist of several functions that may run in parallel and shared state.
Tasks are a thread of execution. Each task may span several modules depending on whether other modules are invoked.

## Strengths

- Upcalls enable piggybacking which reduces the number of packets sent over a network.
- Single address space allows using shared memory which avoids copies between processes.
- Demonstrates a functioning alternative to the traditional approach to layering.

## Weaknesses

- Relies on garbage collection and high level languages for safe access to the single address space.
  - Relying on HLLs for safety and isolation is similar to the [Tock Embedded OS](https://sing.stanford.edu/site/publications/levy17-tock.pdf).
- Fault tolerance: failures in any layer may affect higher layers as well, which poses challenges in releasing resources and corruption of state. The authors suggest a few solutions:
  - Split state into client-specific state and state that describes how clients interact and share resources. This second kind of state must be made consistent and unlocked before any upcall is made. Layer-specific cleanup functions can release these resources safely.
  - Make tasks expendable. This works as long as tasks hold no locks for shared resources.
- Relies on programmer skill for properly handling recursive calls.
  - Propose a family of techniques for safe recursive calls. A potential missing technique is analyzing programs for loops in the call graphs.

## Example

The following example from the paper demonstrates how a remote login service may be implemented using upcalls. I've annotated the code to clearly show layers, state shared within a layer, invocations of other layers, upcalls, and interactions between tasks.

![Upcalls code](upcalls_code_annotated.png)

![Upcalls code diagram](upcalls_code_diagram.png)

## Takeaways

The thoughts around how services interact are still relevant in internet and distributed systems architectures today.
I'm reminded of [this interview with Dianne Hackborn on OpenBinder](https://www.osnews.com/story/13674/introduction-to-openbinder-and-interview-with-dianne-hackborn/)
which also manages IPC and enables rich OS services and applications.
Performance advantages of using shared memory remain, for example the distributed system [Ray](https://ray.io/) uses the Plasma Object Store as a type of distributed shared memory.
