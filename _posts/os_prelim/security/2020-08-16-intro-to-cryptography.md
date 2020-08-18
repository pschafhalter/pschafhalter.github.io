---
title: "Notes on \"Privacy and Authentication: An Introduction to Cryptography\""
layout: post_prelim
categories:
    - OS Prelim
    - Protection
    - Security
paper_authors:
    - Whitfield Diffie
    - Martin E. Hellman
year: 1979
venue: IEEE
mathjax: true
---

Concerned about eavesdropping from both foreign and domestic government agencies.

2 major problems in data security:

1. *Privacy*. Preventing an eavesdropper from extracting information from a communication channel.
2. *Authentication*. Preventing an opponent from meaningfully injecting or altering messages.
   - *Problem of dispute*. Provide the receiver with proof of the sender's identity.

## Basic concepts

- The sender generates *plaintext* $$P$$ which is unencrypted and intended for receipt by the receiver.
- The sender encrypts $$P$$ with an invertible transformation $$S_K$$ to produce ciphertext $$C = S_K(P)$$.
  - $$S_K: \mathcal{P} \rightarrow \mathcal{C}$$ where $$\mathcal{P}$$ is the space of plaintext messages and $$\mathcal{C}$$ is the set of ciphertext messages.
  - $$S_K$$ is chosen from a family of transformations known as the *cryptographic system* $$\{ S_K \}_{K \in \kappa}$$ where $$K$$ is the *specific key* chosen from the *keyspace* that selects the individual transformation.
  - The security depends on keeping $$K$$ secret.
- The legitimate receiver decrypts the ciphertext using $$S_K^{-1}$$ to obtain the plaintext $$S_K^{-1}(C) = S_K^{-1}(S_K(P)) = P$$.
- Attempts to decrypt $$C$$ or to encrypt an inauthentic $$P'$$ without obtaining $$K$$ is known as *cryptoanalysis*.
  - If cryptoanalysis is impossible, then the cryptographic system is secure.

## Cryptoanalytic attacks

1. *Cyphertext only attacks* use intercepted material, knowledge of the general system, and some general knowledge of the message contents. An example is using the statistical properties of a language to decode ciphertext (e.g. "E" occurs 13% of the time).
2. *Known plaintext attacks* can occur when the attacker knows substantial amounts of corresponding plaintext and ciphertext. This attack may be viable with structured messages such as business forms.
3. *Chosen plaintext attacks* allow the attacker to encrypt any plaintext and view the corresponding ciphertext.
4. *Chosen text attacks* allow the attacker to select either the ciphertext or the plaintext at will.

If the amount of information available to an attacker is insufficient to determine $$S_K$$ and $$S_K^{-1}$$, then the system is unconditionally secure.

If there is sufficient information available, but finding $$S_K$$ and $$S_K^{-1}$$ is *computationally unfeasible*, then the system is *computationally secure*.

