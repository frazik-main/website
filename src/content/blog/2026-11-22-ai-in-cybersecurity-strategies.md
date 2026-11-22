---
title: "AI in Cybersecurity: Strategies That Work Now"
date: 2026-11-22 09:00:00
description: "Where AI genuinely helps defenders today, which new approaches are ready for real use, and how to adopt them without handing enforcement to a model."
tags: AI security, cybersecurity strategy, agentic AI, SOC, detection engineering
categories: Cybersecurity
---

Most discussions of AI in cybersecurity swing between two claims: that models will soon defend networks on their own, and that they are an expensive distraction. Neither helps anyone decide what to run on Monday.

The useful question is narrower. AI is a set of capabilities that fit at specific points in a security workflow. Some of those points are now practical because models follow structured instructions, call tools, and handle long context at a cost that makes per-alert enrichment viable. Others remain demos with a dashboard.

This is a strategy map: where AI earns its place, which new approaches are usable now, and what must stay deterministic.

## The principle: models advise, systems enforce

Security is a chain of decisions: what exists, what is exposed, what is normal, what changed, what matters, and what to do. AI is strongest in the middle of that chain, where the work is reading, summarizing, correlating, and explaining. It is weakest at the ends, where ground truth is established and irreversible actions are taken.

That suggests a durable split:

- **Deterministic systems establish facts.** Asset inventory, identity, configuration, signatures, network policy, and authorization are enforced by code and tested.
- **Models interpret those facts.** They summarize evidence, propose hypotheses, draft queries and rules, and rank findings.
- **Humans own consequential decisions.** Isolating a host, revoking access, changing a firewall rule, or accepting risk stays with an accountable person.

The split matters because model output is probabilistic and can be influenced by its input. A log line, a document, a hostname, or a web page can contain adversarial text. Any design where untrusted content can influence enforcement is not an AI strategy; it is a new attack path.

## Strategy 1: Compress alert-to-evidence, not alert-to-action

The expensive part of security operations is not seeing an alert. It is assembling enough context to decide whether it matters: which asset, which identity, what changed recently, whether the behavior is normal for that peer group, and what the last three similar incidents concluded.

That work suits a bounded agent. Give it read-only tools: query the endpoint platform, look up the identity provider, search the ticket system, retrieve asset ownership, pull prior incidents. Give it a schema for the answer: timeline, affected entities, evidence for and against, open questions, and a recommended next step. Scope every tool to the minimum data it needs, rate-limit it, and log every call.

What changed: tool calling and structured outputs are reliable enough for this pattern, and inference is cheap enough to run per alert rather than once a day. Local and quantized models make it possible to keep telemetry inside the organization, although a smaller model narrows the tasks it can handle well. Standardized tool connectors, such as Model Context Protocol (MCP) servers, reduce integration work, but each server becomes a supply-chain dependency with its own credentials and permissions.

What has not changed: the connectors are the hard part. Asset data quality, deduplication, identity resolution, and the definition of normal still decide whether a summary is useful. An agent over a bad inventory produces confident nonsense faster.

The guardrail is simple: the agent never closes, blocks, or isolates. It produces a case file. A human sees it before anything irreversible happens.

## Strategy 2: Treat detection content as code, with AI as the junior author

Detection engineering has the right shape for AI assistance: a clear artifact, a testable target, and a review process. A model can draft a Sigma rule from an incident write-up, translate it between query languages, explain which ATT&CK technique it covers, and suggest which fields will drive false positives.

The useful new practice is not "generate more rules." It is the loop around the rule:

1. Write the detection intent in plain language and link it to a technique or incident.
2. Generate a first draft.
3. Validate syntax and schema in CI.
4. Replay representative telemetry and assert expected matches.
5. Test known-benign activity for false positives.
6. Record the owner, data source, and review or expiry date.

What changed: models are good enough to produce a plausible first draft and to explain unfamiliar query languages. Detection-as-code pipelines make it possible to reject bad drafts automatically.

The failure mode is a repository of rules nobody understands, each producing alerts nobody triages. A model can help write and tune; it cannot supply the operational ownership that makes a rule real.

## Strategy 3: Prioritize exposure with context, not scores

Vulnerability management is saturated with findings and starved of context. A CVSS score describes how bad a defect could be in the abstract. It does not say whether the vulnerable function is reachable, whether the service is internet-facing, whether the data behind it matters, or whether an exploit is being used against systems like ours.

AI helps in three places:

- Summarizing advisories and vendor guidance into a short, comparable form.
- Tracing dependency and call paths to support or challenge reachability claims.
- Drafting a remediation plan that respects ownership, change windows, and compensating controls.

What changed: code-aware models can reason over a repository, an SBOM, and infrastructure definitions together, which makes reachability analysis more practical for teams without a dedicated product security group. Agentic tools can follow references across files instead of relying on a single prompt.

The limit: a model's claim that a path is unreachable is a hypothesis, not a proof. Validate it with the scanner, the compiler, runtime telemetry, or a focused test. Keep deterministic scanners as the source of facts and let the model improve the order of work.

## Strategy 4: Review AI-generated code as a security boundary

The fastest-growing source of new attack surface is software written with AI assistance. The defects are familiar — missing authorization checks, secrets in client-side code, permissive CORS, unsafe defaults, missing tenant isolation — but they arrive faster and with more confidence.

