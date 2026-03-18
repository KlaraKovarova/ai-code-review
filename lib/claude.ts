import Anthropic from "@anthropic-ai/sdk";

export async function reviewCode(
  code: string,
  language: string,
  focus: string[],
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const focusStr =
    focus.length > 0
      ? `Focus especially on: ${focus.join(", ")}.`
      : "Cover all aspects: bugs, security, performance, and style.";

  const prompt = `You are a senior software engineer performing a thorough code review.

Review the following ${language ? `${language} ` : ""}code and return a structured markdown report.

${focusStr}

Format your response EXACTLY like this:

## Code Review

### Summary
[2-3 sentence overview of code quality and the most important findings]

---

### Issues Found

#### 🔴 Critical
[List critical bugs and security vulnerabilities. Use bold for issue name, then description. Include a diff or fix suggestion where helpful. If none, write "None found."]

#### 🟡 Warning
[List warnings: performance issues, logic errors, missing error handling, etc. If none, write "None found."]

#### 🟢 Info
[List suggestions: style, naming, type safety, minor improvements. If none, write "None found."]

---

### Recommendations
[Numbered list of the top 3-5 actionable improvements, most important first]

Be specific. Reference line numbers or variable names. Provide fix suggestions (diffs preferred) for critical and warning issues.

Code to review:
\`\`\`${language.toLowerCase()}
${code}
\`\`\``;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
