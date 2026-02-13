# Release Notes Template

## Meta
- **ID:** release-notes-tmpl
- **Squad:** qa
- **Used by:** release-gate workflow
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{version}}` | Release version | yes | none |
| `{{release_date}}` | Date of release | yes | none |
| `{{release_type}}` | major, minor, patch, hotfix | yes | none |
| `{{summary}}` | Brief release summary | yes | none |
| `{{new_features}}` | New features added | no | "None" |
| `{{improvements}}` | Improvements made | no | "None" |
| `{{bug_fixes}}` | Bugs fixed | no | "None" |
| `{{breaking_changes}}` | Breaking changes | no | "None" |
| `{{known_issues}}` | Known issues | no | "None" |
| `{{upgrade_notes}}` | Upgrade instructions | no | "No special steps required" |

## Template

---BEGIN TEMPLATE---

# Release Notes — v{{version}}

**Release Date:** {{release_date}}
**Type:** {{release_type}}

---

## Summary

{{summary}}

## New Features

{{new_features}}

## Improvements

{{improvements}}

## Bug Fixes

{{bug_fixes}}

## Breaking Changes

{{breaking_changes}}

## Known Issues

{{known_issues}}

## Upgrade Notes

{{upgrade_notes}}

---

*Released by Travel Tech Digital*

---END TEMPLATE---

## Usage Notes
- Breaking changes must be clearly marked with migration steps
- Bug fixes should reference issue/bug IDs
- New features should link to documentation