A practical response is to add AI-specific review to the pipeline:

- Check that authorization is enforced server-side, not in a prompt or a user interface.
- Look for secrets and internal endpoints in generated front-end bundles.
- Verify that database row-level security and tenant filters are actually applied.
- Treat generated infrastructure code as production code: review network exposure, IAM scope, and public storage.
- Require tests for permission boundaries, not just happy paths.

A model can help review this at scale, but it should not be the only reviewer of code it helped write. Use deterministic checks for defect classes that are cheap to detect, and human review for the ones that require understanding intent.

## Strategy 5: Defend the human channel against synthetic media

AI has made phishing cheaper and impersonation more convincing. Voice cloning and realistic video remove the cues that older awareness training relied on. The strategic answer is not a better deepfake detector; detection is adversarial and probabilistic.

The usable controls are procedural:

- Verify money movement, credential resets, and access changes through a separate channel with a known identity.
- Require callback verification for bank-detail changes and urgent payment requests.
- Bind trust to devices and identities, not to the appearance of a caller.
- Use content provenance signals where they exist, but do not treat them as proof.
- Train people to verify, not to spot artifacts.

What changed is the cost of synthetic voice and video, which now reaches ordinary employees rather than only executives. What must change is the process around high-consequence requests.

## New approaches that are ready, and their conditions

A short list of patterns worth piloting now, each with the condition that makes it safe:

**Read-only triage agents.** Ready when tool permissions are narrow and the output is a reviewed case file. Not ready for autonomous containment.

**Detection co-pilots with replay tests.** Ready when the pipeline can reject invalid or untested rules. Not ready as a replacement for detection ownership.

**Context-aware vulnerability prioritization.** Ready when scanners supply ground truth and reachability claims are verified. Not ready as the sole basis for accepting risk.

**AI-assisted threat modeling.** Ready as a brainstorming and coverage tool: describe the architecture, ask for trust boundaries, abuse cases, and missing controls, then have engineers confirm. Not ready as an oracle.

**Natural-language analytics over security data.** Ready with read-only credentials, query limits, cost controls, and an allow-list of tables. Not ready with write access or unrestricted production queries.

**Small local models for sensitive classification.** Ready for narrow tasks such as log clustering, DLP triage, and summarizing alerts that cannot leave the environment. Not ready as a general analyst replacement.

**Scoped offensive agents.** Ready for authorized, sandboxed testing with defined rules of engagement, no destructive actions, and human supervision. Not ready for unattended production exploitation.

**Control mapping and evidence drafting.** Ready to map existing evidence to frameworks and to draft audit narratives, with a human validating every claim. Not ready to certify compliance.

## Secure the assistant itself

An AI capability inside a security program is also a system that must be secured. The main risks are ordinary ones with new names:

- **Prompt injection through telemetry.** Logs, documents, emails, and web content are untrusted input. Keep instructions and data separated, and never let retrieved text grant permissions or define tool behavior.
- **Over-broad agent credentials.** An agent that can read everything and write anywhere turns a prompt mistake into an incident. Use dedicated service identities, least privilege, and short-lived tokens.
- **Tool and model supply chain.** Every model, connector, and plugin is a dependency. Pin versions, verify sources, and record what changed.
- **Data leakage through prompts and logs.** Redact sensitive fields, restrict retention, and apply the same egress policy to the AI path as to any other outbound connection.
- **Evaluation drift.** Re-test abuse cases when the model, prompt, tools, or retrieval sources change. A previously safe configuration is not permanently safe.

These controls are not exotic. They are the same principles already applied to production systems, extended to a component that reads natural language and calls tools.

## What to measure

Model accuracy is a weak proxy for security value. Measure the workflow:

- Time from alert to a correct disposition.
- Percentage of alerts enriched automatically and sampled for quality.
- False-positive rate against a known-good baseline.
- Time to detect a new technique after threat intelligence arrives.
- Number of enforcement changes rolled back.
- Cost per investigated alert, including inference and engineering time.
- How often an analyst overrides the model, and whether the override was right.

The last metric is the most honest. A system that analysts quietly ignore has failed regardless of its benchmark scores.

## An adoption path

1. **Fix the fundamentals first.** Asset inventory, identity, centralized logging, backups, patching, and a tested recovery path. AI cannot compensate for missing telemetry.
2. **Assist, read-only.** Start with enrichment, summarization, query drafting, and documentation. Keep a human in the loop and sample output for quality.
3. **Automate reversible steps.** Ticket routing, deduplication, evidence collection, and draft reports. Require approval for anything that changes access or availability.
4. **Allow narrow autonomy.** Only in bounded, observable, reversible domains with a rollback path and a named owner. Malware sandbox enrichment or duplicate alert suppression are better first candidates than host isolation.

Each stage needs an exit criterion and a rollback plan. If the model disappears, the security controls must still work.

## The part that does not change

Attackers get the same models. They can write phishing faster, generate malware variants, map defenses, and automate reconnaissance. The advantage does not come from having a better model. It comes from better data, tighter permissions, faster feedback, and the discipline to keep consequential actions under human control.

The new approaches are real, but they are narrow. The winning strategy is unglamorous: instrument the environment, constrain the tools, measure decisions instead of demos, and let AI shorten the distance from signal to understanding while deterministic systems keep doing the jobs they were always better at.
