---
title: "Notes on \"Design and Implementation of the Sun Network Filesystem\""
layout: post_prelim
categories:
    - OS Prelim
    - File systems
paper_authors:
    - Russel Sandberg
    - David Goldberg
    - Steve Kielman
    - Dan Walsh
    - Bob Lyon
year: 1985
venue: USENIX
---

The Sun Network File System (NFS) uses a client/server model in which communication occurs via RPC.
Servers are stateless, enabling clients to implement fault tolerance by retrying requests.

Key contributions include the Virtual File System (VFS) which is a common interface to access different types of file systems.
Likewise, the vnode interface defines common operations that can be done on a file.

In addition, the paper introduces the concept of mounting file systems.
Upon mounting, the user is authenticated with the file system and the file systems is made accessible using paths.
The paper distinguishes between a hard mount and a soft mount.
A *hard mount* retries operations on a file system upon failure whereas a *soft mount* returns an error on failure.
Hard mounts may cause hanging processes but no data loss.
Soft mounts cause data loss and errors.

NFS attempts to emulate local file systems, but issues arise when accessing files as root and upon concurrent accesses by 2 different programs to the same file.

Because NFS is networked and relies on RPC, there is a significant performance penalty.
This is reduced with tricks such as caching and increasing packet size; however, performance remains an issue.