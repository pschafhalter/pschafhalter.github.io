---
title: "Notes on \"Virtual Memory, Processes, and sharing in MULTICS\""
date: 2020-08-03
aliases:
    - /os prelim/virtual memory/2020/08/03/vm-processes-and-sharing-in-multics.html
categories:
    - OS Prelim
    - Virtual Memory
paper_authors:
    - Robert C. Daley
    - Jack B. Dennis
year: 1968
venue: ACM
---

Multics is designed to serve many users operating the system from remote terminals.
To effectively serve its users, Multics had 3 main goals:

1. Provide a large machine-independent virtual memory to simplify information transfer and make programs independent of the types of storage devices available.
2. Programming generality such as calling other procedures by symbolic name without knowledge of storage devices available.
3. Allow sharing procedures and data among authorized users.

## Segmented Virtual Memory

Every process has its own virtual memory consisting of 2^14 *segments* each containing up to 2^18 36-bit *words*.
A segment is a resizable array and requires certain access privileges to access.
Segments are treated as data (can read and write) or procedures (writing not allowed).
Procedure segments that are nonself-modifying are considered *pure procedures*.

Segments replace files; the *directory structure* associates at least one symbolic name with each segment.
Symbolic names are invariant over all processes.

![Virtual memory in a Multics process.](/data/pictures/posts/os_prelim/multics_directory_vm.png)

### Addressing

A *generalized address* consisting of segment number and word number is used to identify words in the address space.

![The generalized address.](/data/pictures/posts/os_prelim/multics_generalized_address.png)

A two-step hardware table look-up procedure is used to access memory.
First, the use the segment number to index into the descriptor segment (known via the *descriptor base register*) to find the location of the desired segment.
Then, the word number is used to index into the desired segment to access data.

In C,

```C
void* desired_segment_address = descriptor_segment[segment_number];
void* data_address = desired_segment_address + word_number;
```

![Addressing by generalized address.](/data/pictures/posts/os_prelim/multics_addressing.png)

Multics supports *paging* for segments by providing the illusion of contiguous memory even if a segment consists of noncontiguous blocks of memory.
Paging is desirable for large segments and is implemented via page tables stored in RAM.

### Intersegment Linking and Addressing

Users may want to share access to procedure and data information which require intersegment addressing.
Proper intersegment addressing has the following properties:

1. Procedure segments must be pure.
2. A process must be able to call a routine simply by invoking its symbolic name. As a consequence, invoked subroutines must be able to provide space for its data, reference any needed data object, and call on further routines that may be unknown to the caller.
3. Segments of procedure must be invariant to the recompilation of other segments. This means that identifiers for addresses inside segments that change on recompilation must not appear in the content of any other segment.

Due to (1), Multics provides a mechanism for making a segment *known* to a process (i.e. assigning a segment number upon the first use of a segment's symbolic name).
This requires linking as the the system cannot safely assign a unique segment number to shared segments, and looking up a segment by symbolic name is expensive.
Thus, each procedure has an associated linkage section.
Upon the first lookup of a symbolic name, the application traps and the system finds and sets the link data to the symbolic name's generalized address.

![Linkage.](/data/pictures/posts/os_prelim/multics_linkage.png)

## Structure of a Program

For generalized addressing and linking, several registers are included in each processor:

1. *Descriptor base register*: points to a process's descriptor segment's address.
2. *Procedure base register*: contains the segment number of the procedure being executed.
3. *Argument pointer*: points to a procedure's arguments.
4. *Base pointer*: points to the parent procedure's stack.
5. *Linkage pointer*: points to a process's linkage segment.
6. *Stack pointer*: points to a process's stack segment.

Calling and returning from procedures follows a fairly standard [calling convention](https://en.wikipedia.org/wiki/Calling_convention).

## Takeaways

Introduces segmented virtual memory, and explains a scheme to allow sharing data and procedures.
Eliminates the need for a file system, allowing a uniform, simple way to access memory.
Reliance on resizable segments as opposed to pages may allow for more efficient memory utilization.
While segmentation and paging are complimentary in Multics, ultimately modern systems use paged virtual memory.
This is likely due to performance overhead of paging and hardware support for virtual memory.
