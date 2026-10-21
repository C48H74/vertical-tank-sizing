---
name: vertical-tank-sizing-es
description: Dimensionamiento básico de tanque vertical cilíndrico (altura útil, presión hidrostática en la base, fuerza en el fondo, masa almacenada) para uno o varios tamaños; pregunta los datos al usuario antes de calcular.
---

# Dimensionamiento básico de tanque vertical

Nomenclatura técnica mantenida como en el `SKILL.md` en inglés.

## 1. Preguntar los datos (una ronda, omitir lo ya informado)

1. Cuántos tamaños: un tanque o una lista (ej.: 10, 25, 50, 100 m³)?
2. Cuáles dos de V, D, H se conocen (V+D -> H, D+H -> V, V+H -> D)?
3. Fluido y densidad ρ (por defecto agua, 1000 kg/m³).
4. Presión atmosférica (por defecto 101,3 kPa) y g (por defecto 9,81 m/s²).
5. Margen libre superior (por defecto 10 %, habitual 5-10 %) para obtener la altura total HT.
6. Opcional, comprobación de la virola: espesor adoptado t (mm), tensión admisible S (MPa), eficiencia de junta E (por defecto 0,85), sobreespesor de corrosión CA (1-3 mm).

Sin respuesta: usar los valores por defecto y declararlo en una línea.

## 2. Fórmulas (SI)

A = π·D²/4 ; H = V/A ; P = ρ·g·H ; P_total = P_atm + P ; F = P·A (= m·g) ; m = ρ·V ; HT = H·(1+margen) ;
opcional t_min = P·D/(2·S·E) + CA (P en MPa, D en mm).

## 3. Calcular con el script, nunca de memoria

```
node scripts/tank-sizing.cjs --self-test
node scripts/tank-sizing.cjs entrada.json
```

Referencia: V = 50 m³, D = 3,0 m, agua -> A = 7,0686 m², H = 7,07 m, P = 69,4 kPa, P_total = 170,7 kPa, F = 490,5 kN, m = 50 t.

## 4. Verificar antes de entregar

F ≈ m·g; HT > H; H/D entre ~0,5 y ~4 (avisar si se sale); unidades coherentes.

## 5. Entregar

Un tamaño: formato de la hoja de cálculo. Varios: tabla (V, D, H, HT, P, P_total, F, m, t_min) con 1-2 observaciones. Recordar siempre: espesor mínimo por norma (API 650 / ABNT NBR 7821), margen 5-10 %, corrosión, boquillas, refuerzos y soportes.

## Alcance

Predimensionamiento. No es certificación por norma: sin viento, sismo, techo, vacío, geometría de fondos, cargas en boquillas ni cimentación.
