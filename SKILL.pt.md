---
name: vertical-tank-sizing-pt
description: Dimensionamento básico de tanque vertical cilíndrico (altura útil, pressão hidrostática na base, força no fundo, massa armazenada) para um ou vários tamanhos; pergunta os dados ao usuário antes de calcular.
---

# Dimensionamento básico de tanque vertical

Nomenclatura técnica mantida como no `SKILL.md` em inglês.

## 1. Perguntar os dados (uma rodada, pular o que já foi informado)

1. Quantos tamanhos: um tanque ou uma lista (ex.: 10, 25, 50, 100 m³)?
2. Quais dois entre V, D, H são conhecidos (V+D -> H, D+H -> V, V+H -> D)?
3. Fluido e densidade ρ (padrão: água, 1000 kg/m³).
4. Pressão atmosférica (padrão 101,3 kPa) e g (padrão 9,81 m/s²).
5. Folga livre no topo (padrão 10 %, usual 5-10 %) para obter a altura total HT.
6. Opcional, verificação da casca: espessura adotada t (mm), tensão admissível S (MPa), eficiência de junta E (padrão 0,85), sobre-espessura de corrosão CA (1-3 mm).

Sem resposta: usar os padrões e declarar em uma linha.

## 2. Fórmulas (SI)

A = π·D²/4 ; H = V/A ; P = ρ·g·H ; P_total = P_atm + P ; F = P·A (= m·g) ; m = ρ·V ; HT = H·(1+folga) ;
opcional t_min = P·D/(2·S·E) + CA (P em MPa, D em mm).

## 3. Calcular com o script, nunca de cabeça

```
node scripts/tank-sizing.cjs --self-test
node scripts/tank-sizing.cjs entrada.json
```

Referência: V = 50 m³, D = 3,0 m, água -> A = 7,0686 m², H = 7,07 m, P = 69,4 kPa, P_total = 170,7 kPa, F = 490,5 kN, m = 50 t.

## 4. Verificar antes de entregar

F ≈ m·g; HT > H; H/D entre ~0,5 e ~4 (avisar se fugir); unidades coerentes.

## 5. Entregar

Um tamanho: formato da folha de cálculo. Vários: tabela (V, D, H, HT, P, P_total, F, m, t_min) com 1-2 observações. Lembrar sempre: espessura mínima por norma (API 650 / ABNT NBR 7821), folga 5-10 %, corrosão, bocais, reforços e suportes.

## Escopo

Pré-dimensionamento. Não é certificação por norma: sem vento, sísmica, teto, vácuo, geometria de tampos, cargas em bocais ou fundação.
