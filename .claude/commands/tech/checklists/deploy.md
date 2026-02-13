# Deploy Checklist

> Pre-deployment verification checklist

## Metadata
- **Environment:** Staging / Production
- **Version:**
- **Deployer:**
- **Date:**

---

## 1. Pre-Deploy Checks

### Code Ready
- [ ] All PRs merged to main
- [ ] No pending reviews
- [ ] Changelog updated
- [ ] Version bumped

### Tests
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] E2E tests pass (critical paths)
- [ ] No test regressions

### Quality
- [ ] Lint passes (no errors)
- [ ] TypeScript compiles (no errors)
- [ ] No console errors in dev
- [ ] Lighthouse score acceptable

---

## 2. Environment Checks

### Staging (if deploying to production)
- [ ] Staging deployment successful
- [ ] Staging tested and approved
- [ ] No critical bugs in staging

### Environment Variables
- [ ] All required env vars set
- [ ] No dev values in production
- [ ] Secrets are in secret manager
- [ ] API keys are valid

### Dependencies
- [ ] No security vulnerabilities (npm audit)
- [ ] Dependencies up to date
- [ ] Lock file committed

---

## 3. Database

- [ ] Migrations ready (if any)
- [ ] Migrations tested in staging
- [ ] Backup created before migration
- [ ] Rollback plan ready

---

## 4. Third-Party Services

- [ ] External APIs accessible
- [ ] Webhook endpoints ready
- [ ] Auth providers configured
- [ ] Analytics tracking ready

---

## 5. Deployment

### Before Deploy
- [ ] Team notified of deployment
- [ ] Low-traffic window (if applicable)
- [ ] Monitoring dashboards open
- [ ] Rollback procedure documented

### During Deploy
- [ ] Build successful
- [ ] Deployment successful
- [ ] No errors in logs
- [ ] Health checks pass

### After Deploy
- [ ] Smoke tests pass
- [ ] Critical paths verified
- [ ] No error spikes
- [ ] Performance acceptable

---

## 6. Post-Deploy Verification

### Functional
- [ ] Home page loads
- [ ] Login/logout works
- [ ] Main features work
- [ ] Forms submit correctly
- [ ] Payments process (if applicable)

### Technical
- [ ] No console errors
- [ ] No 500 errors
- [ ] Response times acceptable
- [ ] No memory leaks

### Monitoring
- [ ] Error tracking active
- [ ] Performance monitoring active
- [ ] Alerts configured
- [ ] Logs accessible

---

## 7. Communication

- [ ] Team notified of success
- [ ] Release notes published
- [ ] Stakeholders informed
- [ ] Support team briefed (if needed)

---

## Rollback Triggers

Deploy should be rolled back if:
- [ ] Critical feature broken
- [ ] Error rate > 5%
- [ ] Response time > 3x normal
- [ ] Security vulnerability discovered

### Rollback Command
```bash
# Vercel
vercel rollback

# Manual
git revert HEAD && git push
```

---

## Sign-off

| Role | Name | Approved | Time |
|------|------|----------|------|
| Tech Lead | | [ ] | |
| QA | | [ ] | |
| Ops | | [ ] | |

---

*Checklist v1.0 - Tech Squad*
