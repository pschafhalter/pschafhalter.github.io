---
title: "Notes on \"Survey of Virtual Machine Research\""
date: 2020-08-31
categories:
    - OS Prelim
    - Specific OSs
paper_authors:
    - Robert P. Goldberg
year: 1974
venue: IEEE Computer
---

Virtual Machines (VMs) simulate a machine that is identical to the real machine used.
VMs are faster than simulating other machines because much of the software can run directly on hardware without software interpretation.

## VM Principles

The need for VMs arose out of the privileged/non-privileged modes of execution on a machine.
Only the *privileged software nucleus* (kernel, supervisor) could run privileged functions.
User programs accessed privileged functions through supervisory calls (syscalls), and only 1 such nucleus could run at a time.
As a result, it's not possible to run other OSs, certain diagnostics programs, or any software that requires access to the bare machine interface.

![Virtual machine organization](/data/pictures/posts/os_prelim/vm_organization.png)

The Virtual Machine Monitor (VMM) transforms the single machine interface into the illusion of many, allowing many OSs to run concurrently.
In other words, a VM provides an efficient, isolated replica of the computer system's environment which can be multiplexed with other VMs on the same hardware.
Virtual storage also enables VMs which require more memory than available.

Much of the simulated software can run directly on hardware without intervention;
however, virtualized software that run in privileged mode must be intercepted and virtualized by the VMM.
I/O instructions are usually privileged and must be virtualized.
This adds some usually tolerable overhead, and allows simulating I/O devices or translating I/O requests to another device.

### Arguments for Virtualizable Architectures

Such architectures provide features to directly support VMs.

1. *System hygiene*. There is no intrinsic reason why VM support must be based on the clumsy trap-and-simulation approach.
2. *Software simplicity*. Virtualizable architectures make VMMs smaller and simpler, resulting in more reliable and secure VMs.
3. *System performance*. Machines designed to support VMs should operate more efficiently.

### The Hardware Virtualizer

The hardware virtualizer provides virtualization support in hardware.
Its theory claims that the key issue involved in VMs is the relationship between the virtual and real machine's resources.
An f-map maps sets of virtual resources to real resources, but remains invisible to all VM software.
The hardware and firmware handle VM faults which are invoked on an f-map violation.
Any other structures (e.g. privileged/non-privileged modes) are independent of virtualization and behave as if executing on a real machine.

## Performance

Several properties of VMs create overhead:

1. Maintaining the status of the virtual processor (e.g. integrity of visible registers, status bits, reserved memory locations).
2. Support of privileged instructions.
3. Support of paging within VMs (software transforms paged address in a VM to an address in the VM to a real memory address).
4. Console functions.
5. Other stuff (e.g. I/O interrupts, virtual timers and clocks).

These can be improved by technology such as the Hardware Virtualizer, or optimizations to reduce the cost of I/O and simulating privileged instructions; however, other solutions exist.
Some overheads such as OS management of virtual resources are unique to a VM and difficult to reconcile in a transparent way (e.g. disk optimization, paging in a VM).

### Improving Performance through Policy

Real system resources (e.g. CPU time, I/O, memory) can be allocated to guarantee a certain performance level for a preferred VM.
Assigning virtual addresses to identical real addresses can eliminate overhead while maintaining some degree of isolation because page tables still establish and limit addressability.
In addition, allowing a very large virtual memory would increase performance because the benefit of reducing expensive virtual I/O operations outweights the cost of increased paging.
In addition, *streamlining* can result in more efficient VMM support by taking advantage of prior knowledge that certain expensive features (e.g. real-time interval timers) won't be used in the VM.

### Compromising the Interface

The VMM could provide optimized supervisor calls to VMs in order to reduce overhead.
However, this results in an impure interface as the software must detect whether it's running in a VM in order to use these calls.
In addition, providing optimized supervisor calls may limit compatibility with other VMMs.

Purists claim that impure VMs suffer from the same disadvantages as the non-standard extended machine interfaces on conventional OSs.
Impurists note performance improvements and observe that the impure approach results in clear, hierarchically organized OSs.

## Use Cases for VMs

**Installation management**.
Developers can write software once which installs and runs on several different systems.
In addition, VMs can be used to incrementally migrate users to new releases by simulating old systems.
VMs can also retrofit old OSs with new features.
For example, the VMM can transform a new device into a virtual device that is known to the OS.

**Privileged software development and testing**.
Debugging tools can be reused to develop different systems.
Computer networks can also be debugged and tested using networks of VMs.

**Education.**
VMs allows for OSs in which students can modify I/O device handlers, modify page replacement algorithms, develop computer networks, and gain hands-on experience with other tasks that involve interfacing with bare hardware.

**Software reliability.**
Due to the high degree of isolation, errors in one VM's OS will not affect another VM's OS.
A key insight is that the VMM is likely to be correct since it's a small program with limited functionality that can be checked.

**Data security.**
VM isolation offers better security over running programs in the same OS.

## Takeaways

Today, VMs and virtualization technologies are widely used for a variety of reasons.
Docker containers enable portability and isolation, and are commonly used to share programs and develop in a standardized environment.
Cloud providers use VMs to sell compute and multiplex hardware amongst users.
Security analysts can safely study malware inside VMs.
Other widespread VM use cases are compatibility-related which enable users to run Windows programs on Linux and vice versa.

Due to the widespread use, performance is still a major issue.
In addition, security has become a bigger concern as mutually distrustful entities run on the same clouds.
Brilliant attacks like [Meltdown and Spectre](https://meltdownattack.com/) demonstrate that there is still plenty of work to be done on virtualization.