---
title: "Notes on \"Metascheduling for Continuous Media\""
layout: post_prelim
categories:
    - OS Prelim
    - Scheduling
paper_authors:
    - David P. Anderson
year: 1993
venue: ACM
mathjax: true
---

Proposes a scheduling framework for *continuous media* (e.g. audio, video streams) which can guarantee performance across multiple stages.
The paper approaches scheduling from a theoretical perspective and focuses mostly on guaranteeing latency, throughput, and bounding jitter.
The scheduler is capable of running real-time applications; however, the restrictive assumptions make it incompatible with OSs like Unix and standard internet protocols.
Professional audio, video-on-demand, and telephony are the targeted applications of the scheduler. I consider high-quality, professional audio with low latency requirements the only potential remaining application of the scheduler; non-real-time technology has progressed to adequately support the other applications.

```
// The scheduling API.
// Fails if it cannot provide sufficient resources.
reserve(input: maximum message size and rate 
        output:
            success/failure flag
            session ID
            maximum logical delay
            cost function 
            minimum actual delay
            minimum unbuffered actual delay)
relax(input: session ID, new maximum logical delay)
free(input:sessionID)
```

In the scheduling framework, applications provide the maximum message size and rate to request resources.
If accepted, a session is created for the resource that provides bounds on delay and a cost function.
These bounds can be relaxed to minimize cost.
Minimizing cost across resources is proven to be an NP-hard problem, but can be solved more easily if cost functions are (1) piecewise linear with a finite number of vertices, (2) monotonically decreasing, and (3) convex.
For multi-stage pipelines, the paper proposes an iterative algorithm that minimizes cost.

## Assumptions

- Resource capacity exceeds application requirements.
- Applications have delay bound requirements that are usually either very low or moderately high.
- Hosts have enough buffer space to store a few seconds of CM data.
- CM data types have a bounded data rate.
- All system components can make real-time guarantees.

## Reasoning about Jitter

The paper rigorously proves a mathematical framework for reasoning about jitter and delay, focusing on arrival times and *workahead*.
It defines a *linear bounded arrival process* (LBAP) as a message arrival process which depends on maximum message size $$M$$, maximum message rate $$R$$, and workahead limit $$W$$ (allows bursts that exceed the long-term data rate $$MR$$).
The paper proceeds to prove some mathematical bounds which are useful for limiting jitter and delay:

$$N_I(t_0, t_1)$$ is the number of messages arriving at interface $$I$$ on the time interval $$[t_0, t_1)$$:

$$ N_I(t_0, t_1) \leq R|t_1 - t_0| + W $$

The *workahead* $$w(t)$$ of an LBAP where $$ w(t) \leq W $$ is a measure of bursts:

$$ w(t) = max_{t_0 < t} \{0, N(t_0, t) - R|t - t_0| \} $$

Bounds on the arrivals during a time interval:

$$ N(t_1, t_2) \leq w(t_2) - w(t_1) + R | t_2 - t_1 | $$

*Logical arrival time* $$l(m_i)$$ is when message $$m_i$$ with actual arrival time $$ a_i $$ would arrive if workahead were not allowed:

$$ \begin{align*}
l(m_i) &= a_i + w(a_i) / R \\
&= \max(a_i, l(m_{i-1}) + 1 / R) \quad : \quad l(m_0) = a_0.
\end{align*} $$

Using these equations, the paper establishes proofs and bounds over sequences of sessions.

![Graph of workahead and arrival times.](/assets/pictures/posts/os_prelim/meta_scheduling_arrival_times.png)

## CPU scheduling

*Deadline-workahead scheduling* is the policy describing how processes are scheduled on a CPU. The term real-time indicates that the process has a session; if sessions are done properly, this could allow the scheduler to correctly run real-time processes. Processes are categorized as one of the following (ordered by priority):

1. *Critical processes*: real-time processes with an unprocessed message $$m$$ where $$m$$'s logical arrival time has passed $$l(m) \leq t$$.
   - Preemptively scheduled by earliest deadline.
2. *Interactive processes*: nonreal-time processes for which fast response time is important.
3. *Workahead processes*: real-time processes that have pending work, but are not critical.
4. *Background processes*.

## Takeaways

The mathematical approach to reasoning about jitter and cost-function based approach to allocating resources across multi-stage applications is interesting.
Specifically, protocols for negotiating data rates and resource allocation exist in [GStreamer](https://gstreamer.freedesktop.org/), although these are generally done online using backpressure.
There are definite applications to real-time scheduling, but the restrictive assumptions mean that this scheduling technique will likely only be implemented in specialized real-time systems.
