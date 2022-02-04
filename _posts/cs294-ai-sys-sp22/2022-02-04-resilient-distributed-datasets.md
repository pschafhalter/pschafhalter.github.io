---
title: "Notes on \"Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing\""
layout: post
categories:
    - cs294-ai-sys-sp22
paper_authors:
    - Matei Zaharia
    - Mosharaf Chowdhury
    - Tathagata Das
    - Ankur Dave
    - Justin Ma
    - Murphy McCauley
    - Michael J. Franklin
    - Scott Shenker
    - Ion Stoica
year: 2012
venue: NSDI
---

## Paper Summary

Resilient Distributed Datasets (RDDs) are read-only, partitioned collections of records created by applying *transformations* (e.g. `map`, `filter`, `join`)
to raw data or other RDDs.
RDDs are generated lazily, and are typically only materialized
on-request, when the user invokes an *action*: an operation that
returns a value (e.g. `count`) or exports to a storage system.
To indicate that an RDD may be re-used, a user may invoke the `persist` operation, which ensures that, upon materialization,
the persisted RDD is stored in memory (spill to disk if insufficient RAM, can also indicate alternate storage strategies).

**RDDs are suited for batch applications**, such as PageRank, K-means clustering,
and logistic regression.
The authors implemented RDDs in a system called [Spark](https://spark.apache.org/),
and were able to show a 20-40x speedup over [Hadoop](https://hadoop.apache.org/),
the state-of-the-art big data processing system at the time.
This massive speedup is attributed to the ability to persist
RDDs in-memory, and Spark's efficient implementation.

RDDs also provide **fault tolerance** (lose an RDD because something broke)
by storing the lineage of transformations,
which allows Spark to recover RDDs by replaying transformations
instead of relying on a costly checkpointing procedure.
Because certain operations like `map` and `filter` can be performed
independently on partitions of an RDD (see *narrow dependency* in the paper),
Spark can leverage parallelism for fast and efficient computation/recovery of RDDs.
Similar to [MapReduce](https://research.google/pubs/pub62/),
Spark exploits this parallelism for *straggler mitigation* by
running backup copies of slow tasks.

## Strengths

+ RDDs demonstrate massive speedups (20-40x) over state-of-the-art systems.
+ Introduced Spark, an impactful and widely used data processing system that resulted in [Databricks](https://databricks.com/), a multi-billion dollar company.
+ General programming model that subsumes the capabilities of prior systems (MapReduce, Hadoop) for key applications.

## Weaknesses

- Arguably compares against weak strawmen.
  - Hadoop was a widely-used system with known performance issues.
  - Claims that MapReduce can only re-use data when writing to an external stable storage system, which raises a few questions:
    - How different is Spark from a modified MapReduce that uses an integrated in-memory storage system for intermediate results?
    - Is Spark's key contribution keeping data in-memory (by `persist`ing an RDD)? If so, is this sufficiently novel?
    - Should the evaluation compare against a modified MapReduce?
- Advocates for using lineages as a fault tolerance mechanism, even though Spark also implements checkpointing because recovering an RDD with a long lineage can take a long time.
- Claims coarse-grained transformations are contribution in order to compare against distributed shared memory; however, several other systems (DryadLINQ, MapReduce, materialized views in databases) provide a similar programming model.
- Modifies the interpreter, which impacts user experience.
  - PySpark (Spark's Python interface) also relies on a modified interpreter, which often lacks features that many Python programmers have come to expect.
  - Precludes running a Spark program using the standard `scala` or `python` programs bundled with most operating systems.

## Tips on Reading Systems Papers

1. **Carefully read the first few sections.** They not only introduce and motivate the problem, but also describe the key points of the solution.
   1. Often, after carefully reading these sections, I feel that I have a reasonable understanding of what the paper is about, and that I could participate in a high-level discussion.
   2. E.g., almost all of the paper summary is taken from §1 and §2.
2. **Understand what questions the remaining sections are trying to address.**
   1. The design sections (§3 and §4) provide answers to questions such as: *How do I use the system?* *What properties does the system exhibit?* *Why were certain design decisions made?*
   2. For the implementation section (§5), ask yourself *How do the key ideas of the paper translate into software?* *Is this a reasonable way of building the system?*
   3. Typically, a lot of work is put into evaluation (§6), and there can be a lot going on. Look at the plots, and ask yourself if they support the key claims, and provide suitable and sufficient comparisons. Often, the authors will include follow-up experiments to explain why the results look the way they do, and that performance improvements can be attributed to the key ideas of the paper.
      1. For example, I'm not convinced that distributed shared memory is a suitable comparison system, because several other systems, which seem like better points of comparison, already use coarse-grained transformations.
      2. Comparing against other systems in addition to Hadoop would strengthen the evaluation.
      3. §6.1 and Figure 9 describe follow-up experiments which explain why Spark outperforms Hadoop by 20x on key experiments.
