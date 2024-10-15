---
title: "Notes on \"Why Aren't Operating Systems Getting Faster As Fast as Hardware\""
layout: post_prelim
categories:
    - OS Prelim
    - OS Structure
paper_authors:
    - John K. Ousterhout
year: 1990
venue: USENIX
---

Runs a suite of microbenchmarks on several OS and hardware configurations.
Finds that newer OSs don't speed up proportionally to the CPU.
While the newer OSs are generally absolutely faster than older OSs, the older OSs seem to be more efficient on their hardware.

The paper finds that memory and I/O are major bottlenecks, and that some OSs may have bugs.
The author concludes that speeding up memory performance will be "very difficult", and and predicts that the speed of memory will continue to be a bottleneck unless memory bandwidth improves dramatically.

To solve the bottleneck of synchronous disk I/Os, the paper suggests the following techniques to decouple file system performance from disk performance.

- Consider trading off reliability for speed by caching in volatile memory.
- Use a cache of non-volatile memory to reliably avoid disk I/Os.
- Use a log-structured file system to reduce disk I/O.

## Benchmarks Used

1. **Kernel Entry-Exit.** Repeatedly invokes `getpid`, and measures the average time per invocation. Newer OSs performed worse relative to their hardware.
2. **Context Switching.** Measures the cost of a context switch and small pipe reads and writes. Forks a child process and repeatedly passes 1 byte between child and parent using 2 pipes. Newer OSs performed worse relative to their hardware.
3. **Select.** Creates pipes, places data in some of those pipes, and calls `select` to determine how many pipes are readable. Newer commercial OSs generally performed well, but some newer research OSs performed slower than expected. Proposes that RISC/os's `select` kernel call has a bug causing a 10 ms delay.
4. **Block Copy.** Transfers large blocks of data from one area of memory to another. Doesn't stress the OS, but performance differences appear mainly due to cache organizations and memory bandwidths of different machines. Finds that performance relative to CPU drops with faster processors. Because RISC enables faster CPUs, memory-intensive applications will benefit less from RISC architectures compared to CPU-intensive applications.
5. **Read from File Cache.** Opens a large file and reads it repeatedly in 16 kB blocks. Measures the cost of entering the kernel and copying data from the kernel's file cache to a buffer in the benchmark's address space. Files were small enough to fit in the main-memory file cache, but large enough that the data copied was not present in a hardware cache. Reflects memory bandwidths from (4).
6. **Modified Andrew Benchmark.** Macro-benchmark which copies a directory hierarchy containing source code, `stat`-ing each file in the new hierarchy, reading the contents of every copied file, and compiling the code in the copied hierarchy. The benchmark was modified to always use the same compiler to avoid performance differences between compilers. Newer OSs generally performed worse relative to their hardware. Finds that the penalty for using NFS increases as hardware speeds up.
7. **Open-Close.** Repeatedly opens and closes a single file. Attempts to explain why the Sprite file system is faster than the others in (6). Finds that Sprite performs worse on this benchmark.
8. **Create-Delete.** Simulates creation, use, and deletion of a temporary file. Finds that Sprite performs better because short-lived files can be created, used, and deleted without writing data to disk, whereas the other OSs force data to disk. Finds a potential issue with mapped files in SunOS 4.0.3.

## Takeaways

A neat example of a paper that designs a suite of benchmarks to demonstrate a greater trend: I/O and memory are greater bottlenecks than CPU in OSs.
This paper reminds me of [An Analysis of Linux Scalability to Many Cores](https://pdos.csail.mit.edu/papers/linux:osdi10.pdf) which also designs a suite of benchmarks and similarly suggests performance/scalability improvements to Linux.
Despite being written 2 decades later, the paper finds that I/O remains a bottleneck in OSs.
