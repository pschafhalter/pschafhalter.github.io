---
title: "Notes on \"The Impact of Operating System Structure on Memory System Performance\""
layout: post_prelim
categories:
    - OS Prelim
    - OS Structure
paper_authors:
    - J. Bradley Chen
    - Brian N. Bershad
year: 1993
venue: SOSP
---

Compares a monolithic OS and a microkernel on memory performance and demonstrates memory-based performance issues with the microkernel-based OS.
Explains why OS performance is comparatively worse than application performance by examining OS architecture.
To compare the OSs, the paper evaluates several assertions about the impact of OS structure on performance in the context of memory by running a suite of benchmarks designed to test the assertions.
Advocates the use of MCP (mean cycles per instruction) as a metric because it captures impact on overall performance, as opposed to other metrics like cache miss percentage which may be high but cause negligible impacts on benchmark performance.

The paper also contributes to 90s discussion on kernel architecture;
it benchmarks Ultrix (a monolithic Unix-based OS) and Mach 3.0 (a Unix-based microkernel).
The benchmarks find that memory penalty for system instructions is 1-3x greater for Mach 3.0 than for Ultrix.
In addition, IPC overhead for Mach 3.0 was responsible for a small portion of the the overall system overhead in terms of instructions executed, suggesting that microkernel optimizations must consider sources of overhead beyond IPC such as MCPI.
However, Mach 3.0 consistently trailed Ultrix in performance which may point to why monolithic OSs like Linux dominated in subsequent decades.

## Assertions

Compiled from Table 1-1 §4, and §5.

1. **System and user locality.** The OS has less instruction and data locality than user programs. Therefore, OSs aren't getting faster as fast as user programs.
   - **True**, the OS has a greater percentage of cache misses.
   - Instruction locality is worse than data locality during system execution.
2. **System instruction locality.** System architecture is more dependent on instruction cache behavior than is user execution. Therefore, a balanced cache system for user programs may not be balanced for the system.
    - **Somewhat true.** True for programs with working sets small enough to fit in the cache. Not true for large programs which may encounter performance penalties similar to an OS (e.g. GCC).
    - System text shows less locality than system data.
3. **User/system competition.** Collisions between user and system references lead to significant performance degradation in the memory system (cache and TLB). Therefore, a split user/system cache could improve performance.
   - **Not true** for tested workloads. Separating into user and system caches did not significantly reduce miss rates relative to a smaller unified cache.
   - Large programs with frequent voluntary context switches (e.g. X11) have more severe performance penalties due to cache misses.
   - System TLB misses have much less impact on performance than cache misses.
4. **System self-interference.** Self-interference is a problem in system instruction reference streams. Therefore, increased cache associativity and/or the use of text placement tools could improve performance.
   - **Somewhat true**. Self-interference has a small relative impact when the cache is full.
   - *Self-inference* occurs when insufficient cache associativity associativity results in cache misses.
5. **Block operations.** System block memory operations are responsible for a large percentage of memory system reference costs. Therefore, programs that incur many block memory operations will run more slowly than expected.
   - **True**.
   - Block operations are mostly due to VM, file-system, and (for Mach 3.0 microkernel) IPC operations.
6. **Streaming writes.** Write buffers are less effective for system (as opposed to user) reference streams. Therefore, a write buffer adequate for user code may not be adequate for system code.
   - **True**.
7. **Page mapping strategy.** Virtual page mapping strategies can have significant impact on cache performance. Therefore, systems should support a flexible page mapping interface, and should avoid default strategies that are prone to pathological behavior.
   - **True**.
   - A deterministic strategy may perform poorly on direct-mapped caches when program reordering tools aren't used. In this situation, a random strategy may perform better.
