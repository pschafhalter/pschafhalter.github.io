---
title: "D3: A Dynamic Deadline-Driven Approach for Building Autonomous Vehicles"
date: 2022-04-05
url: /d3
aliases:
  - /erdos
layout: project
params:
  authors:
    - name: Ionel Gog
      url: https://www.ionelgog.org/
    - name: Sukrit Kalra
      url: https://sukritkalra.github.io/
    - name: Peter Schafhalter
      url: /
    - name: Joseph E. Gonzalez
      url: https://people.eecs.berkeley.edu/~jegonzal/
    - name: Ion Stoica
      url: https://people.eecs.berkeley.edu/~istoica/
  organizations:
    - name: UC Berkeley
  links:
    - name: Paper
      url: /papers/2022-eurosys-d3.pdf
    - name: Code
      url: https://github.com/erdos-project/erdos/
    - name: Docs | Rust
      url: https://docs.rs/erdos/
    - name: Docs | Python
      url: https://erdos.readthedocs.io/
---

### Adjust response times and handle missed deadlines to maximize application-wide accuracy.

![D3 Design](d3-design.png "D3 Design")

## Overview

## Abstract

> Autonomous vehicles (AVs) must drive across a variety of challenging
> environments that impose continuously-varying deadlines and runtime-accuracy
> tradeoffs on their software pipelines. A deadline-driven execution of such AV
> pipelines requires a new class of systems that enable the computation to
> maximize accuracy under dynamically-varying deadlines. Designing these systems
> presents interesting challenges that arise from combining ease-of-development
> of AV pipelines with deadline specification and enforcement mechanisms.
> 
> Our work addresses these challenges through D3 (**D**ynamic
> **D**eadline-**D**riven), a novel execution model that centralizes the
> deadline management, and allows applications to adjust their computation by
> modeling missed deadlines as exceptions. Further, we design and implement
> ERDOS, an open-source realization of D3 for AV pipelines that exposes
> fine-grained execution events to applications, and provides mechanisms to
> speculatively execute computation and enforce deadlines between an arbitrary
> set of events. Finally, we address the crucial lack of AV benchmarks through
> our state-of-the- art open-source AV pipeline, Pylot, that works seamlessly
> across simulators and real AVs. We evaluate the efficacy of D3 and ERDOS by
> driving Pylot across challenging driving scenarios spanning 50km, and observe
> a 68% reduction in collisions as compared to prior execution models

## Cite

```
@inproceedings{gog2022d3,
  title={D3: a dynamic deadline-driven approach for building autonomous vehicles},
  author={Gog, Ionel and Kalra, Sukrit and Schafhalter, Peter and Gonzalez, Joseph E and Stoica, Ion},
  booktitle={Proceedings of the Seventeenth European Conference on Computer Systems},
  pages={453--471},
  year={2022}
}
```
