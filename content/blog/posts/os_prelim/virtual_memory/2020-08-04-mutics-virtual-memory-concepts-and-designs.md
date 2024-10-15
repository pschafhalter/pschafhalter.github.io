---
title: "Notes on \"The Multics Virtual Memory: Concepts and Design\""
layout: post_prelim
categories:
    - OS Prelim
    - Virtual Memory
paper_authors:
    - André Bensoussan
    - Robert C. Daley
year: 1972
venue: ACM
---

While ["Virtual Memory, Processes, and sharing in MULTICS"]({% post_url /os_prelim/virtual_memory/2020-08-03-vm-processes-and-sharing-in-multics %})
explored the details of how Multics' segmented virtual memory works, this paper focuses on how users interact with segments and how Multics implements virtual memory using the Supervisor.
The paper motivates Multics' approach to segmented memory by comparing against several other systems:

- [CTSS](https://en.wikipedia.org/wiki/Compatible_Time-Sharing_System)
  - Use of files requires an extra copy into a buffer whereas Multics operates on files directly.
  - File system checks whether user can access a file.
- Nonsegmented systems
  - Difficult to share memory among processes without giving ownership of shared memory to the kernel.
  - Not great because shared compilers must live in kernel space.
- Segmented systems
  - Issues when the number of files referenced by a program exceeds the number of segment descriptors available.
  - Multics provides a "sufficiently large" amount of segment descriptors.
  - Multics users operate on segments instead of files.

## Virtual Memory

Multics users access segments with a (symbolic name, index) pair where index corresponds to the number of words to index into the segment.
Upon first reference to a segment, the Multics dynamic linker maps the (symbolic name, offset) pair to a generalized address (segment number, index).
This seems to be stored in a table.
First reference is relatively expensive as Multics must search for the symbolic name.

Upon accessing and address, Multics checks a user's authorization with the following algorithm (page faults omitted for brevity):

```python
if descriptor.length() < segment_number:
    raise FAULT
segment_descriptor = descriptor[segment_number]
if segment_descriptor.missing_segment():
    raise MISSING_SEGMENT_FAULT
if segment_descriptor.segment_length() < index:
    raise FAULT
if segment_descriptor.access_rights_incompatible():
    raise FAULT
return lookup(segment_descriptor.absolute_core_address + index)
```

Note that each process has an associated descriptor segment whose location is stored in a register.
The descriptor segment stores metadata on other segments accessed by the program.

## Paging and Supervisor

Segments are implemented on top of demand paging.
Segments may span multiple pages which are loaded into memory upon a page fault.
Multics maintains a used list and a free list of page tables.
If possible, the Supervisor tries to allocated a page from the free list.
If the length of the free list is smaller than some minimum value, used pages are swapped to secondary storage and added to the free list via an LRU eviction policy.

The active segment table is part of the core memory is reserved for recording attributes needed by the page fault handler (e.g. segment map and segment length).
Segments are made active when they are inserted into the active segment table, and can be deactivated as well.
The paper describes the bookkeeping Multics performs so that the Supervisor runs correctly.

In addition, the supervisor performs operations on segment attributes, maps path names into segment numbers, and performs segment fault handling.

## More on Multics

[Multicians.org](https://multicians.org/) is a well-maintained resource documenting Multics from a technical and historical perspective.