Theory of computationally complexity is currently inadequate to demonstrate the computational infeasibility of any cryptanalytic problem.
This is somewhat problematic because systems like RSA which power secure traffic on the internet are [not provably computationally infeasible](https://en.wikipedia.org/wiki/RSA_problem).

The only unconditionally secure system used is a *one time tape* in which plaintext is combined with a totally random key of the same length. The key is never reused.

## Unicity distance

The *unicity distance* $$N_0$$ represents the amount of intercepted text needed to compute a unique solution.
For example, any simple substitution ciphertext containing 25+ characters can be broken, so $$N_0 \leq 25$$.

$$N_0 = H(K)/D$$ where $$H(K)$$ is the entropy of the key (e.g. length of key measured in bits, or $$\log_2 (\text{# of keys})$$) and $$D$$ is the redundancy of the language measured in bits per character (e.g. "Q" is followed by "U", so "U" is redundant).
Using compression to reduce redundancy can increase $$N_0$$.

## Public Key Systems

In *public key distribution*, the sender and receiver agree on a key for communication.
In this approach, an attacker who only eavesdrops cannot compute the key or understand following communication.

In *public key cryptosystems*, separate keys are used for encrypting and decrypting meaning that the encrypting key can be publicly shared.

$$ \text{Public key} \quad E_K: \ \{M\} \rightarrow \{M\} $$

$$ \text{Private key} \quad D_K: \ \{M\} \rightarrow \{M\} $$

on finite message space $$\{M\}$$ s.t.

1. $$\forall K \in \{K\},\ D_K = E_K^{-1}$$. Equivalently, $$\forall (K, M),\ D_K(E_K(M)) = M$$.
2. $$\forall K \in \{K\}, \forall M \in \{M\}$$ $$E_K(M)$$ and $$D_K(M)$$ are easy to compute.
3. For almost any $$K \in \{K\}$$, $$D_K$$ is computationally infeasible to derive from $$E_K$$.
   - Allows $$E_K$$ to be made public without compromising $$D_K$$.
4. For every $$K \in \{K\}$$, it is feasible to generate the same inverse pair $$E_K$$ and $$D_K$$ from $$K$$.
   - In practice, requires a true RNG to generate $$K$$.

## Digital signatures

Conventional authentication systems can prevent third-party forgeries, but there's no way to agree which messages were sent by the sender.
A solution is to extend public key systems to produce a signed message $$S$$ with the private key $$D_A$$: $$S = D_A(M)$$.
$$A$$ is user A's private key.
With this scheme, user B can recover $$M$$ using the public key: $$M = E_A(S)$$.

This technique allows unforgeable message dependent digital signatures; however, any eavesdropper can determine $$M$$ because $$E_A$$ is public.
To solve this, $$A$$ can send $$E_B(S) = E_B(D_A(M))$$ so that only B can recover $$S$$ and thereby $$M$$.

## Examples of Systems

1. *Substitution*. Use a permuted alphabet and substitute its letters for those of the normal alphabet (e.g. replace "A" with "B", "B" with "W", etc.).
   - Fairly vulnerable, can be solved by analyzing frequencies of letters and combinations of letters, as well scanning for pattern words.
   - Somewhat secure on larger alphabet sizes; however, encrypting becomes computationally expensive.
2. *Transposition*. Change the positions of plaintext letters in the message (e.g. swap 1st and 3rd character, 2nd and 5th).
   - Vulnerable, use frequency tables of letter pairs and triples to reconstruct plaintext.
   - Substitution and transposition are vulnerable on their own, but important components in more complex cipher systems.
3. *Polyalphabetic ciphers*. Use several different substitution alphabets periodically (e.g. letters numbered $$5n + i$$ are enciphered in the $$i$$th alphabet).
   - Solved in 1863 by Kasiski. Look for repeated groups of three or more ciphertext letters (e.g. "THE" or "ING"), count the number of characters between repeated groups, and factor to solve for the period $$n$$.
   - Check $$n$$ by conducting a frequency count on every $$n$$th ciphertext letter, and see if the distribution is similar to that of an alphabet. Then solve as $$n$$ different substitutions.
4. *Running key cipher*. Use a known passage of text as a key (e.g. from a book). Encode each character in both the message and the passage as numbers using A=0, B=1, etc. and add the vectors together mod 26.
   - Vulnerable by probing probable words in the plaintext to obtain the cipher.
   - Can also apply the probabilities of plaintext-key letter pairs. This can be strengthened by enciphering with additional running keys. Because English is 75% redundant, encoding with 4 running keys should be secure against all attacks.
   - Rarely used due to inexpensive, more easily used electronic techniques.
5. *Codes*. Operates on larger linguistic units of the plaintext (e.g. matching words and phrases with corresponding groups of letters and numbers called codegroups).
   - More difficult because more bits in the key, less redundancy, and large blocks of plaintext conceal local information.
   - Vulnerable to frequency analysis and known plaintext attacks.
   - Difficult to automate, and difficult to change keys if compromised.
6. *[Hagelin Machine](https://en.wikipedia.org/wiki/M-209)*. American field cipher used during World War II which was vulnerable to frequency analysis and known plaintext attacks.
7. *Rotor Machines* were important cryptographic devices used during World War II, famously the [Enigma machine](https://en.wikipedia.org/wiki/Enigma_machine).
   - Keys are selected by setting rotors and parameters that govern the machine's motion.
   - Computational approaches allow recovery for a small amount of rotor settings, and may be vulnerable to maximum likelihood estimation approaches by modeling rotors as noisy channels.
8. *Shift registers* are pseudorandom bit generators that produce long, nonrepeating random-like binary sequences from a short key.
   - Periodic, XOR with maximal length shift register sequence.
   - Insecure, can be broken fairly quickly.
9. *IBM's Systems and DES*. Used block ciphers which divide the plaintext into separate blocks and operate on each independently to produce a sequence of ciphertext blocks.
   - While block ciphers aren't inherently insecure, DES is.
   - DES has interesting history, [the NSA patched DES to fix a secretly known backdoor](https://en.wikipedia.org/wiki/Data_Encryption_Standard); however, this reduced the key size making DES vulnerable to brute force attacks.
10. *Analog systems* apply analog operations to a signal (e.g. voice), a technique called *scrambling*. These are more difficult to design because digital scanners and neglect noise making nonlinearity easier.
    1.  *Frequency inverters* invert the spectrum of the voice signal. Easily descrambled with the same device; humans can learn to understand/speak inverted speech as if it were a language.
    2. *Band splitting* breaks the speech into 5 frequency bands and permutes these. Easy to decode and produce intelligible speech.
    3. *Rolling code scramblers* change the permutation of frequency bands several times per second using a pseudorandom number generator. Vulnerable because the speech spectrum doesn't change instantaneously so it is possible to track frequency bands across transitions.
    4. *Time division scramblers* break speech into short segments and permute the segments within blocks. These are generally impractical because descrambled speech is delayed.
11. *Public key distribution systems*.
    - Each user $$i$$ and $$j$$ compute and share $$Y = \alpha^X \mod q$$ where $$X$$ is different for each user and remains secret and $$q$$ is prime.
    - For communication, use key $$K_{ij} = (\alpha^{X_i X_j} \mod q) = (Y_j^{X_i} \mod q) = (Y_i^{X_j} \mod q) $$
    - We have not yet discovered a way of feasibly computing $$X$$ from $$Y$$.
12. *RSA*.
    - Select 2 large prime numbers $$P$$ and $$Q$$ and multiply them together to obtain $$N = PQ$$.
    - $$N$$ is made public, $$P$$ and $$Q$$ are kept secret.
    - Compute $$\Phi(N) = (P - 1)(Q - 1)$$ which is *relatively prime* to $$N$$.
    - Select $$E \in [2, \Phi(N) - 1]$$ which is made public.
    - Encryption is done block-wise where $$C = M^E \mod N$$.
    - Calculate $$D$$ s.t. $$ED = 1 \mod \Phi(N) = kPhi(N) + 1$$.
    - Because $$X^{k \Phi(N) + 1} = X \mod N$$, decipher using $$C^D = M^{ED} = M^{k \Phi(N) + 1} = M \mod N$$.
13. *Trap door knapsacks*.
    - Given $$\vec{a} \in \mathcal{Z}^n$$ and integer $$S$$, find a subset of the $$\{a_i\}$$ s.t. the sum of the elements of the subset is equal to $$S$$. Equivalently, find a binary n-vector s.t. $$\vec{a}^T \vec{x} = S$$.
    - Divide into n-bit blocks.
    - Recovering $$\vec{x}$$ from $$S$$ involves solving a knapsack problem which is believed to be computationally infeasible if $$\vec{a}$$ and $$\vec{x}$$ are randomly chosen.
    - $$\vec{a}'$$ cannot be made public because anyone can easily recover $$\vec{x}$$ from $$S$$. Keep $$\vec{a}'$$ secret.
    - Generate a random number $$m > \sum \vec{a}_i'$$ and a random pair $$w, w^{-1}$$ s.t. $$ ww^{-1} = 1 \mod m$$.
    - Generate a public enciphering key $$\vec{a} = w \vec{a}' \mod m$$.
    - To send a message to the user, send $$S = \vec{a}^T \vec{x}$$.
    - $$\begin{align*}S' &= w^{-1}S \mod m \\
    &= w^{-1} \sum \vec{a}_i \vec{x}_i \mod m \\
    &= w^{-1} \sum(w \vec{a}_i' \mod m) \vec{x}_i \mod m \\
    &= \sum(w^{-1} w \vec{a}_i' \mod m) \vec{x}_i \mod m \\
    &= \sum \vec{a}_i' \vec{x}_i \mod m \\
    &= \vec{a}'^T x \\
    \end{align*}$$
    - Vulnerable if each element in $$\vec{a}$$ is larger than the sum of its preceding elements.
    - Requires special adaptation to produce signatures.

## Stream Ciphers

Incoming characters are not encoded independently.
The device maintains an internal state which changes upon each encoding.
Two identical plaintext characters will usually result in different ciphertext characters.
Block ciphers can be used to construct stream systems.

In *synchronous stream systems*, the next state depends only on the previous state and not the input.
Such systems are memoryless, but time-varying.
The output depends only on the input and the position in the input sequence.
As a result, there is no error propagation -- only characters corrupted in transmission will result in erroneous deciphered characters.
The loss of a character causes loss of synchronization, so all text following the loss will be decrypted incorrectly.

Examples include the Hagelin machine, feedback shift registers, and rotor machines.

*Self-synchronizing stream systems*, also known as *ciphertext autokey stream systems*, use memory on the deciphering device to ensure that erroneous or lost ciphertext characters cause only limited numbers of errors in the deciphered plaintext.

Some systems such as DES are both time-varying and have memory.
Encryption of plaintext characters depends on the position of the character and the characters which precede it.

## Cryptography in Practice

Must be implemented on a computer or hardware; tested for reliability, usability, and security; and maintained in the field.
Keys must also be distributed to installation, and cryptography must be integrated with other features such as error correction.

**Key management* refers to the distribution, revocation, and production of keys.
With *link encryption*, each user has only one key used to communicate with another node; therefore, the compromise of any node will not compromise all nodes in the network.
A *key distribution center* is a network resource that generates keys for particular conversations and shares the key with the users involved, encrypted using the users' public keys.

*Indicators* refer to data which are used to vary encryption and decryption depending on the time or the message.
An indicator is sent as part of the ciphertext and tells a receiver how to decrypt the message.
Indicators may be sent in plaintext or ciphertext.
A *session key* is an example of an indicator.

Using *traffic analysis*, an attacker can determine some information by examining the pattern of messages in a network (e.g. traffic between companies A and B may imply some sort of business deal).
*Padding*, or adding artificial traffic, can mitigate traffic analysis, but may end up being expensive.

An attacker may also record and playback encrypted messages with the hope of duplicating or causing unintended behavior.
One solution is *block chaining* makes decryption of a message somehow dependant on the previous block (e.g. XOR with the previous block, encode the number of bits of the previous ciphertext block).

*Error detection* refers to encrypting messages, and then applying error control coding.
*Error correction* refers to applying error control coding, and then encrypting messages.
Due to the cost of error correction, a commonly used scheme is error detection with retransmission of erroneous messages.

A *bust* is an error in the operation of a system which enables a cryptanalytic break.
A *letter check* (e.g. encoding "AAAAAA...") and comparing this with a correctly enciphered version can reduce busts.

Side channel attacks and compromise of access to the system (e.g. through social engineering) are also major security considerations.

Certification, such as via penetration tests, can offer some level of confidence in the difficulty to break a system.
The system should be published as it increases the chance that exploits are reported. Financial reward (e.g. bug bounties) can also help.

## Applications of Cryptography

Passwords should be encrypted in a multiuser system a.k.a. hash and salt passwords.
Data encryption can protect data and offers protection from physical theft of data storage devices.
The authors also suggest that encryption can absolve sysadmins from surrendering user data to governments as properly encrypted data is hard to compromise.

*Link encryption*, *end-to-end encryption*, and *challenge and response* using public key cryptography offer protection on a communication channel.
