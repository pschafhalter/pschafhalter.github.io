---
title: "Notes on \"A Hardware Architecture for Implementing Protection Rings\""
date: 2020-08-12
aliases:
    - /os prelim/protection/security/2020/08/12/protection-rings.html
categories:
    - OS Prelim
    - Protection
    - Security
paper_authors:
    - Michael D. Schroeder
    - Jerome H. Saltzer
year: 1972
venue: ACM
mathjax: true
---

This paper discusses protection of segment-based virtual memory as found in Multics.
Read, write, and execute permissions are set based on the access level of the process and recorded in the segment descriptor words.
Flags corresponding to these permissions are checked by hardware upon each reference.

## Judging the Usefulness of a Memory Protection Scheme

1. *Functional capability*. Access control mechanisms should be able to meet user protection needs in an intuitive way (good interfaces).
2. *Economy*. Two points:
   1. The cost (complexity, resources) of specifying and enforcing access constraints should be so low that it's not a factor in application design.
   2. Cost should be proportional to the functional capability used.
3. *Simplicity*. If access control is easy to understand, then there is high confidence that it cannot be circumvented. Conversely, lack of simplicity implies lack of security.
4. *Programming generality* (choose good abstractions). Functions and modules should be transparently composable.

Since these criteria are difficult to simultaneously satisfy, try to maximize functional capability while meeting any other constraints.

## Protection in Multics

A fine-grained protection scheme (e.g. defined on a per-segment basis for each process) that meets the criteria of usefulness is hard; therefore, the authors propose the simpler ring protection scheme.

Intuitively, protection rings are similar to security clearance levels.
Multics defines a set of $$r$$ protection rings numbered $$0$$ to $$r - 1$$.
If $$m > n$$, then the access capabilities of ring $$m$$ are a subset of those in $$n$$.
Therefore, processes executing in ring $$0$$ have the greatest access privilege, $$r-1$$ have the least.
The range of rings over which some permission applies is called a *bracket* (as in read bracket, write bracket, execute bracket).
An implementation stores the top of each bracket of a segment in the segment descriptor word along with its corresponding flag.
Access is granted if the process's ring is in the bracket corresponding to the type of access.

Occasionally, the a process's ring needs to change (e.g. when calling a library function).
Moving to a lower ring is done at critical sections called "gates", which generally occur at calls to and returns from a procedure.
To prevent accidental transfer to and execution in a lower ring than necessary, use top of write bracket as bottom of execute bracket and the top of the read bracket as the bottom of the write bracket. The bottom of the read bracket is ring 0.
Processes can move to a higher ring at any time; this does not need to involve gates.

Protection rings have some unpleasantness when a process calls a procedure in a higher ring:

1. The procedure may not have permission to access provided arguments.
   1. Require that specified arguments must be accessible in the higher ring, compromising programming generality.
   2. Dynamically grant the called procedure's ring permissions to access arguments, compromising generality as segments containing arguments should not contain any other protected information.
   3. Copy arguments into segments accessible to the procedure, restricting performance as arguments can't be shared with parallel processes.
2. Must provide a gate for the downward return.

Due to these problems, upward calls and downward returns are handled by traps to the supervisor.
Procedures store the callee's ring number on the stack.
For downward returns, the kernel verifies the ring's correctness.

A weakness of ring protection is lack of protection between mutually suspicious processes.
While rings offer protection against processes in a higher ring, there is no protection for processes running in the same ring.

## Takeaways

In Multics, rings enabled the implementation of a layered supervisor where not all gates into supervisor rings are available to all processes.
Ring protection is modular as user processes can transparently access procedures which are then run in a lower ring.
However, such procedures must be well-implemented as vulnerabilities may allow a malicious process to gain greater privileges.

In addition, I have some concerns with ring protection from the perspective of least privilege.
Lower rings have all the permissions of higher rings, meaning that procedures running in lower rings may have more access than needed.
In addition, the lack of mutual protection means that a malicious process can interfere with other processes, including lower ring processes that call a procedure in a higher ring.

Ring protection is a start to memory protection and likely served Multics and the computational needs of the 1970s well.
However, the scheme's glaring flaws make it inadequate for modern computing environments.
