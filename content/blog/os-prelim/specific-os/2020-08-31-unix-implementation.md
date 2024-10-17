---
title: "Notes on \"Unix Implementation\""
date: 2020-08-31
categories:
    - OS Prelim
    - Specific OSs
paper_authors:
    - Ken Thompson
year: 1978
venue: The Bell System Technical Journal 
---

The Unix kernel is the only piece of Unix code that cannot be substituted by a user; therefore, it seeks to make as few real decisions as possible.
Ideally, there is only one way to do one thing, and that way should be the least-common divisor of all the options that may have been provided.
Practically, efficiency is preferred over simplicity; however, complex algorithms are only used if their complexity can be localized.

## Processes

Users execute user processes.
These may invoke syscalls, upon which a context switch to a system process occurs.
These processes are isolated, and have separate stacks for protection.

Programs execute from a shared read-only text segment.
Text segments are tracked in the system by a text table, which also tracks the associated secondary memory location and the number of processes using the segment.
The entry and associated memory is freed when the number of processes using the segment is 0.

User processes have strictly private read-write data in the data segment.
The stack and the heap represent the 2 growing bounds of the data segment.
In addition, a system data segment contains system data about the process (e.g. metadata, open file descriptors).
The system data segment is protected from the user process.

The process table contains 1 entry per process, and stores data needed when  the process is not active (e.g. name, location of segments, scheduling information).

![Unix process control data structure](/data/pictures/posts/os_prelim/unix_process_control_data_structure.png)

Processes are created using `fork`.
Copies of all writeable data segments are made for the child process.
Files that were open before remain open and are shared after the `fork`.
Processes are informed whether they are the child or the parent.
Parents may `wait` for or terminate a child.

A process may `exec` a file, which results in exchanging current text and data segments for new text and data segments.
Doing so does not change the process; only the program running changes.
Files before running `exec` remain open.

### Swapping

Major data associated with a process can be swapped to and from secondary memory.
The user data segment and system data segment are kept in contiguous primary memory.
When these segments grow, a new piece of memory is allocated and the contents are copied over from the old segment.
The old segment is freed and relevant tables are updated.

The swapping process runs in kernel space and swaps processes into and out of primary memory.
It examines the process table for processes that are swapped out and ready to run.
If not enough memory is available, processes in primary memory are swapped out (this can result in thrashing).

To mitigate thrashing, the swapping process swaps in the process that has been swapped out the longest adjusted by some size penalty.
Processes waiting for slow events are swapped out first, ordered by age in primary memory and again adjusted by some size penalty.

### Synchronization and Scheduling

Synchronization is achieved by having processes wait for events which are represented by arbitary integers.
A process waiting on an event is woken up once that event is signalled.
An advantage is that events require no memory, unlike Dijkstra's semaphores.

A disadvantage is lack of coordination.
Processes waiting on additional memory all awake simultaneously upon being signalled and compete.
A race condition occurs in the time between a process waiting on an event and the process entering the wait state.
Signals from other processes are handled via the kernel; however, hardware interrupts require special care.
These issues pose problems when Unix is adapted to multi-processor machines.

Processes are prioritized based on the code issuing the wait on an event, which roughly corresponds to the response time of the event.
System processes always have higher priority than user processes.
User-process priorities are assigned based on the recent ratio of the amount of compute time to real time consumed by the process, ensuring that priority drops and rises depending on the amount of CPU used.
The scheduler selects the highest priority process to run.
High-priority processes waking up preempt lower priority processes.

## I/O

A configuration table connects system code and device drivers, enabling rapid implementation of new drivers.
There are 2 separate I/O systems.

## Block I/O System

The block I/O system emulates randomly addressed, secondary memory blocks that are uniformly addressed for structured I/O.
The system maintains a list of buffers which are assigned to devices.
These buffers act as a LRU data caches on reads and write-back caches on writes, reducing physical I/O.

Unfortunately, error handling and meaningful user error handling become difficult due to asynchronous nature of the block I/O system.
In addition, writes may be lost upon crashes since writes are delayed (flushing can mitigate this).
Finally, associativity in buffers can alter the physical I/O sequence from the logical I/O sequence, resulting in inconsistent data structures on disk.

## Character I/O System

All non-block I/O devices use the character I/O system (unstructured I/O).
The implementation is driver-specific.
Disk drivers and character lists (e.g. the terminal) both have character I/O interfaces.

## File System

Files are arrays of bytes which can be attached once more at any place in a hierarchy of directories.
Directories are files that users cannot write.

The file system is a disk data structure accessed through the block I/O system.
The first block in the FS is used for booting procedures.
The second block contains a *super-block* which contains metadata (e.g. size of the disk).
Next comes the i-list, a list of file definitions.
Each file definition consists of an i-node.
The offset of an i-node in the i-list is the i-number.
The combination of device name and i-number uniquely names a particular file.
After the i-list come free storage blocks which are used for the contents of files.

Free disk space is maintained by a linked list of available list blocks where each block contains the address of the next block in the chain.
The remaining space contains addresses of up to 50 other free blocks, allowing 1 system operation to obtain 50 free blocks and a pointer to more.

Allocation occurs in fixed-size blocks, avoiding the need for garbage collection or compaction.
As disk space becomes dispersed, latency increases which can be fixed by compacting disk space.

An i-node consists of 13 disk addresses.
The first 10 point directly to the first 10 blocks of the file.
The others point to blocks containing the addresses of the next 128 blocks in the file.
This enables file sizes up to approximately 1 GB.

Directories are accessed just like files, and contain entires consisting of a name and i-number.
These map to child files and directories.
The root resides at a known i-number.
Because files can be linked at arbitrary points in the directory graph, accounting for space is difficult.
The paper suggests restricting the directory structure to a tree.

### Using the Unix FS

The Unix FS allows easy creation, removal, random accessing, and space allocation, and is generally efficient.

I-nodes and i-numbers are abstracted away from the user.
Instead, the user accesses the FS through path names in the directory tree.
The system converts paths to i-nodes by sequentially searching directories for the next directory/file name.
Primitives such as `open`, `create`, `read`, `write`, `seek`, and `close` allow user access to the FS.
Open files are stored in the system data segment of the process.
Associated with each open file is a current I/O pointer which functions as a byte offset of the next read/write operation on the file.
Read/write requests are treated have an implied seek, providing the illusion that files are sequential.
Random I/O is achieved by setting the I/O pointer before reads/writes.

Due to file sharing, related processes should share a common I/O pointer, whereas independent processes should have separate I/O pointers.
Thus, I/O pointers are shared in the open file table.
Forked processes share the same open file and share an entry in the open file table, whereas separate opens result in distinct entries.

A `pipe` is an unnamed FIFO file, consisting of implied seeks before each read or write.
Pipes include checks and synchronization to prevent the writer from outproducing the reader and the reader from overtaking the writer.

File systems are mounted in the directory, and logically extend the hierarchy.
A mount table contains pairs of designated leaf i-nodes and block devices.
When accessing a mounted FS, the leaf i-node is replaced with the root i-node of the block device.

## Conclusion

The Unix kernel may be viewed as an I/O multiplexer rather than a complete OS.
Unix deems many features unnecessary to the kernel (e.g. support for file formats), and these are handled by user programs.
From this perspective, the Unix kernel achieves simplicity and does its task quite well, sparking great advance in the field of OS.
There is also a Unix-Multics connection; Thompson credits Multics for the idea of system code with general user primitives.
