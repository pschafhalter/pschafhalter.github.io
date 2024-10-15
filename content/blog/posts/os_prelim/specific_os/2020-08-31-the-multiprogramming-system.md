---
title: "Notes on \"The Structure of the 'THE'-Multiprogramming System\""
layout: post_prelim
categories:
    - OS Prelim
    - Specific OSs
paper_authors:
    - Edsger W. Dijkstra
year: 1968
venue: Communications of the ACM
---

Built a multiprogramming system with the goal of smoothly processing a stream of user programs.
The system attempts to satisfy the following objectives:

1. Quick turnaround time for short programs.
2. Economic use of peripheral devices.
3. Automatic control of backing store (tape) combined with economic use of the CPU.
4. Applications which need the flexibility of a general purpose computer should be economically feasible.

Independent users cannot communicate; only configuration and a procedure library are shared.

## Mistakes made

1. Focused on a "perfect installation" rather than pathology (e.g. peripherals breaking down).
2. Built much of the system without considering how to debug it. Surprisingly, this mistake had few consequences.

Considers the main contribution to be the design of a refined multiprogramming system in which logical soundness can be proved a priori and its implementation can be tested.
Claims that the only bugs were trivial coding errors that were quickly located and fixed, and that the resulting system is guaranteed to be flawless as it will be provably correct.

## System Design

**Storage.**
Contributes a type of primitive virtual memory based on segments and pages.
Segments are the size of 1 page, but can be swapped between primary and secondary store.
In addition, segments use a separate identification mechanism allowing for more segments than the total number of pages available.

**Processor allocation.**
The system consists of an ensemble of sequential processes for user programs, peripherals, and other functions.
The "harmonious cooperation" of these processes is regulated by explicit mutual synchronization statements in which a process waits for another process.
Processors switch between processes.

### System Heirarchy
**Level 0** schedules processes on the processor.
This procedure is invoked by an interrupt from a clock, and ensures a level of fair sharing of the processor.

**Level 1** contains the segment controller which abstracts away the physical memory.

**Level 2** contains the message interpreter which processes interrupts caused by pressing a key on the keyboard.
The message interpreter is also responsible for printing characters to the console.
Above level 2, the system abstracts the console so that each process believes that it has sole access to the console.
This is done via synchronization primitives consisting of mutexes and semaphores, which Dijkstra invented and first appeared in the THE system.

Note the P and V operations on a semaphore come from Dutch passering ("passing") and vrijgave ("release"), and are meant to mirror terminology in railroad signals ([Wikipedia](https://en.wikipedia.org/wiki/Semaphore_%28programming%29#Operation_names)).

**Level 3** contains sequential processes which buffer input streams and unbuffer output streams.

**Level 4** contains user programs.

**Level 5** contains the operator (person using the machine).

## Building of the System

The system was built in levels.
Each level was tested before the next level was started, allowing developers to rely on the abstractions of the previous level.
Tests were implementation-specific -- I'm not personally not convinced of the proclaimed perfection of the system as test cases of a complicated system rarely catch every bug.
However, this perspective on the limitations of manual testing is 2020 hindsight (pun intended); the idea of testing each abstraction layer is quite valuable today and was certainly a big innovation in the 1960s.
Ironically, industry doubted whether any of the techniques used are applicable outside of a university.
While such attitudes unfortunately still exist, industry today seems much more amicable to cutting-edge work done at universities.