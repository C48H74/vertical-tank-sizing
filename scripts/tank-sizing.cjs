#!/usr/bin/env node
// Vertical cylindrical tank - preliminary sizing. GPL-3.0-or-later. No dependencies.
// Usage: node scripts/tank-sizing.cjs examples/water-50m3.json | --self-test
'use strict';
const fs = require('fs');

function calc(i) {
  const rho = i.rho ?? 1000, patm = i.patm ?? 101.3, g = i.g ?? 9.81, folga = i.freeBoard ?? 0.10;
  let { V, D, H } = i;
  const given = [V, D, H].filter(x => x != null).length;
  if (given !== 2) throw new Error('Provide exactly two of V (m3), D (m), H (m)');
  if (V == null) V = Math.PI * D * D / 4 * H;
  else if (D == null) D = Math.sqrt(4 * (V / H) / Math.PI);
  else H = V / (Math.PI * D * D / 4);
  if (![V, D, H].every(x => x > 0)) throw new Error('V, D, H must be positive');
  const A = Math.PI * D * D / 4;
  const P = rho * g * H / 1000;                    // kPa
  const r = { V, D, H, HT: H * (1 + folga), A, P, Pabs: patm + P, F: P * A, m: rho * V / 1000, HD: H / D };
  if (i.S) {                                       // optional shell check, hydrostatic at bottom
    const E = i.E ?? 0.85, CA = i.CA ?? 0;
    r.tMin = (P / 1000) * (D * 1000) / (2 * i.S * E) + CA;   // mm
    if (i.t != null) r.tOk = i.t >= r.tMin;
  }
  r.warnings = [];
  if (r.HD < 0.5 || r.HD > 4) r.warnings.push('H/D = ' + r.HD.toFixed(2) + ' outside usual 0.5-4');
  if (Math.abs(r.F - r.m * g) / r.F > 1e-9) r.warnings.push('F differs from m*g');
  return r;
}

function table(rows) {
  const f = (x, d) => x == null ? '-' : x.toFixed(d);
  const head = ['V m3', 'D m', 'H m', 'HT m', 'P kPa', 'Pabs kPa', 'F kN', 'm t', 'tmin mm'];
  const lines = rows.map(r => [f(r.V, 2), f(r.D, 2), f(r.H, 2), f(r.HT, 2), f(r.P, 1), f(r.Pabs, 1), f(r.F, 1), f(r.m, 1), f(r.tMin, 2)]);
  return [head, ...lines].map(l => l.map(c => c.padStart(9)).join(' ')).join('\n');
}

function selfTest() {
  const r = calc({ V: 50, D: 3.0 });
  const chk = (n, a, b, tol) => { if (Math.abs(a - b) > tol) { console.error('FAIL', n, a, b); process.exit(1); } };
  chk('A', r.A, 7.0686, 1e-3); chk('H', r.H, 7.07, 5e-3); chk('P', r.P, 69.4, 0.05);
  chk('Pabs', r.Pabs, 170.7, 0.05); chk('F', r.F, 490.5, 0.1); chk('m', r.m, 50, 1e-9);
  chk('Vback', calc({ D: 3, H: r.H }).V, 50, 1e-9); chk('Dback', calc({ V: 50, H: r.H }).D, 3, 1e-9);
  console.log('self-test OK (reference: V=50 m3, D=3.0 m, water -> H=7.07 m, P=69.4 kPa, F=490.5 kN, m=50 t)');
}

if (require.main === module) {
  const a = process.argv[2];
  if (!a) { console.error('Usage: tank-sizing.cjs <input.json> | --self-test'); process.exit(2); }
  if (a === '--self-test') selfTest();
  else {
    const inp = JSON.parse(fs.readFileSync(a, 'utf8'));
    const common = inp.common || {};
    const rows = (inp.tanks || [inp]).map(t => calc({ ...common, ...t }));
    console.log(table(rows));
    rows.forEach((r, k) => r.warnings.forEach(w => console.log('warning tank ' + (k + 1) + ': ' + w)));
  }
}
module.exports = { calc };
