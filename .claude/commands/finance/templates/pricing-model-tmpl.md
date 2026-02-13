# Pricing Model Template

## Meta
- **ID:** pricing-model-tmpl
- **Squad:** finance
- **Used by:** review-pricing-model task
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{product_name}}` | Product being priced | yes | none |
| `{{pricing_tiers}}` | Tier definitions | yes | none |
| `{{cost_basis}}` | Cost per unit/user | yes | none |
| `{{target_margin}}` | Target gross margin | yes | none |
| `{{competitor_pricing}}` | Competitor prices | no | "Not analyzed" |
| `{{value_justification}}` | Value proposition per tier | yes | none |
| `{{recommendations}}` | Pricing recommendations | no | "None" |

## Template

---BEGIN TEMPLATE---

# Pricing Model — {{product_name}}

## Pricing Tiers

{{pricing_tiers}}

## Cost Analysis

**Cost Basis:** {{cost_basis}}
**Target Margin:** {{target_margin}}

## Value Justification

{{value_justification}}

## Competitive Analysis

{{competitor_pricing}}

## Recommendations

{{recommendations}}

---

*Pricing model by Finance Squad*

---END TEMPLATE---

## Usage Notes
- Review quarterly or when costs change significantly
- Always include value justification, not just cost-plus
- Competitor analysis should be recent (<3 months)
