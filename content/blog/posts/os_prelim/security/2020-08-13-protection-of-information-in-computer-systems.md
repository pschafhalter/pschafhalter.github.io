---
title: "Notes on \"The Protection of Information in Computer Systems\""
date: 2020-08-13
categories:
    - OS Prelim
    - Protection
    - Security
paper_authors:
    - Jerome H. Saltzer
    - Michael D. Schroeder
year: 1975
venue: IEEE
---

Part survey paper, part experience paper, part Multics design paper.
The authors discuss mid-1970s state-of-the-art techniques for OS-level protection between processes and users, and tradeoffs that arise between security and usability in the context of sharing.

## Types of Security Violations

1. Unauthorized information release.
2. Unauthorized information modification.
3. Unauthorized denial of use.

## Types of Protection Schemes

1. *Unprotected systems* such as DOS for the IBM System 370.
2. *All-or-nothing systems*.
   - Have user isolation and some public information (e.g. libraries) that are shared among all users.
3. *Controlled sharing* such as rwx permissions on a per-user basis for files.
   - Explicit control over who may access which data item.
4. *User-programmed sharing controls* using user-defined protected objects and subsystems that enable programmable access control.
5. *Putting strings on information* such as adding a "Top Secret" watermark to a document.
   - Enables some protection after data is released.

*Dynamics of use* refers to how access rules are established and changed.
This idea concerns whether a user can gain access to some information, and what happens when a user's permissions are revoked while the user accesses the information.

## Design Principles for Protection Mechanisms

1. *Economy of mechanism* a.k.a. keep it simple, stupid.
2. *Fail-safe defaults*. Deny access by default, in line with the principle of least privilege.
3. *Complete mediation*. Every access to every object must be checked for authority.
4. *Open design* a.k.a. do **not** rely on security through obscurity.
5. *Separation of privilege*. For example, mechanisms unlocked with 2 keys are more robust, such as security deposit boxes or firing nuclear weapons.
   - Similar to multi-factor authentication common in modern internet accounts.
6. *Least privilege*. Every program and user should operate using the least set of privileges necessary to perform their job.
   - Limits damage from accidents and errors such as unwanted interactions between privileged programs.
   - Reduces the scope of auditing upon misuse of privilege.
   - "Need-to-know" in the military.
7. *Least common mechanism*. Minimize the amount of shared mechanisms, especially those that all users depend on.
   - Shared mechanisms represent potential information paths between users and may compromise security.
   - Mechanisms serving all users (e.g. the kernel) should be certified to the satisfaction of every user.
   - Prefer implementing new functions in libraries rather than the kernel.
8. *Psychological acceptability*. Interfaces should be easy to ensure users will correctly apply protection mechanisms. This also helps limit mistakes.

In addition, the authors claim that 2 additional design principles apply imperfectly to computer systems:

1. *Work factor*. Compare the cost of circumventing the mechanisms with the resources of a potential attacker. In modern terms, consider the threat model and remember that security is economics.
2. *Compromise recording*. Recording that a compromise ocurred can help prevent loss. Modern equivalents are [honeypots](https://en.wikipedia.org/wiki/Honeypot_(computing)), logs, and monitoring algorithms.

## Examples of Security Mechanisms

1. *Isolated virtual machines* which place bounds on a process's accessible memory.
   - Supervisor stores a table of permission descriptors, one for each process.
   - The descriptor contains bounds on accessible memory, and is loaded into a read-only register by the supervisor.
   - Memory accesses are validated by hardware.
   - Supervisor is protected by the same techniques that provide isolation between processes.
2. *Authentication mechanisms* which verify a user's claimed identity.
   - Passwords for login (don't store passwords in plaintext; remember to hash and salt).
     - Issues in choice of password: may be brute-forced or vulnerable to dictionary attacks if too simple. Randomly generated passwords may be hard to remember.
     - Can be intercepted, e.g. if websites don't use SSL or by phishing attacks.
   - Hardware authentication, e.g. YubiKeys or fingerprint readers.
     - Translated into bits which can be intercepted (cryptography makes this less of a concern).
     - Must be physically secured.
   - Both passwords and hardware authentication are vulnerable to man-in-the-middle attacks and phishing.
3. *Shared information*. Two types of implementations:
   - *List-oriented* where the guard holds a list of identifiers for authorized users and each user carries a unique unforgeable identifier (e.g. driver's license).
     - Slower as guard must look up identifier.
   - *Ticket-oriented* where the guard holds the description of a single identifier and each user has a collection of unforgeable identifiers called "tickets" (analogous to a key for a lock).
     - Fast because guard simply compares identifier to description.
   - Complete isolation if only 1 user can access any object.
   - For shared information, place the object in memory. Using the descriptor, we can ensure proper access to the shared object. This has the following implications:
     1. If `P1` writes to a shared object, it may disrupt the work of `P2`.
        - Can restrict access methods by extending descriptor to include accessing permission, or attach permissions directly to shared object.
     2. A shared procedure should avoid modifying itself. This could be solved by attaching temporary storage allocated by the caller (perhaps a stack?).
     3. The scheme must be expanded and generalized so that more than one program/database can be shared.
        - Can increase the number of descriptor registers and modifying the supervisor.
        - Generalize as *capability systems* (ticket-oriented) or *access control list systems* (list-oriented).
     4. The supervisor must be informed about which principals are authorized to use a shared routine.

## Security in Multics

A *principal* is the entity accountable for the activities of a virtual processor.
This is the idea of multiple accounts with different privileges for the same person.
For example, I have access to both root and my personal account on my laptop.

Multics offers protection on segmented virtual memory.
The authors suggest cross-user sharing/communication protocols.
Solving the problems of revocation (e.g. use indirection to point to an access controller which guards an object), propagation, and review of access posed big challenges.
An access controller inserts an extra authorization check at the last point possible, which helps achieve revocation.
Access controllers and access control lists are the two main security designs used, according to the authors.

## Groups

Protection groups are principles that can be used by more than one user.
They have certain privileges, and any user in that group gains the group's privileges.
Groups are an abstraction for when listing every user might be inconvenient/inefficient (e.g. the list of allowed users is long or changes frequently).
Groups still exist in [Linux](https://wiki.archlinux.org/index.php/Users_and_groups).

## Changing Access Control Lists

The authors suggest 2 ways of managing the authority to change access control lists:

1. *Self control*. Add bit that controls whether a user can modify the access control list containing the permission bits.
   - Temporary access is problematic. Bug where no one has access is also problematic.
2. *Hierarchical control*. Each object has an associated access controller. Upon creating a new object, specify an existing parent access controller. Permission to modify an access controller implies permission to modify all child access controllers.
   - No checks and balances on abuse of higher level authority.
   - Propose a *prescript* scheme to regulate use of authority with an external policy (e.g. buddy system, require approval, delay changes).

The issue of nondiscretionary controls for complex programs (e.g. user can only share among a department) arises.
One option is to confine programs to prevent unwanted access to data.
Another option is to simply revoke permissions to modify access control lists.

Unfortunately, allowing both discretionary and nondiscretionary controls is hard to achieve.
One option is to divide access on the system into several totally isolated compartments and managing access to each.
The *high watermark strategy* proposed by Weissman automatically labels any written object with the compartment labels needed to permit writing.
Bell and LaPadula simplify this by treating attempts to write into objects with too few compartment labels as errors.
Both of these approaches recognize that writing into objects that don't have the necessary compartment labels represents potential declassification of sensitive information.
Declassification should only occur on human judgement.

## Protected Subsystems

A *protected subsystem* is collection of program and data segments that is encapsulated so other executing programs cannot read or write to these segments, but can call designated entry points.
Protected subsystems achieve isolation, and are easily composed.
The supervisor is an example of a protected subsystem.

## Takeaways

The design principles stand the test of time and are still relevant today.
Briefly mentioned cryptography which plays a large role in modern security (SSL, blockchain, processing encrypted data).
In addition, the threat model has evolved.
Network-level threats are more prevalent than malicious users on shared hardware.
As computers become more accessible, there are both trends towards increased sharing and decreased sharing of hardware.
Smartphones are often only have 1 user, whereas cloud providers share compute among mutually distrustful entities where isolation is [difficult](https://meltdownattack.com/) but extremely important.
