# 🧠 LLM Fundamentals

### A Practical Foundation for Generative AI & Large Language Models

```{=html}
<p align="center">
```
`<strong>`{=html}Understand how LLMs work --- from tokens and
transformers to inference, training, and
hallucinations.`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<img src="https://img.shields.io/badge/AI-Generative%20AI-7C3AED?style=for-the-badge" alt="Generative AI" />`{=html}
`<img src="https://img.shields.io/badge/LLM-Fundamentals-2563EB?style=for-the-badge" alt="LLM Fundamentals" />`{=html}
`<img src="https://img.shields.io/badge/Level-Beginner%20to%20Intermediate-059669?style=for-the-badge" alt="Level" />`{=html}
`<img src="https://img.shields.io/badge/Focus-Concepts%20%2B%20Backend-F97316?style=for-the-badge" alt="Focus" />`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## 📚 Table of Contents

1.  [What is Generative AI?](#1-what-is-generative-ai)
2.  [Traditional AI vs Generative
    AI](#2-traditional-ai-vs-generative-ai)
3.  [What is an LLM?](#3-what-is-an-llm)
4.  [How Does an LLM Generate Text?](#4-how-does-an-llm-generate-text)
5.  [Training and Parameters](#5-training-and-parameters)
6.  [What Can LLMs Do?](#6-what-can-llms-do)
7.  [Tokens and Tokenization](#7-tokens-and-tokenization)
8.  [Context and Context Window](#8-context-and-context-window)
9.  [Inference](#9-inference)
10. [LLM Generation Parameters](#10-llm-generation-parameters)
11. [Transformer Architecture](#11-transformer-architecture)
12. [Self-Attention](#12-self-attention)
13. [Pretraining, Fine-Tuning, and
    Post-Training](#13-pretraining-fine-tuning-and-post-training)
14. [Hallucinations and LLM
    Limitations](#14-hallucinations-and-llm-limitations)
15. [How These Concepts Fit
    Together](#15-how-these-concepts-fit-together)
16. [Key Terms](#16-key-terms)
17. [Final Revision Checklist](#17-final-revision-checklist)

------------------------------------------------------------------------

## 1. What is Generative AI?

**Generative AI** is a type of artificial intelligence that can create
new content based on patterns learned from data.

It can generate:

-   ✍️ Text --- explanations, emails, summaries, stories
-   🖼️ Images --- illustrations, product concepts, artwork
-   🎵 Audio and music
-   🎬 Video
-   💻 Code

### Simple example

A user asks:

> Write a short email asking for a project deadline extension.

A Generative AI model can create a new email based on the instruction.

**Remember:** Generative AI creates content. It does not simply choose
from a fixed list of predefined answers.

------------------------------------------------------------------------

## 2. Traditional AI vs Generative AI

Both are forms of AI, but they are commonly used for different kinds of
tasks.

  -----------------------------------------------------------------------
  Traditional AI (common use)         Generative AI
  ----------------------------------- -----------------------------------
  Classifies or predicts              Creates new content

  Detects spam                        Drafts an email

  Predicts house prices               Generates a product description

  Identifies objects in an image      Creates an image from a prompt

  Often returns a label or score      Often returns generated text,
                                      media, or code
  -----------------------------------------------------------------------

### Visual comparison

``` mermaid
flowchart TD
    A["Input Data"] --> B["Traditional AI Model"]
    A --> C["Generative AI Model"]
    B --> D["Prediction / Classification"]
    C --> E["New Content"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style C fill:#D1FAE5,stroke:#059669,color:#064E3B
    style D fill:#FEF3C7,stroke:#D97706,color:#78350F
    style E fill:#FCE7F3,stroke:#DB2777,color:#831843
```

*This is a simplified comparison. Traditional AI can include many kinds
of systems, and generative systems can also perform classification-like
tasks.*

------------------------------------------------------------------------

## 3. What is an LLM?

**LLM** stands for **Large Language Model**.

An LLM is a machine-learning model trained on large amounts of text
(and, depending on the model, other data) to learn language patterns and
generate or process language.

Examples of model families include:

-   GPT
-   Claude
-   Gemini
-   Llama
-   Mistral

### What does "large" mean?

The word *large* can refer to factors such as:

-   A large number of learned parameters
-   Large and varied training datasets
-   Significant computational resources used during training

Different LLMs can vary in their architecture, training data,
capabilities, speed, cost, and context-window size.

------------------------------------------------------------------------

## 4. How Does an LLM Generate Text?

Many modern LLMs generate text using **autoregressive next-token
prediction**.

In simple words:

1.  The model receives the input prompt.
2.  It processes the tokens in that prompt.
3.  It predicts a likely next token.
4.  The selected token is added to the sequence.
5.  The model repeats the process until it reaches a stopping condition.

### Example

Prompt:

> The capital of France is

Possible generation:

``` text
The capital of France is
              |
              v
            Paris
              |
              v
       The model continues
```

### Generation loop

``` mermaid
flowchart TD
    A["User Prompt"] --> B["Tokenize Input"]
    B --> C["LLM Processes Tokens"]
    C --> D["Predict Next Token"]
    D --> E["Select a Token"]
    E --> F{"Stop condition reached?"}
    F -- "No" --> G["Append Token to Sequence"]
    G --> C
    F -- "Yes" --> H["Return Generated Response"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style C fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style D fill:#FEF3C7,stroke:#D97706,color:#78350F
    style H fill:#D1FAE5,stroke:#059669,color:#064E3B
```

**Important:** An LLM does not normally retrieve a complete pre-written
answer for every prompt. It generates a sequence step by step.
Next-token prediction does not guarantee that the generated answer is
true.

------------------------------------------------------------------------

## 5. Training and Parameters

### 5.1 What is model training?

Training is the process through which a model learns patterns from data
by adjusting its internal numerical values.

During training, the model makes predictions, compares them with a
training objective, and updates its parameters to improve performance.

### 5.2 What are parameters?

**Parameters** are learned numerical values inside a model. They are
adjusted during training and influence the model's output.

A model with more parameters is not automatically better. Quality also
depends on data, architecture, training methods, and how the model is
evaluated.

### 5.3 Why do LLMs have different capabilities?

Models can differ in:

-   Parameter count and architecture
-   Training data and training methods
-   Reasoning and instruction-following performance
-   Supported input and output types
-   Context window
-   Response speed and inference cost

------------------------------------------------------------------------

## 6. What Can LLMs Do?

Common LLM capabilities include:

  Capability               Example
  ------------------------ ------------------------------
  Text generation          Write an email
  Question answering       Explain an API
  Summarization            Summarize a long document
  Translation              Translate English to Hindi
  Code generation          Create an Express route
  Classification           Categorize customer feedback
  Information extraction   Extract names and dates
  Structured output        Generate JSON
  Reasoning support        Break a problem into steps

**Engineering note:** A capability is not a guarantee. Always validate
important outputs before using them in a production system.

------------------------------------------------------------------------

## 7. Tokens and Tokenization

### 7.1 What is a token?

A **token** is a unit of text processed by a language model.

A token may represent:

-   A complete word
-   Part of a word
-   Punctuation
-   A space or other text fragment

A token is not always equal to one word or one character.

### 7.2 What is tokenization?

**Tokenization** is the process of converting input text into tokens
that a model can process.

``` mermaid
flowchart LR
    A["Raw Text<br/>Hello, world!"] --> B["Tokenizer"]
    B --> C["Token 1"]
    B --> D["Token 2"]
    B --> E["Token 3"]
    C --> F["Token IDs"]
    D --> F
    E --> F
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style F fill:#D1FAE5,stroke:#059669,color:#064E3B
```

*Illustrative diagram only. Actual token boundaries and token IDs depend
on the tokenizer and model.*

### 7.3 Why do tokens matter?

Tokens matter because they affect:

1.  **Context window:** Input and output consume tokens.
2.  **API cost:** Many providers price usage by input and output tokens.
3.  **Limits:** Requests can exceed model or provider token limits.
4.  **Performance:** Token count can affect processing time.

### 7.4 Token count is not word count

For example, a sentence containing 10 words does not necessarily contain
10 tokens.

The exact count depends on the model's tokenizer. Use the tokenizer or
provider's official token-counting method when accuracy matters.

------------------------------------------------------------------------

## 8. Context and Context Window

### 8.1 What is context?

**Context** is the information available to the model while it generates
a response.

It may include:

-   System instructions
-   Developer instructions
-   Current user prompt
-   Relevant conversation history
-   Retrieved documents (for example, from RAG)
-   Tool results

### 8.2 What is a context window?

The **context window** is the maximum amount of tokenized information a
model can process in a single request or conversation step, according to
that model's limits.

The exact limit depends on the model and provider.

### Context vs Context Window

  -----------------------------------------------------------------------
  Context                             Context Window
  ----------------------------------- -----------------------------------
  The information supplied to the     The model's token capacity limit
  model                               

  Actual content                      Maximum capacity

  Can change from request to request  Depends on the selected model
  -----------------------------------------------------------------------

### Visual example

``` mermaid
flowchart TD
    A["Available Context"] --> B["System Instructions"]
    A --> C["Conversation History"]
    A --> D["User Prompt"]
    A --> E["Retrieved Documents"]
    A --> F["Tool Results"]
    B --> G["Combined Tokenized Input"]
    C --> G
    D --> G
    E --> G
    F --> G
    G --> H["Context Window Limit"]
    H --> I["Model Processes Input"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style G fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style H fill:#FEF3C7,stroke:#D97706,color:#78350F
    style I fill:#D1FAE5,stroke:#059669,color:#064E3B
```

**Backend insight:** A large context window does not mean you should
send every document or the entire chat history. Select relevant
information to control cost, latency, and noise.

------------------------------------------------------------------------

## 9. Inference

**Inference** is the process of using a trained model to generate a
prediction or response for new input.

In simple words:

-   Training = the model learns.
-   Inference = the trained model is used.

### Typical inference flow

``` mermaid
sequenceDiagram
    participant U as User
    participant A as Application Backend
    participant M as LLM
    U->>A: Send prompt
    A->>A: Build messages and settings
    A->>M: Send inference request
    M->>M: Process tokens and generate output
    M-->>A: Return generated response
    A-->>U: Send response
```

### Training vs Inference

  -----------------------------------------------------------------------
  Training                            Inference
  ----------------------------------- -----------------------------------
  Learns or updates model parameters  Uses the trained model

  Uses training data and an           Uses a prompt or input
  optimization process                

  Usually computationally expensive   Cost depends on model and usage

  Produces an updated model           Produces a prediction or response
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 10. LLM Generation Parameters

Generation parameters influence how a model produces its response. The
exact supported parameters and their names can vary by provider and
model.

### 10.1 Temperature

Controls the randomness of token selection.

-   Lower temperature: generally more predictable output.
-   Higher temperature: generally more varied output.

Example:

-   Lower: useful when consistent wording is preferred.
-   Higher: useful for brainstorming and creative writing.

Temperature does not directly measure factual accuracy.

### 10.2 Top-K

Limits token selection to the K most likely candidate tokens before
sampling.

Example: If `top_k = 5`, the model samples from the five highest-ranked
candidate tokens (where this parameter is supported).

### 10.3 Top-P (Nucleus Sampling)

Selects from the smallest group of likely tokens whose cumulative
probability reaches the configured threshold.

Example: `top_p = 0.9` uses a probability-based candidate group (where
supported).

### 10.4 Max Tokens

Sets a limit on the number of tokens generated for the output, subject
to provider and model rules.

### Quick comparison

  Parameter     Controls
  ------------- --------------------------------------------
  Temperature   Randomness / variation
  Top-K         Number of candidate tokens
  Top-P         Cumulative probability of candidate tokens
  Max Tokens    Maximum generated output length

------------------------------------------------------------------------

## 11. Transformer Architecture

The **Transformer** is a neural-network architecture introduced in the
2017 research paper *Attention Is All You Need*.

Transformers became the foundation of many modern language models
because they can process relationships between tokens using attention
mechanisms.

### High-level architecture

``` mermaid
flowchart TD
    A["Input Text"] --> B["Tokenization"]
    B --> C["Token Embeddings"]
    C --> D["Positional Information"]
    D --> E["Transformer Blocks"]
    E --> F["Output Layer"]
    F --> G["Next-Token Scores"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style C fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style E fill:#D1FAE5,stroke:#059669,color:#064E3B
    style G fill:#FEF3C7,stroke:#D97706,color:#78350F
```

### Main Transformer families

  -----------------------------------------------------------------------
  Type                                Common example / use
  ----------------------------------- -----------------------------------
  Encoder-only                        BERT-style models; useful for
                                      understanding and representation
                                      tasks

  Decoder-only                        GPT-style models; commonly used for
                                      autoregressive generation

  Encoder-decoder                     T5-style models; useful for
                                      input-to-output transformation
                                      tasks
  -----------------------------------------------------------------------

Many popular generative chat LLMs use decoder-only Transformer
architectures, but not every language model uses the same design.

------------------------------------------------------------------------

## 12. Self-Attention

**Self-attention** is a mechanism that lets each token calculate how
much it should use information from other tokens in the same input
sequence.

It helps the model represent relationships between words or tokens.

### Example

> The developer opened the laptop because it was slow.

To interpret the word **"it"**, the model can use information from other
tokens in the sentence.

Self-attention helps model these relationships.

### Query, Key, and Value (Q, K, V)

Self-attention uses three learned projections:

-   **Query (Q):** What information is this token looking for?
-   **Key (K):** What information does each token offer for matching?
-   **Value (V):** What information is passed forward?

A simplified attention formula is:

\[ Attention(Q,K,V) =
softmax`\left`{=tex}(`\frac{QK^T}{\sqrt{d_k}}`{=tex}`\right`{=tex})V \]

You do not need to derive this formula at this stage. Understand the
roles of Q, K, and V.

### Visual intuition

``` mermaid
flowchart TD
    A["Input Tokens"] --> B["Create Q, K, V"]
    B --> C["Compare Queries with Keys"]
    C --> D["Calculate Attention Weights"]
    D --> E["Combine Values"]
    E --> F["Context-aware Token Representations"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style D fill:#FEF3C7,stroke:#D97706,color:#78350F
    style F fill:#D1FAE5,stroke:#059669,color:#064E3B
```

### Self-Attention vs RAG

These concepts solve different problems.

  -----------------------------------------------------------------------
  Self-Attention                      RAG
  ----------------------------------- -----------------------------------
  Part of the model architecture      An application/system design
                                      pattern

  Helps tokens use information from   Retrieves relevant external
  other tokens in the input           information

  Operates inside the model           Usually operates around the model
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 13. Pretraining, Fine-Tuning, and Post-Training

These terms describe stages or methods used to create and adapt language
models. Real training pipelines can vary, and the terms can overlap.

### 13.1 Pretraining

**Pretraining** is the initial large-scale training stage in which a
model learns general patterns from a large dataset.

It can learn:

-   Language structure
-   Relationships between tokens
-   General patterns in text and code
-   Next-token prediction (for autoregressive models)

The result is commonly called a **base model**.

### 13.2 Fine-tuning

**Fine-tuning** means further training a pretrained model on a more
focused dataset to adapt it to a task, style, or domain.

Example:

A general pretrained model can be adapted using customer-support
examples to improve its customer-support responses.

### 13.3 Post-training

**Post-training** is a broad term for additional training after
pretraining to make a model more useful for intended interactions, such
as following instructions, responding helpfully, and aligning with
preferences or safety requirements.

Common methods can include:

-   Supervised Fine-Tuning (SFT)
-   RLHF (Reinforcement Learning from Human Feedback)
-   DPO (Direct Preference Optimization)

SFT is commonly part of post-training. Fine-tuning can also refer more
broadly to specialized adaptation, so the terms are not always mutually
exclusive.

### Conceptual lifecycle

``` mermaid
flowchart TD
    A["Large Training Dataset"] --> B["Pretraining"]
    B --> C["Base Model"]
    C --> D["Post-training"]
    D --> E["Instruction-following Model"]
    E --> F["Optional Domain / Task Fine-tuning"]
    F --> G["Adapted Model"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style D fill:#D1FAE5,stroke:#059669,color:#064E3B
    style G fill:#FCE7F3,stroke:#DB2777,color:#831843
```

*This is a conceptual lifecycle, not a mandatory sequence for every
model.*

### Simple analogy

Imagine a student:

-   **Pretraining:** Learns general subjects at school.
-   **Fine-tuning:** Practices a specialized subject such as computer
    science.
-   **Post-training:** Practices following instructions and
    communicating answers in a helpful and safe way.

------------------------------------------------------------------------

## 14. Hallucinations and LLM Limitations

### 14.1 What is a hallucination?

An **LLM hallucination** occurs when a model generates information that
sounds convincing but is incorrect, misleading, or unsupported by
available evidence.

Example:

User asks:

> Who invented JavaScript?

Correct answer: **Brendan Eich**.

A hallucinating model might confidently give a different person's name.

### 14.2 Why can hallucinations happen?

Common contributing factors include:

1.  **Next-token generation:** Fluent generation does not guarantee
    factual truth.
2.  **Insufficient context:** The model may not have the information
    needed.
3.  **Outdated knowledge:** Its training data may not include recent
    updates.
4.  **Ambiguous prompts:** The model may interpret the question
    incorrectly.
5.  **Training-data problems:** Data can contain errors, gaps, or
    conflicting information.

### 14.3 Other limitations

  -----------------------------------------------------------------------
  Limitation                          Meaning
  ----------------------------------- -----------------------------------
  Context limit                       Only a limited amount of tokenized
                                      information fits in a request

  Knowledge freshness                 Built-in knowledge may not include
                                      recent changes

  Factual reliability                 Responses are not guaranteed to be
                                      correct

  Reasoning errors                    Complex tasks can still produce
                                      mistakes

  Bias                                Learned patterns can reflect biases
                                      in data

  Prompt sensitivity                  Different wording can change the
                                      output

  Output variation                    The same prompt can produce
                                      different responses
  -----------------------------------------------------------------------

### 14.4 How can developers reduce hallucinations?

**1. Clear prompting**

``` text
Answer only using the provided context.
If the answer is not present, say:
"I don't know based on the available information."
```

**2. Retrieval-Augmented Generation (RAG)**

Retrieve relevant documents and provide them to the model as context.

**3. External tools and APIs**

Use reliable APIs or databases for information that must be current,
such as live prices or weather.

**4. Validation and verification**

-   Validate JSON against a schema.
-   Check important values against trusted sources.
-   Enforce application business rules.
-   Require citations or evidence where appropriate.

### RAG flow

``` mermaid
flowchart TD
    A["User Question"] --> B["Retrieve Relevant Documents"]
    B --> C["Build Prompt with Retrieved Context"]
    C --> D["LLM Generates Answer"]
    D --> E["Validate / Verify When Needed"]
    E --> F["Return Answer"]
    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style D fill:#D1FAE5,stroke:#059669,color:#064E3B
    style E fill:#FEF3C7,stroke:#D97706,color:#78350F
```

**Important:** RAG can reduce hallucinations, but it cannot guarantee
that every answer is correct. A model can still misunderstand retrieved
content or generate unsupported details.

------------------------------------------------------------------------

## 15. How These Concepts Fit Together

Here is the end-to-end picture of a typical LLM-powered application:

``` mermaid
flowchart TD
    A["User"] --> B["Backend Application"]
    B --> C["Build Context<br/>Instructions + Prompt + History"]
    C --> D["Tokenizer"]
    D --> E["Token IDs"]
    E --> F["Transformer LLM"]
    F --> G["Next-token Generation"]
    G --> H["Generated Tokens"]
    H --> I["Decode Output"]
    I --> J["Validate / Post-process"]
    J --> K["Response to User"]

    L["Optional: RAG / Tools"] --> C

    style A fill:#DBEAFE,stroke:#2563EB,color:#172554
    style B fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    style F fill:#D1FAE5,stroke:#059669,color:#064E3B
    style L fill:#FEF3C7,stroke:#D97706,color:#78350F
    style K fill:#FCE7F3,stroke:#DB2777,color:#831843
```

### The complete mental model

1.  A model is trained through processes such as pretraining and
    post-training.
2.  A user sends a prompt to an application.
3.  The application builds the context and sends it to the model.
4.  A tokenizer converts text into tokens.
5.  The Transformer processes token representations using mechanisms
    such as self-attention.
6.  The model generates output tokens.
7.  The application decodes, validates, and returns the response.
8.  RAG or tools can provide external information when the application
    needs it.

------------------------------------------------------------------------

## 16. Key Terms

  -----------------------------------------------------------------------
  Term                                One-line meaning
  ----------------------------------- -----------------------------------
  Generative AI                       AI that creates new content

  LLM                                 Large Language Model

  Parameter                           A learned numerical value in a
                                      model

  Next-token prediction               Predicting the next token in a
                                      sequence

  Token                               A unit of text processed by a model

  Tokenization                        Converting text into tokens

  Context                             Information available to the model

  Context window                      Maximum tokenized information the
                                      model can process at once

  Inference                           Using a trained model to generate
                                      an output

  Temperature                         Controls randomness in generation

  Top-K                               Limits sampling to K likely tokens

  Top-P                               Uses a cumulative-probability
                                      sampling threshold

  Transformer                         Neural-network architecture used by
                                      many modern LLMs

  Self-attention                      Mechanism for relating tokens to
                                      one another

  Pretraining                         Initial large-scale model training

  Fine-tuning                         Further training for a task or
                                      domain

  Post-training                       Additional adaptation after
                                      pretraining

  Hallucination                       Convincing but incorrect or
                                      unsupported output

  RAG                                 Retrieval-Augmented Generation
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 17. Final Revision Checklist

Use this checklist to confirm that you understand the fundamentals
before moving to implementation.

-   [ ] I can explain Generative AI with an example.
-   [ ] I understand Traditional AI vs Generative AI.
-   [ ] I can define an LLM.
-   [ ] I understand next-token prediction.
-   [ ] I know what model parameters are.
-   [ ] I understand why different LLMs behave differently.
-   [ ] I can explain tokens and tokenization.
-   [ ] I understand context vs context window.
-   [ ] I can explain inference vs training.
-   [ ] I understand Temperature, Top-K, Top-P, and Max Tokens.
-   [ ] I know the high-level Transformer architecture.
-   [ ] I understand the purpose of self-attention and Q, K, V.
-   [ ] I can distinguish pretraining, fine-tuning, and post-training.
-   [ ] I can explain hallucinations and common mitigation methods.
-   [ ] I understand where RAG and external tools fit into an LLM
    application.

------------------------------------------------------------------------

## 🚀 What Comes Next?

**Next practical mini-project: Node.js + TypeScript Token Counter &
Provider Cost Estimator**

We will build a small developer utility that:

1.  Accepts text as input.
2.  Counts tokens using the appropriate tokenizer.
3.  Estimates input and output token usage.
4.  Calculates estimated API cost using configurable provider/model
    pricing.
5.  Shows a clear cost breakdown.

> **Important:** Tokenization and pricing differ by provider and model.
> The project will keep tokenizer selection and pricing configuration
> explicit instead of assuming one universal token count or price.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}Build your fundamentals. Then build real AI systems.
💻`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<sub>`{=html}LLM Engineering Journey · Chapter 1 · Foundation of
Generative AI & LLMs`</sub>`{=html}
```{=html}
</p>
```
