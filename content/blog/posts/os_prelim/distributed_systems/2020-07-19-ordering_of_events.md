---
title: "Notes on \"Time, Clocks, and the Ordering of Events in a Distributed System\""
layout: post_prelim
categories:
    - OS Prelim
    - Distributed Systems
paper_authors:
    - Leslie Lamport
year: 1978
venue: ACM
mathjax: true
---

Develops a partial ordering for events occurring in a distributed system based on logical time.
Demonstrates how to strengthen the partial ordering into one of many possible total orderings.
Finally, presents an algorithm to order events based on physical time by synchronizing clocks with a bounded error.

## Partial Ordering

Let $$\rightarrow$$ denote an ordering of events.
Intuitively, the ordering $$a \rightarrow b$$ means that it is possible for event $$a$$ to causally affect event $$b$$.
This relation $$a \rightarrow b$$ must satisfy the following conditions:

1. If $$a$$ and $$b$$ are events in the same process, and $$a$$ comes before $$b$$, then $$a \rightarrow b$$.
2. If $$a$$ is the sending of a message by one process and $$b$$ is the receipt of the same message by another process, then $$a \rightarrow b$$.
3. If $$a \rightarrow b$$ and $$b \rightarrow c$$ then $$a \rightarrow c$$.

Two distinct events are *concurrent* if $$a \nrightarrow b$$ and $$b \nrightarrow a$$.

## Logical Clocks

Abstractly, clocks assign a number to an event where the number is considered the time of the event.
More precisely, a clock is defined for each process where clock $$C_i \langle a \rangle$$ assigns a time to event $$a$$ in process $$P_i$$.
Logical clocks may not have a relation to physical time and can be implemented with counters.

*Clock Condition*: For any events $$a, b$$ if $$a \rightarrow b$$ then $$C \langle a \rangle < C \langle b \rangle$$.

The clock condition is satisfied if the following conditions hold:

1. If $$a$$ and $$b$$ are events in process $$P_i$$, and $$a$$ comes before $$b$$, then $$C_i \langle a \rangle < C_i \langle b \rangle$$.
   - Implies that there must be a *tick line* between any two events on a process line.
   - IR1: Each process $$P_i$$ increments $$C_i$$ between any two successive events.
2. If $$a$$ is the sending of a message by process $$P_i$$ and $$b$$ is the receipt of that message by process $$P_j$$, then $$C_i \langle a \rangle < C_j \langle b \rangle$$.
   - Every message line must cross a tick line.
   - IR2:
     1. If event $$a$$ is the sending of a message $$m$$ by process $$P_i$$, then $$m$$ contains a timestamp $$T_m = C_i \langle a \rangle$$.
     2. Upon receiving $$m$$, process $$P_j$$ sets $$C_j$$ greater than or equal to its present value and greater than $$T_m$$.

![Events separated by tick lines.](/data/pictures/posts/os_prelim/ordering_of_events.png)

## Total Ordering

Use the above system and break ties using an arbitrary total ordering of the processes.
Mathematically, $$ a \Rightarrow b$$ if and only if either:

1. $$C_i \langle a \rangle < C_j \langle b \rangle $$, or
2. $$C_i \langle a \rangle = C_j \langle b \rangle $$ and $$P_i \prec P_j$$.

Different choices of clocks and different orderings over the processes may yield different total orderings $$\Rightarrow$$; however, the partial ordering $$\rightarrow$$ is uniquely determined by the system of events.

## Avoiding Deadlock

Assume several processes communicate with each other and may request a resource.
Using total orderings, the paper presents an algorithm for allocating resources based on the total ordering of events.
Assume that messages sent from $$P_i$$ to $$P_j$$ are received in the same order as they are sent, and that every message is eventually received.
Each process maintains its own *request* queue and initially contains the message $$T_0:P_0$$ where $$P_0$$ is the process initially granted the resources and $$T_0$$ is less than the initial value of any clock.
The following rules govern the algorithm and form a single event each:

