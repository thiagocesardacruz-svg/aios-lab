# OS Validation Checklist

> Checklist para validar Service Orders antes de execução.

## Campos Obrigatórios

- [ ] `os_id` presente e no formato OS-YYYY-NNNN
- [ ] `title` preenchido (max 100 caracteres)
- [ ] `squad` é um squad válido
- [ ] `workflow` existe no squad indicado
- [ ] `status` é valor válido (intake, running, blocked, qa, done)
- [ ] `priority` é valor válido (critical, high, medium, low)
- [ ] `requester` identificado
- [ ] `created_at` é timestamp válido

## Roteamento

- [ ] Squad correto para o tipo de trabalho
- [ ] Workflow adequado para o pedido
- [ ] Prioridade reflete urgência real
- [ ] Não há OS duplicada para mesmo pedido

## Custos

- [ ] `cost.category` definido
- [ ] `cost.mode` definido (OP, CLIENT, ou DEV)
- [ ] Estimativa de custo razoável

## Dependências

- [ ] Se `blocked_by` preenchido, OS referenciada existe
- [ ] Se `project_id` preenchido, projeto existe

## Qualidade

- [ ] Título é descritivo e acionável
- [ ] Contexto suficiente para execução
- [ ] Tags relevantes aplicadas

---

## Resultado

- [ ] **PASS** - OS válida, pronta para execução
- [ ] **FAIL** - Correções necessárias (listar abaixo)

### Correções Necessárias

1. {item}
2. {item}
