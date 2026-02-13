# QA Squad

> Quality Assurance, Validation & Audits

## Mission

Maintain high quality standards across all Travel Tech Digital deliverables through systematic validation, audits, and continuous improvement.

## Agents

| Agent | Name | Role |
|-------|------|------|
| `qa-lead` | **Shield** | Quality gates, DoD, standards |
| `content-reviewer` | **Echo** | Copy review, claims, CTAs |
| `process-auditor` | **Audit** | Process validation, logs, costs |

## Commands

### Workflows

| Command | Description |
|---------|-------------|
| `/qa/release-gate` | Final validation before deploy |
| `/qa/review-content` | Review content quality |
| `/qa/validate-output` | Validate against templates/DoD |
| `/qa/audit-process` | Audit execution process |
| `/qa/run-checklist` | Run specific checklist |

### Tasks

| Command | Description |
|---------|-------------|
| `/qa/validate` | Validate deliverable against DoD |
| `/qa/review-content-quality` | Review content quality |
| `/qa/brand-check` | Check brand compliance |
| `/qa/verify-links` | Verify links and forms |
| `/qa/verify-tracking` | Verify tracking setup |
| `/qa/accessibility` | Check accessibility (a11y) |
| `/qa/performance` | Audit performance |
| `/qa/review-docs` | Review documentation |
| `/qa/api-contract` | Validate API contract |
| `/qa/integration` | Test integration |
| `/qa/security` | Audit security |
| `/qa/ux-flow` | Review UX flow |

## Structure

```
qa/
├── squad.yaml                     # v1.1.0 - Configuration
├── README.md
├── agents/
│   ├── qa-lead.md                 # Shield
│   ├── content-reviewer.md        # Echo
│   └── process-auditor.md         # Audit
├── tasks/
│   ├── validate-deliverable.md
│   ├── review-content-quality.md
│   ├── check-brand-compliance.md
│   ├── verify-links-and-forms.md
│   ├── verify-tracking.md
│   ├── check-accessibility.md
│   ├── audit-performance.md
│   ├── review-documentation.md
│   ├── validate-api-contract.md
│   ├── test-integration.md
│   ├── audit-security.md
│   └── review-ux-flow.md
├── workflows/
│   ├── release-gate.yaml
│   ├── review-content.yaml
│   ├── validate-output.yaml
│   ├── audit-process.yaml
│   └── run-checklist.yaml
├── templates/
│   ├── qa-report-tmpl.md
│   ├── bug-report-tmpl.md
│   ├── audit-findings-tmpl.md
│   ├── test-plan-tmpl.md
│   ├── release-notes-tmpl.md
│   └── compliance-report-tmpl.md
├── checklists/
│   ├── content-review.md
│   ├── release-readiness.md
│   ├── security-audit.md
│   ├── accessibility-audit.md
│   ├── performance-audit.md
│   └── ds-compliance.md
└── data/
    ├── severity-definitions.yaml
    └── dod-definitions.yaml
```

## Tasks

| Task | Agent | Purpose |
|------|-------|---------|
| `validate-deliverable` | qa-lead | Validate against DoD |
| `review-content-quality` | content-reviewer | Content quality review |
| `check-brand-compliance` | content-reviewer | Brand guidelines check |
| `verify-links-and-forms` | qa-lead | Link and form validation |
| `verify-tracking` | qa-lead | Analytics/tracking setup |
| `check-accessibility` | qa-lead | a11y compliance |
| `audit-performance` | process-auditor | Performance metrics |
| `review-documentation` | qa-lead | Doc quality review |
| `validate-api-contract` | qa-lead | API contract validation |
| `test-integration` | qa-lead | Integration testing |
| `audit-security` | process-auditor | Security audit |
| `review-ux-flow` | qa-lead | UX flow validation |

## Templates

| Template | Purpose |
|----------|---------|
| `qa-report-tmpl.md` | QA validation report |
| `bug-report-tmpl.md` | Bug/issue report |
| `audit-findings-tmpl.md` | Audit findings report |
| `test-plan-tmpl.md` | Test plan documentation |
| `release-notes-tmpl.md` | Release notes |
| `compliance-report-tmpl.md` | Compliance report |

## Checklists

| Checklist | Purpose |
|-----------|---------|
| `content-review.md` | Content quality validation |
| `release-readiness.md` | Pre-release validation |
| `security-audit.md` | Security audit checklist |
| `accessibility-audit.md` | a11y compliance check |
| `performance-audit.md` | Performance validation |
| `ds-compliance.md` | Design System compliance |

## Data Files

| File | Purpose |
|------|---------|
| `severity-definitions.yaml` | Bug severity levels |
| `dod-definitions.yaml` | Definition of Done criteria |

## Quality Gate Flow

```
Created → Self-Review → Peer Review → QA Gate → Release
   │           │            │           │         │
   └───────────┴────────────┴───────────┴─────────┘
                     Feedback Loop
```

## Severity Levels

| Level | Name | Response | Example |
|-------|------|----------|---------|
| P0 | Critical | Immediate | Security breach, data loss |
| P1 | High | Same day | Feature broken, major UX issue |
| P2 | Medium | 48 hours | Minor bug, cosmetic issue |
| P3 | Low | Next sprint | Enhancement, nice-to-have |

## Definition of Done (DoD)

### Code
- [ ] Tests pass
- [ ] No linting errors
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No security vulnerabilities

### Content
- [ ] Copy reviewed
- [ ] Links verified
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Brand compliant

### Release
- [ ] All DoD items checked
- [ ] QA approval
- [ ] Stakeholder sign-off
- [ ] Rollback plan ready
- [ ] Monitoring configured

## When to Involve QA

| Scenario | Required |
|----------|----------|
| External publication | ✅ Always |
| Production deployment | ✅ Always |
| Claims/testimonials | ✅ Always |
| New feature launch | ✅ Always |
| Bug fix | ⚠️ P0/P1 only |
| Internal tool | ❌ Optional |

## Audit Types

### Content Audit
- Copy accuracy
- Brand voice
- Claims verification
- CTA effectiveness

### Technical Audit
- Performance metrics
- Security scan
- Accessibility check
- API contract validation

### Process Audit
- Workflow compliance
- Cost tracking
- SLA adherence
- Documentation quality

## Integration Points

- **Receives from:** tech, marketing, design
- **Delivers to:** ops (release approval)
- **Triggers:** Pre-release, content publication, incidents

---

*QA Squad v1.1.0 - Travel Tech Digital AIOS*
