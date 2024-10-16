---
title: "Notes on \"Operating System Support for Database Management\""
date: 2020-08-03
categories:
    - OS Prelim
    - Transactions
    - Recovery
    - Fault Tolerance
paper_authors:
    - Michael Stonebreaker
year: 1981
venue: ACM
---

This article examines how OS design limits DBMS performance, and how changes in OS design may improve DBMS performance in the context of Unix and [INGRES](https://en.wikipedia.org/wiki/Ingres_(database)).
In particular, Stonebreaker remarks that DBMS often implement their own versions of OS data structures in user space because the services provided by the OS are not quite right, suggesting that either more control over the hardware or more flexible OS structures are necessary.
The proposed solution is better OS support for DBMS in order to avoid the duplication of OS structures in DBMS.

## Issues with OS support for DBMS

1. *Buffer Pool Management*: the fixed-size Unix buffer pool acts as a main memory LRU cache for the file system in order to achieve good performance for *locality of reference*.
   - Fetching a block from the OS buffer pool manager adds overhead due to syscall-induced context switch.
   - Applications should be able to advise the eviction policy (likely in the [page cache](https://en.wikipedia.org/wiki/Page_cache)) to optimize performance. 4 different DBMS access patterns are described where 1 and 3 should *toss (evict) immediately*:
     1. Sequential access to blocks which will not be rereferenced.
     2. Sequential access to blocks which will be cyclically rereferenced.
     3. Random access to blocks which will not be referenced.
     4. Random access to blocks which may be rereferenced.
   - Prefetch -- DBMS like INGRES know exactly which block to access next.
   - Force an intentions list and commit flag to disk in the correct order.
     - Unclear how flushing is insufficient.
   - DBMS work around this currently by implementing caches in user-space.
2. *File System*: the Unix file system treats files as character array objects, whereas DBMS prefer a record management system inside the OS.
   - DBMS often perform sequential access which is inefficient when the file system scatters a file's blocks across a disk.
   - Duplication in tree structures:
     1. A file's blocks are kept track of in a tree (inodes).
     2. File systems are exposed to the user as hierarchies of folders.
     3. DBMS indexing using trees (e.g. B-tree).
3. *Scheduling, Process Management, and Interprocess Communication*: OS design (e.g. Unix pipes) favors 1 process per user over a client/server DBMS model.
   - Context switches are expensive and happen often due to I/O.
   - Scheduler may preempt process holding a lock during a DBMS critical section, blocking other processes.
   - Server model must reimplement scheduling/multitasking/messaging, and trades context switching for messages which are also expensive.
   - Allow for favored users whose processes are not preempted.
4. *Consistency Control*: little OS support for fine-grained locks (e.g. on pages or records) or transaction crash recovery.
   - User space buffer manager must ensure that blocks are flushed and commit delivered to OS, duplicating OS knowledge of a transaction.
   - User-space buffer manager and OS must maintain an intentions list to prevent non-deterministic transactions.
5. *Paged Virtual Memory*.
   - For large files, page tables may not fit in memory so some I/O operations induce 2 page faults.
     - Avoid 2nd page fault by loading file control block into main memory.
     - Or bind chunks of file into address space at the cost of significant overhead.
