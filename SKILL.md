---
name: vertical-tank-sizing
description: Preliminary sizing of vertical cylindrical tanks (useful height, hydrostatic pressure at the base, bottom force, stored mass) for one or several sizes. Asks the user for the input data before calculating.
---

# Vertical tank sizing (preliminary)

Main instructions in English. Portuguese: `SKILL.pt.md`. Spanish: `SKILL.es.md`. Reply in the user's language.

## 1. Ask for the data (one round only, skip what is already given)

1. How many sizes: one tank or a list (e.g. 10, 25, 50, 100 m3)?
2. Which two of V, D, H are known (V+D -> H, D+H -> V, V+H -> D)?
3. Fluid and density rho (default water, 1000 kg/m3).
4. Atmospheric pressure (default 101.3 kPa) and g (default 9.81 m/s2).
5. Free board at the top (default 10 %, usual 5-10 %) to get total height HT.
6. Optional shell check: adopted thickness t (mm), allowable stress S (MPa), joint efficiency E (default 0.85), corrosion allowance CA (1-3 mm).

If the user does not answer, use the defaults and state them in one line.

## 2. Formulas (SI)

A = pi*D^2/4 ; H = V/A ; P = rho*g*H ; P_total = P_atm + P ; F = P*A (= m*g) ; m = rho*V ; HT = H*(1+free board) ;
optional t_min = P*D/(2*S*E) + CA (P in MPa, D in mm).

## 3. Calculate with the script, never by hand

```
node scripts/tank-sizing.cjs --self-test
node scripts/tank-sizing.cjs input.json
```

Input JSON: a single tank (`V`, `D`, `H`, `rho`, `patm`, `g`, `freeBoard`, `S`, `E`, `CA`, `t`) or `{ "common": {...}, "tanks": [ {...}, ... ] }`. See `examples/`.

Reference check: V = 50 m3, D = 3.0 m, water -> A = 7.0686 m2, H = 7.07 m, P = 69.4 kPa, P_total = 170.7 kPa, F = 490.5 kN, m = 50 t.

## 4. Verify before delivering

F ~ m*g; HT > H; H/D within about 0.5-4 (warn otherwise); consistent units (kPa, kN, t, m). State anything that could not be verified.

## 5. Deliver

One size: the worksheet layout (data, area, height, pressure, force, mass, practical notes, summary). Several sizes: a table (V, D, H, HT, P, P_total, F, m, t_min) plus one or two remarks. Always remind: minimum thickness by code (API 650 / ABNT NBR 7821), free board 5-10 %, corrosion allowance, nozzles, reinforcements and supports must be checked.

## Scope

Preliminary sizing only. It is not code certification: no wind, seismic, roof loads, vacuum, head geometry, nozzle loads or foundation design.
