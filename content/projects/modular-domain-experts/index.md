---
title: Scalable Multi-Domain Adaptation of Language Models using Modular Experts
date: 2024-10-14
url: /modular-domain-experts
layout: project
params:
  authors:
    - name: Peter Schafhalter
      url: /
    - name: Shun Liao
      url: https://www.linkedin.com/in/shun-liao-51b081106/
    - name: Yanqi Zhou
      url: https://zhouyanqi.github.io/
    - name: Chih-Kuan Yeh
      url: https://chihkuanyeh.github.io/
    - name: Arun Kandoor
      url: https://www.linkedin.com/in/arun-reddy-kandoor-920aba5/
    - name: James Laudon
      url: https://research.google/people/jameslaudon/
  organizations:
    - name: UC Berkeley
    - name: Google DeepMind
  links:
    - name: Paper
      url: /papers/2024-arxiv-modular-domain-experts.pdf
---

![Modular Domain Experts](modular-domain-experts.png "Modular Domain Experts")

## Overview

## Abstract

> Domain-specific adaptation is critical to maximizing the performance of
> pre-trained language models (PLMs) on one or multiple targeted tasks,
> especially under resource-constrained use cases, such as edge devices.
> However, existing methods often struggle to balance domain-specific
> performance, retention of general knowledge, and efficiency for training and
> inference. To address these challenges, we propose Modular Domain Experts
> (MoDE). MoDE is a mixture-of-experts architecture that augments a general PLMs
> with modular, domain-specialized experts. These experts are trained
> independently and composed together via a lightweight training process. In
> contrast to standard low-rank adaptation methods, each MoDE expert consists of
> several transformer layers which scale better with more training examples and
> larger parameter counts. Our evaluation demonstrates that MoDE achieves
> comparable target performances to full parameter fine-tuning while achieving
> 1.65% better retention performance. Moreover, MoDE's architecture enables
> flexible sharding configurations and improves training speeds by up to 38%
> over state-of-the-art distributed training configurations. 

## Cite

```
@article{schafhalter2024scalable,
  title={Scalable Multi-Domain Adaptation of Language Models using Modular Experts},
  author={Schafhalter, Peter and Liao, Shun and Zhou, Yanqi and Yeh, Chih-Kuan and Kandoor, Arun and Laudon, James},
  journal={arXiv preprint arXiv:2410.10181},
  year={2024}
}
```
