# 🚀 LLM Tool Calling --- Complete Guide

### Node.js + TypeScript + Google Gemini

![LLM Tool
Calling](https://img.shields.io/badge/LLM-Tool%20Calling-7C3AED?style=for-the-badge&logo=google-gemini&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Type_Safe-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> **Goal:** Understand how an LLM requests backend functions, how the
> backend safely executes them, and how tool-calling systems handle
> multiple tools, failures, timeouts, retries, and production concerns.

------------------------------------------------------------------------

## 📚 Table of Contents

1.  [What is Tool Calling?](#-1-what-is-tool-calling)
2.  [Why Do We Need It?](#-2-why-do-we-need-it)
3.  [How Tool Calling Works](#-3-how-tool-calling-works)
4.  [Important Components](#-4-important-components)
5.  [Project Setup](#-5-project-setup)
6.  [Single Tool Calling](#-6-single-tool-calling)
7.  [Understanding Tool Call IDs](#-7-understanding-tool-call-ids)
8.  [Returning Tool Results to
    Gemini](#-8-returning-tool-results-to-gemini)
9.  [Multiple Tool Calling](#-9-multiple-tool-calling)
10. [Sequential vs Parallel
    Execution](#-10-sequential-vs-parallel-execution)
11. [Error Handling and Edge Cases](#-11-error-handling-and-edge-cases)
12. [Retry Mechanism and Exponential
    Backoff](#-12-retry-mechanism-and-exponential-backoff)
13. [Production Safety Checklist](#-13-production-safety-checklist)
14. [Important Concepts](#-14-important-concepts)
15. [Quick Revision](#-15-quick-revision)
16. [Practice Challenges](#-16-practice-challenges)
17. [Progress Tracker](#-17-progress-tracker)

------------------------------------------------------------------------

## 🧠 1. What is Tool Calling?

**Tool Calling** (also called function calling) is a capability that
allows an LLM to request that an application execute a specific function
or tool.

For example, a user asks:

> "Tell me the weather in Delhi."

The model may decide that it needs a weather tool. It returns a
structured tool-call request such as:

``` json
{
  "name": "getWeather",
  "args": {
    "city": "Delhi"
  }
}
```

The **Node.js backend**, not the model, executes the actual JavaScript
function.

### ⭐ Remember

-   The LLM decides **which tool may be useful** and provides arguments.
-   The backend validates the request and executes the trusted function.
-   The backend sends the tool result back to the model.
-   The model can then produce a natural-language response.

**The model does not automatically execute your local JavaScript code.**

------------------------------------------------------------------------

## 🎯 2. Why Do We Need It?

An LLM cannot automatically access every private database, internal API,
or local function in our application.

Tool calling connects model reasoning with application capabilities.

  Use case               Possible tool
  ---------------------- --------------------------------
  Weather assistant      `getWeather(city)`
  E-commerce assistant   `getOrderStatus(orderId)`
  Banking assistant      `getAccountBalance(userId)`
  Calendar assistant     `createCalendarEvent(details)`
  Support assistant      `searchSupportTickets(query)`
  Learning assistant     `searchCourse(topic)`

### Without tools

The model may only answer from the information available in its context
and learned knowledge.

### With tools

The model can request that the backend retrieve or act on external
application data, subject to backend validation and permissions.

------------------------------------------------------------------------

## 🔄 3. How Tool Calling Works

``` mermaid
flowchart TD
    A[User asks a question] --> B[Node.js backend sends prompt and tool definitions]
    B --> C[LLM decides whether a tool is needed]
    C --> D{Tool call returned?}
    D -- No --> E[Return normal model response]
    D -- Yes --> F[Backend validates tool name and arguments]
    F --> G[Backend executes trusted function]
    G --> H[Backend sends tool result to LLM]
    H --> I[LLM creates final response]
    I --> J[Return answer to user]
```

### Step-by-step

1.  The user sends a request.
2.  The backend sends the prompt and available tool definitions to
    Gemini.
3.  Gemini may return a normal text response or one or more function
    calls.
4.  The backend reads the function name and arguments.
5.  The backend validates and executes the corresponding local function.
6.  The backend sends the function result to Gemini.
7.  Gemini uses the result to prepare a final response.

------------------------------------------------------------------------

## 🧩 4. Important Components

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  Tool definition                     Describes the tool name, purpose,
                                      and input schema

  Backend function                    Contains the actual application
                                      logic

  Function call                       Model-generated request to use a
                                      tool

  Arguments                           Input values selected by the model

  Tool call ID                        Identifier associated with a tool
                                      call

  Function response                   Result returned by the backend

  Final response                      Model's user-facing answer after
                                      receiving tool results
  -----------------------------------------------------------------------

### Tool definition vs backend function

These are different things.

**Tool definition** tells the model what it can request:

``` ts
const getWeatherTool = {
  name: "getWeather",
  description: "Get weather information for a given city.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "Name of the city",
      },
    },
    required: ["city"],
  },
};
```

**Backend function** performs the actual work:

``` ts
async function getWeather(city: string) {
  console.log(`Fetching weather for ${city}...`);

  return {
    city,
    temperature: 28,
    condition: "Sunny",
    humidity: "60%",
  };
}
```

> ⚠️ The example above returns **mock/hardcoded data**. It is not a live
> weather API integration.

------------------------------------------------------------------------

## 🛠️ 5. Project Setup

The learning project used Node.js, TypeScript, and Google's
JavaScript/TypeScript SDK.

``` bash
npm init -y
npm install @google/genai dotenv
npm install -D typescript tsx @types/node
npx tsc --init
```

### Suggested structure

``` text
04-tool-calling/
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── index.ts
```

### `.env`

``` env
GEMINI_API_KEY=your_api_key_here
```

Never commit `.env` or expose the API key in frontend code, logs,
screenshots, or a public repository.

### `.gitignore`

``` gitignore
node_modules
.env
dist
```

### Initialize Gemini

``` ts
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

------------------------------------------------------------------------

## 🔧 6. Single Tool Calling

### Step 1 --- Define the tool

``` ts
const getWeatherTool = {
  name: "getWeather",
  description: "Get weather information for a given city.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "Name of the city",
      },
    },
    required: ["city"],
  },
};
```

### Step 2 --- Create the backend function

``` ts
async function getWeather(city: string) {
  console.log(`Fetching weather for ${city}...`);

  return {
    city,
    temperature: 28,
    condition: "Sunny",
    humidity: "60%",
  };
}
```

### Step 3 --- Ask Gemini to consider the tool

``` ts
const userPrompt = "Tell me the current weather in Delhi.";

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: userPrompt,
  config: {
    tools: [
      {
        functionDeclarations: [getWeatherTool],
      },
    ],
  },
});
```

### Step 4 --- Read the model's function call

``` ts
const functionCall = response.functionCalls?.[0];

if (!functionCall) {
  console.log(response.text);
  return;
}

console.log("Tool requested:", functionCall.name);
console.log("Arguments:", functionCall.args);
```

Gemini may return a function call containing a name, arguments, and an
ID. The backend must inspect this request before execution.

### Step 5 --- Execute the trusted function

``` ts
if (functionCall.name === "getWeather") {
  const city = String(functionCall.args?.city ?? "");
  const weatherData = await getWeather(city);

  console.log(weatherData);
}
```

This is a learning example. Production code should validate the
arguments and use an explicit tool registry/dispatcher.

------------------------------------------------------------------------

## 🪪 7. Understanding Tool Call IDs

A tool call may look like:

``` json
{
  "name": "getWeather",
  "args": {
    "city": "Delhi"
  },
  "id": "call_14666035807179301702"
}
```

### Who creates the ID?

The API/model response supplies the ID. The developer does not manually
invent it for that returned call.

### Why is it useful?

-   It identifies a particular tool call.
-   It helps associate a tool result with the correct request.
-   When multiple tool calls are returned, preserve the corresponding
    IDs when sending their results back, where the API format supports
    them.

Do not assume that every provider uses the same field names or message
format.

------------------------------------------------------------------------

## 📩 8. Returning Tool Results to Gemini

Executing the backend function is not the end of the tool-calling cycle.
The backend must return the result to Gemini so the model can formulate
its final response.

The learning implementation used the model's returned content and a
function response:

``` ts
const modelContent = response.candidates?.[0]?.content;

if (!modelContent) {
  throw new Error("Gemini model response content is missing.");
}

const finalResponse = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: [
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
    modelContent,
    {
      role: "user",
      parts: [
        {
          functionResponse: {
            name: functionCall.name,
            response: weatherData,
          },
        },
      ],
    },
  ],
});

console.log(finalResponse.text);
```

### Data flow

``` mermaid
sequenceDiagram
    participant U as User
    participant B as Node.js Backend
    participant L as Gemini
    participant T as Backend Tool

    U->>B: Ask for Delhi weather
    B->>L: Prompt + tool definition
    L-->>B: getWeather(city=Delhi)
    B->>T: Execute getWeather("Delhi")
    T-->>B: Weather result
    B->>L: Tool result + tool-call context
    L-->>B: Final natural-language response
    B-->>U: Weather answer
```

**Important:** The model can describe the result it receives, but it
does not independently verify whether your backend's data is accurate.
Use reliable data sources and validate important outputs.

------------------------------------------------------------------------

## 🧰 9. Multiple Tool Calling

A model can request more than one tool for a single user request.

Example user request:

> "Tell me the weather, current time, and population of Delhi. Use all
> three available tools."

Available tools:

``` ts
const tools = [
  getWeatherTool,
  getCurrentTimeTool,
  getPopulationTool,
];
```

Backend functions in the learning project:

``` ts
async function getWeather(city: string) {
  return {
    city,
    temperature: 28,
    condition: "Sunny",
    humidity: "60%",
  };
}

async function getCurrentTime(city: string) {
  return {
    city,
    currentTime: "05:30 PM",
    timezone: "Asia/Kolkata",
  };
}

async function getPopulation(city: string) {
  return {
    city,
    population: "Approximately 3.3 crore",
  };
}
```

> ⚠️ These are mock values used to learn orchestration. The time and
> population values are not live or verified data.

### Read all function calls

``` ts
const functionCalls = response.functionCalls ?? [];

if (functionCalls.length === 0) {
  console.log(response.text);
  return;
}
```

### Execute and collect tool responses

The learning implementation used a `for...of` loop and a `switch`
statement:

``` ts
const functionResponses = [];

for (const functionCall of functionCalls) {
  const args = functionCall.args ?? {};
  const city = String(args.city ?? "");

  if (!city.trim()) {
    throw new Error("City argument is missing.");
  }

  let result;

  switch (functionCall.name) {
    case "getWeather":
      result = await getWeather(city);
      break;

    case "getCurrentTime":
      result = await getCurrentTime(city);
      break;

    case "getPopulation":
      result = await getPopulation(city);
      break;

    default:
      throw new Error(`Unknown tool: ${functionCall.name}`);
  }

  functionResponses.push({
    functionResponse: {
      name: functionCall.name,
      id: functionCall.id,
      response: result,
    },
  });
}
```

### What happens here?

1.  `functionCalls` contains the tool requests returned by Gemini.
2.  The loop processes each call.
3.  The backend reads its arguments.
4.  The `switch` selects the trusted function.
5.  `await` waits for that function to finish.
6.  `functionResponses.push()` stores the result and associated call
    information.

The example is sequential because each operation is awaited inside the
loop.

------------------------------------------------------------------------

## ⚡ 10. Sequential vs Parallel Execution

### Sequential execution

Tasks run one after another. The next task starts after the current
awaited task completes.

``` ts
const weather = await getWeather("Delhi");
const time = await getCurrentTime("Delhi");
const population = await getPopulation("Delhi");
```

If each independent operation takes about 2 seconds, the total is
approximately 6 seconds.

### Parallel execution

Independent operations are started together:

``` ts
const [weather, time, population] = await Promise.all([
  getWeather("Delhi"),
  getCurrentTime("Delhi"),
  getPopulation("Delhi"),
]);
```

If all three take about 2 seconds, the total is approximately 2 seconds,
excluding overhead.

### Visual comparison

``` mermaid
flowchart TD
    A[Start three independent operations]
    A --> B[Sequential]
    A --> C[Parallel]
    B --> D[Weather completes]
    D --> E[Time completes]
    E --> F[Population completes]
    C --> G[Weather, Time and Population start together]
    G --> H[Wait for all results]
```

### When should we use which?

  -----------------------------------------------------------------------
  Situation                           Better approach
  ----------------------------------- -----------------------------------
  Tasks are independent               Parallel

  Task B needs Task A's result        Sequential

  Operations must happen in a         Sequential
  specific order                      

  Independent read-only API calls     Often parallel

  Multiple writes with shared state   Analyze dependencies and
                                      consistency first
  -----------------------------------------------------------------------

### `Promise.all()` vs `Promise.allSettled()`

-   `Promise.all()` fulfills when all promises fulfill. If one rejects,
    the aggregate promise rejects; other started operations are not
    automatically cancelled.
-   `Promise.allSettled()` waits until every promise settles and returns
    each outcome as fulfilled or rejected.

``` ts
const outcomes = await Promise.allSettled([
  getWeather("Delhi"),
  getCurrentTime("Delhi"),
  getPopulation("Delhi"),
]);

for (const outcome of outcomes) {
  if (outcome.status === "fulfilled") {
    console.log("Success:", outcome.value);
  } else {
    console.error("Failure:", outcome.reason);
  }
}
```

Use `Promise.allSettled()` when you need to preserve successful results
even if one independent operation fails.

------------------------------------------------------------------------

## 🛡️ 11. Error Handling and Edge Cases

A production tool-calling backend must expect invalid model output, tool
failures, network problems, and unexpected situations.

### 11.1 Invalid tool arguments

Example invalid request:

``` ts
{
  name: "getWeather",
  args: {
    city: "   "
  }
}
```

Validate untrusted input before calling the real service:

``` ts
function validateCity(city: unknown): string {
  if (typeof city !== "string") {
    throw new Error("City must be a string.");
  }

  const trimmedCity = city.trim();

  if (!trimmedCity) {
    throw new Error("City cannot be empty.");
  }

  return trimmedCity;
}
```

**Key point:** A schema in the tool definition guides model output.
Backend validation is still required.

### 11.2 Unknown tool name

Gemini might return a tool name that the backend does not recognize.

``` ts
switch (functionCall.name) {
  case "getWeather":
    result = await getWeather(city);
    break;

  case "getCurrentTime":
    result = await getCurrentTime(city);
    break;

  default:
    result = {
      success: false,
      error: "This tool is not available.",
    };
    break;
}
```

Never dynamically execute arbitrary model-provided names with `eval()`
or similar mechanisms. Use an explicit allowlist/registry.

### 11.3 Tool execution failure

An external API may return an error or the network request may fail.

``` ts
async function getWeather(city: string) {
  try {
    const response = await fetch(
      `https://api.example.com/weather?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Weather tool failed:", error);

    return {
      success: false,
      error: "Unable to fetch weather information.",
    };
  }
}
```

`fetch()` normally does **not** reject just because the server returned
HTTP 400 or 500. Check `response.ok`.

The example API domain is a placeholder, not a real service.

### 11.4 API timeout

A timeout prevents the backend from waiting indefinitely for a slow
external service.

``` ts
async function getWeatherWithTimeout(city: string) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(
      `https://api.example.com/weather?city=${encodeURIComponent(city)}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Weather API request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

-   `AbortController` creates a cancellation controller.
-   `signal` connects the controller to `fetch()`.
-   `abort()` requests cancellation.
-   `finally` clears the timer whether the request succeeds or fails.

A client-side abort does not guarantee that the remote server stopped
processing a request it already received.

------------------------------------------------------------------------

## 🔁 12. Retry Mechanism and Exponential Backoff

### What is retry?

Retry means attempting an operation again after a failure.

Retries are useful for temporary failures, but not every error should be
retried.

  Failure                   Typical approach
  ------------------------- ---------------------------------------------
  Temporary network error   Retry may help
  HTTP 500 / 503            Retry may help
  HTTP 429                  Respect `Retry-After` and rate limits
  HTTP 400                  Usually do not retry unchanged request
  HTTP 401                  Fix authentication; do not blindly retry
  Invalid arguments         Correct input; do not retry unchanged input

### Exponential backoff

Increase the delay between attempts:

-   After first failed attempt: wait 1 second.
-   After second failed attempt: wait 2 seconds.
-   After third failed attempt: wait 4 seconds.

### Reusable learning example

``` ts
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}`);
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.log(`Retrying after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Operation failed.");
}
```

Usage:

``` ts
const weather = await retry(
  () => getWeather("Delhi"),
  3
);
```

> ⚠️ This is a basic teaching example: it retries every thrown error. A
> production retry helper should classify retryable errors, apply a
> maximum delay and jitter, respect `Retry-After`, and enforce an
> overall deadline.

### Important: idempotency

Do not blindly retry operations that may create duplicate side effects.

For example, retrying a payment charge or order creation could
accidentally perform the action twice. Use idempotency keys and
server-side deduplication where appropriate.

------------------------------------------------------------------------

## 🔐 13. Production Safety Checklist

Before executing a tool call, a robust backend should consider:

-   [ ] **Allowlist:** Is the requested tool registered and permitted?
-   [ ] **Validation:** Are all arguments the correct type and within
    allowed limits?
-   [ ] **Authentication:** Is the user authenticated?
-   [ ] **Authorization:** Is this user allowed to perform this action?
-   [ ] **Least privilege:** Does the tool have only the permissions it
    needs?
-   [ ] **Timeout:** Is there a bounded execution time?
-   [ ] **Error handling:** Are failures handled without leaking secrets
    or stack traces?
-   [ ] **Retry policy:** Is the failure transient and the operation
    safe to retry?
-   [ ] **Idempotency:** Can repeated calls create duplicate side
    effects?
-   [ ] **Rate limiting:** Can a user or model trigger excessive calls?
-   [ ] **Logging:** Are tool name, duration, outcome, and correlation
    IDs logged safely?
-   [ ] **Human approval:** Do sensitive or irreversible actions require
    confirmation?

### Tool calling is not authorization

Even if the model requests `deleteAccount`, the backend must
independently verify permissions and any required user confirmation.
Never treat model intent as proof of user authorization.

------------------------------------------------------------------------

## 💡 14. Important Concepts

  -----------------------------------------------------------------------
  Term                                Meaning
  ----------------------------------- -----------------------------------
  Tool Calling                        Model requests a backend capability

  Tool Definition                     Description/schema shown to the
                                      model

  Backend Function                    Actual code that performs the task

  Function Arguments                  Model-provided input values

  Tool Call ID                        Identifier for a specific call

  Dispatcher                          Backend logic that routes a call to
                                      an allowed function

  Sequential Execution                Run tasks one after another

  Parallel Execution                  Start independent tasks together

  `Promise.all()`                     Wait for all promises; rejects if
                                      one rejects

  `Promise.allSettled()`              Collect every promise's outcome

  Timeout                             Maximum time allowed for an
                                      operation

  Retry                               Attempt an operation again

  Exponential Backoff                 Increase the wait between retries

  Idempotency                         Repeating an operation does not
                                      create additional unintended
                                      effects
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## ⚡ 15. Quick Revision

1.  The LLM requests a tool; the backend executes it.
2.  Tool definitions describe capabilities; they do not contain the
    actual implementation.
3.  Validate all model-generated arguments on the backend.
4.  Use an allowlist or dispatcher for tool execution.
5.  Preserve tool-call IDs and match results to their calls using the
    provider's expected format.
6.  Sequential execution waits for each task before starting the next.
7.  Parallel execution is useful for independent tasks.
8.  `Promise.all()` rejects when one input promise rejects; it does not
    automatically cancel the other operations.
9.  `Promise.allSettled()` helps collect partial successes and failures.
10. Check `response.ok` when using `fetch()`.
11. Use timeouts to bound external requests.
12. Retry only appropriate transient failures.
13. Use idempotency protection for side-effecting operations.
14. Never expose API keys, secrets, or internal stack traces to the
    model or end user.

------------------------------------------------------------------------

## 🧪 16. Practice Challenges

### Beginner

-   [ ] Add a `getPopulation()` tool.
-   [ ] Add a `getCurrentTime()` tool.
-   [ ] Ask Gemini to use all three tools.
-   [ ] Print each tool call name and arguments.

### Intermediate

-   [ ] Extract tool execution into a reusable `executeTool()` function.
-   [ ] Validate arguments before execution.
-   [ ] Handle unknown tool names safely.
-   [ ] Add a timeout to an external API request.
-   [ ] Compare sequential execution with `Promise.all()`.

### Advanced

-   [ ] Use `Promise.allSettled()` to preserve partial results.
-   [ ] Add retry classification and exponential backoff with jitter.
-   [ ] Add an overall execution deadline.
-   [ ] Add rate limiting and per-user authorization.
-   [ ] Prevent duplicate side effects using idempotency keys.
-   [ ] Log tool execution duration, status, and correlation IDs.
-   [ ] Require confirmation for sensitive actions.

------------------------------------------------------------------------

## 📈 17. Progress Tracker

This tracker reflects the concepts covered in the learning sessions. A
topic marked **Covered** means it was explained; it does not necessarily
mean a complete production implementation has been built.

### Covered

-   [x] What is Tool Calling?
-   [x] Tool Calling architecture
-   [x] Tool definitions and backend functions
-   [x] Gemini tool-call request and arguments
-   [x] Tool call IDs
-   [x] Single Tool Calling
-   [x] Sending tool results back to Gemini
-   [x] Multiple Tool Calling
-   [x] Sequential vs Parallel execution concepts
-   [x] Invalid tool arguments
-   [x] Unknown tool names
-   [x] Tool execution failure
-   [x] API timeout concept and `AbortController`
-   [x] Retry concept and basic exponential backoff

### Still to study / implement

-   [ ] Full parallel execution refactor in the project
-   [ ] Partial tool failure handling end-to-end
-   [ ] Duplicate tool-call handling
-   [ ] Safe tool dispatcher and production authorization
-   [ ] Robust retry classification, jitter, and deadlines
-   [ ] Production-grade logging and monitoring

------------------------------------------------------------------------

```{=html}
<p align="center">
```
### 💻 Learn • Build • Test • Improve

**LLM Engineering Journey --- Node.js + TypeScript**

*Build reliable AI backends, one concept at a time.*

```{=html}
</p>
```
