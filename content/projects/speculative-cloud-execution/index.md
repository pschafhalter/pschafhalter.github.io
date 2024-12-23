---
title: "Leveraging Cloud Computing to Make Autonomous Vehicles Safer"
date: 2023-10-01
url: /speculative-cloud-execution
layout: project
summary: Use the cloud to improve autonomous driving safety.
description:  Leveraging cloud computing can enhance the safety of autonomous vehicles by improving decision accuracy and reliability. Our research explores speculative execution techniques to seamlessly integrate cloud resources with on-board systems, ensuring optimal performance even under unreliable network conditions.
keywords:
  - autonomous vehicles
  - cloud computing
  - speculative execution
  - speculative cloud execution
  - AV safety
  - real-time processing
  - edge AI
  - edge inference
  - network reliability
  - computational offloading
  - intelligent transportation systems
  - IROS 2023
  - autonomous driving research
  - edge computing
  - vehicular networks
  - AV decision accuracy
  - cloud integration
  - safety enhancement
params:
  authors:
    - name: Peter Schafhalter
      url: /
    - name: Sukrit Kalra
      url: https://sukritkalra.github.io/
    - name: Le Xu
      url: https://lexu.space/
    - name: Joseph E. Gonzalez
      url: https://people.eecs.berkeley.edu/~jegonzal/
    - name: Ion Stoica
      url: https://people.eecs.berkeley.edu/~istoica/
  organizations:
    - name: UC Berkeley
    - name: UT Austin
  links:
    - name: Paper
      url: /papers/2023-iros-cloud-av-safety.pdf
    - name: Slides
      url: /slides/2023-iros-cloud-avs-slides.pdf
    - name: Poster
      url: /posters/2023-iros-cloud-avs-poster.pdf
  venue: IROS
  icon: speculative-cloud-execution-icon.png
---

![Speculative Cloud Execution](speculative-cloud-execution.png)
*With **Speculative Cloud Execution**, operators process inputs both in the
cloud and locally. To ensure real-time execution, operators set a deadline for
the responses from the cloud. At the deadline, operators maximize accuracy by
generating their output using the available responses from the cloud and
the results of local execution.*

## Overview

- Autonomous vehicles (AVs) use highly accurate ML models to process sensor
  data in real time, but have limited processing power available on-board.
- While the cloud is resource-rich, accessing the cloud relies on
  unreliable cellular networks.
- With *Speculative Cloud Execution*, AVs use the cloud to generate more
  accurate results when possible and seamlessly fall back to local computation
  when network conditions degrade.
- ==We find that integrating the cloud can improve AV safety by avoiding
  collisions on complex, real-world crash scenarios from the NHTSA.==

## Abstract
> The safety of autonomous vehicles (AVs) depends on their ability to perform
> complex computations on high-volume sensor data in a timely manner. Their
> ability to run these computations with state-of-the-art models is limited by
> the processing power and slow update cycles of their onboard hardware. In
> contrast, cloud computing offers the ability to burst computation to vast
> amounts of the latest generation of hardware. However, accessing these cloud
> resources requires traversing wireless networks that are often considered to
> be too unreliable for real-time AV driving applications.
>
> Our work seeks to harness this unreliable cloud to enhance the accuracy of an
> AV's decisions, while ensuring that it can always fall back to its on-board
> computational capabilities. We identify three mechanisms that can be used by
> AVs to safely leverage the cloud for accuracy enhancements, and elaborate why
> current execution systems fail to enable these mechanisms. To address these
> limitations, we provide a system design based on the speculative execution of
> an AV's pipeline in the cloud, and show the efficacy of this approach in
> simulations of complex real-world scenarios that apply these mechanisms. 

## Cite
```
@inproceedings{schafhalter2023leveraging,
  title={Leveraging cloud computing to make autonomous vehicles safer},
  author={Schafhalter, Peter and Kalra, Sukrit and Xu, Le and Gonzalez, Joseph E and Stoica, Ion},
  booktitle={2023 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)},
  pages={5559--5566},
  year={2023},
  organization={IEEE}
}
```
