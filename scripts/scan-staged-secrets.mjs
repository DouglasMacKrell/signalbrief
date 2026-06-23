#!/usr/bin/env node
/**
 * Scans staged (or all tracked) files for secrets, credentials, and common PII leaks.
 * Used by Husky pre-commit and CI. Fails closed on any match.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { relative } from "node:path";

const scanAll = process.argv.includes("--all");

const ALLOWLIST = new Set([
  ".env.example",
  "scripts/scan-staged-secrets.mjs",
  "package-lock.json",
]);

const ALLOWLIST_PREFIXES = [
  "node_modules/",
  ".next/",
  "drizzle/meta/",
  ".github/workflows/",
];

const RULES = [
  {
    name: "GitHub token",
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    name: "OpenAI / Anthropic-style API key",
    pattern: /\bsk-[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "AWS access key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: "Private key block",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: "Database URL with password",
    pattern: /postgres(?:ql)?:\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+/gi,
    skipInAllowlist: true,
  },
  {
    name: "Bearer token (long)",
    pattern: /\bBearer\s+[A-Za-z0-9\-._~+/]{32,}=*\b/gi,
  },
  {
    name: "macOS home path",
    pattern: /\/Users\/[A-Za-z0-9._-]+\/(?:Development|Documents|Desktop|\.ssh|\.aws|\.config)/g,
  },
  {
    name: "Windows user path",
    pattern: /C:\\Users\\[A-Za-z0-9._-]+\\/gi,
  },
  {
    name: "SSN pattern",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    name: "Render internal DB URL marker",
    pattern: /postgresql:\/\/[^\s]+@dpg-[a-z0-9-]+\.frankfurt-postgres\.render\.com/gi,
  },
];

function getFilesToScan() {
  const cmd = scanAll
    ? "git ls-files"
    : "git diff --cached --name-only --diff-filter=ACM";
  const output = execSync(cmd, { encoding: "utf8" }).trim();
  if (!output) return [];
  return output.split("\n").filter(Boolean);
}

function isAllowlisted(filePath) {
  if (ALLOWLIST.has(filePath)) return true;
  return ALLOWLIST_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function scanFile(filePath) {
  if (!existsSync(filePath)) return [];
  if (isAllowlisted(filePath)) return [];

  const content = readFileSync(filePath, "utf8");
  const findings = [];

  for (const rule of RULES) {
    if (rule.skipInAllowlist && isAllowlisted(filePath)) continue;
    rule.pattern.lastIndex = 0;
    const match = rule.pattern.exec(content);
    if (match) {
      const line = content.slice(0, match.index).split("\n").length;
      findings.push({
        file: filePath,
        rule: rule.name,
        line,
        excerpt: match[0].slice(0, 40) + (match[0].length > 40 ? "…" : ""),
      });
    }
  }

  return findings;
}

function main() {
  const files = getFilesToScan();

  if (files.length === 0) {
    if (!scanAll) {
      console.log("security:scan — no staged files to scan");
    }
    process.exit(0);
  }

  const allFindings = [];
  for (const file of files) {
    allFindings.push(...scanFile(file));
  }

  if (allFindings.length === 0) {
    console.log(`security:scan — OK (${files.length} file(s))`);
    process.exit(0);
  }

  console.error("\n⛔ Secret / PII scan failed. Commit blocked.\n");
  for (const f of allFindings) {
    console.error(`  ${relative(process.cwd(), f.file)}:${f.line} [${f.rule}]`);
    console.error(`    matched: ${f.excerpt}\n`);
  }
  console.error("Remove or redact sensitive data, then commit again.");
  console.error("To scan manually: npm run security:scan\n");
  process.exit(1);
}

main();