1. To request the resource, process $$P_i$$ sends the message $$T_m:P_i$$ *requests resource* to every other process, and puts that message on its request queue, where $$T_m$$ is the timestamp of the message.
2. When $$P_j$$ receives the message $$T_m:P_i$$ *requests resource*, it places the message on its request queue and sends a timestamped acknowledgment message to $$P_i$$.
3. To release the resource, process $$P_i$$ removes any $$T_m:P_i$$ *requests resource* from its request queue and sends a timestamped $$P_i$$ *releases resource* message to every other process.
4. When $$P_j$$ receives a $$P_i$$ *releases resource* message, it removes any $$T_m:P_i$$ *requests resource* message from its request queue.
5. $$P_i$$ is granted the resources when:
   1. There is a $$T_m:P_i$$ *requests resource* message in its request queue which is ordered before any other request in its queue by the relation $$\Rightarrow$$.
   2. $$P_i$$ has received a message from every other process timestamped later than $$T_m$$.

While the algorithm is correct, it scales poorly with the number of resources and the number of processes.
The paper also admits that there is no concept of fault tolerance since "failure is only meaningful in the context of physical time".
Similar problems are further examined in work on consistency in distributed databases.

## Physical Clocks

*Strong Clock Condition*: For any events $$a, b$$ in $$\varphi$$, if $$a \pmb{\rightarrow} b$$ then $$C \langle a \rangle < C \langle b \rangle$$.
$$\pmb{\rightarrow}$$ denotes "happened before" relation for $$\varphi$$. For example, $$\varphi$$ may be a set of "real" events in physical space-time and $$\pmb{\rightarrow}$$ may be the partial ordering of events defined by special relativity.

Using the strong clock condition and physical clocks, we can eliminate *anomalous behavior* which may occur when precedence information is based on messages external to the system (e.g. humans communicating).

To synchronize physical clocks, we make the following assumptions:

1. PC1: There exists a constant $$\kappa \ll 1$$ s.t. $$\forall i$$:  $$ \lvert dC_i(t) / dt -1 \rvert < \kappa $$.
2. PC2: $$\forall i$$: $$\lvert C_i(t) - C_j(t) \rvert < \epsilon$$.

Let $$\mu$$ be the shortest transmission time for interprocess messages (e.g. the shortest distance between processes divided by the speed of light).
To avoid anomalous behavior, $$\forall i, j, t$$: $$C_i(t + \mu) - C_j(t) > 0$$.
Applying the above assumptions, we find that the above inequality is true if the inequality
$$ \epsilon / (1 - \kappa) \leq \mu$$ holds, indicating that anomalous behavior is impossible.

Let $$\nu_m = t' - t$$ be the *total delay* for a message $$m$$ sent at time $$t$$ and received at time $$t'$$.
This delay is unknown to the receiving process, however some *minimum delay* $$ 0 \leq \mu_m \leq v_m$$ is known.
Then, $$\xi_m = \nu_m - \mu_m$$ is the *unpredictable delay* of the message.

Physical clock implementation works as follows:

1. IR1': For each $$i$$, if $$P_i$$ does not receive a message at physical time $$t$$, then $$C_i$$ is differentiable at $$t$$ and $$dC_i(t)/dt > 0$$.
2. IR2':
   1. If $$P_i$$ sends a message $$m$$ at physical time $$t$$, then $$m$$ contains a timestamp $$T_m = C_i(t)$$.
   2. Upon receiving $$m$$ at time $$t'$$, $$P_j$$ sets $$C_j(t') = \max \big( C_j(t'), T_m + \mu_m\big)$$.

This results in a theorem that bounds the length of time taken to synchronize clocks when the system first starts:

Theorem. Assume a strongly connected graph of processes with diameter $$d$$ which always obeys rules IR1' and IR2'.
Assume that for any message $$m$$, $$\mu_m \leq \mu$$ for some constant $$\mu$$, and that for all $$t \geq t_0$$:

1. PC1 holds.
2. There are constants $$\tau$$ and $$\xi$$ s.t. every $$\tau$$ seconds a message with an unpredictable delay less than $$\xi$$ is sent over every arc. Then PC2 is satisfied with $$\epsilon \approx d(2\kappa\tau + \xi)$$ for all $$t \geq t_0 + \tau d$$, where the approximations assume $$\mu + \xi \ll \tau$$.

## Takeaways

The paper presents a way to order events in a distributed system using logical time.
This method is then extended to work with physical time.
The paper proposes implementations, and the work is relevant to databases as well.
Bounding physical time remains an area of distributed systems research, as seen in Google's paper on [Spanner](https://dl.acm.org/doi/pdf/10.1145/2491245).
