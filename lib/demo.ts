export const DEMO_CODE = `async function fetchUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  const result = await db.query(query);

  const password = result[0].password;
  console.log("User password:", password);

  return {
    id: result[0].id,
    name: result[0].name,
    email: result[0].email,
    password: password
  };
}

async function updateUser(userId, data) {
  await db.query(\`UPDATE users SET \${JSON.stringify(data)} WHERE id=\${userId}\`);
  return true;
}`;

export const DEMO_REVIEW = `## Code Review

### Summary
This code has **critical security vulnerabilities** that must be fixed before production use. Two SQL injection attack vectors, sensitive data exposure, and missing error handling were identified.

---

### Issues Found

#### 🔴 Critical

**SQL Injection — \`fetchUserData\`**
String concatenation builds SQL queries directly from user input. An attacker can pass \`1 OR 1=1\` as \`userId\` to dump the entire users table.
\`\`\`diff
- const query = "SELECT * FROM users WHERE id = " + userId;
+ const query = "SELECT id, name, email FROM users WHERE id = ?";
+ const result = await db.query(query, [userId]);
\`\`\`

**SQL Injection — \`updateUser\`**
Same issue: both \`data\` and \`userId\` are interpolated directly into a template literal. \`JSON.stringify\` does not sanitise SQL.

**Sensitive Data Exposure**
\`password\` is logged to \`console.log\` and returned to callers. Passwords must never appear in logs or API responses — even if hashed.

---

#### 🟡 Warning

**Missing Error Handling**
Neither function has try/catch. A DB failure will crash the caller with an unhandled promise rejection and leak internal stack traces.

**Over-fetching (\`SELECT *\`)**
Selecting all columns returns more data than needed and will silently include future columns (e.g. \`mfa_secret\`, \`reset_token\`). Enumerate columns explicitly.

---

#### 🟢 Info

**No Input Validation**
\`userId\` is not validated to be a number/UUID before use. Add a guard at the top of each function.

**Return Shape Leaks Schema**
The returned object mirrors the DB row structure. Define an explicit return type so the schema can change without breaking consumers.

---

### Recommendations

1. Use parameterised queries (or an ORM like Prisma/Drizzle) for all DB access.
2. Remove \`password\` from all logs and return values; use a DTO layer.
3. Wrap both functions in try/catch and surface structured errors.
4. Define TypeScript types for parameters and return values.`;

export const DEMO_LANGUAGE = "JavaScript";
