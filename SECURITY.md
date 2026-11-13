# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in cDoc, please
report it privately. **Do not open a public GitHub issue.**

Email **mosestosyn07@gmail.com** with:

- A description of the issue and its potential impact
- The version affected (`cdoc --version`) and your Node version
  (`node --version`)
- Steps to reproduce, or a proof of concept
- Any suggested fix, if you have one

You should receive an acknowledgement within a few days. Once the issue is
confirmed, we will work on a fix and coordinate disclosure with you, giving you
credit for the report if you want it.

## Scope

In scope:

- The `cdoc` CLI (`packages/cli`) — for example, a path traversal or
  command injection in how it reads project files, or a check that reports a
  secret value back to the terminal or into `--json` output
- The marketing site and `/docs` route (`apps/web`) — for example, XSS, an
  injection into rendered output, or a misconfiguration that exposes data

Out of scope:

- Vulnerabilities in dependencies of the site that have no cDoc-specific
  integration — report those upstream
- Reports that require a user to deliberately run untrusted code through the
  CLI
- Social engineering, physical attacks, or denial-of-service testing against
  the GitHub or npm infrastructure

## Design commitments that matter for security

These are properties the project intends to uphold; a change that breaks one of
them is itself a security bug:

- **The CLI never uploads anything.** It runs entirely on the local machine.
- **Environment files are never read.** The environment check inspects only
  whether files exist, whether `.gitignore` covers them, and whether git tracks
  them — never their contents.
- **Secret scanning never prints matches.** Findings name the file and the
  pattern category, not the matched text.
- **Zero runtime dependencies in the CLI.** The Node standard library only, so
  the supply-chain surface is limited to this repository.

## Supported versions

Only the latest published release receives security fixes.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |
