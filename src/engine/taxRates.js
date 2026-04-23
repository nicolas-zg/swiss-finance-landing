// Combined marginal tax rates: federal + cantonal + average communal
// Approximations for planning — actual rates vary by commune
// Income breakpoints in CHF
export const CANTON_RATES = {
  AG: { 60000: 0.23, 80000: 0.26, 100000: 0.30, 120000: 0.33, 150000: 0.36, 200000: 0.39 },
  AI: { 60000: 0.19, 80000: 0.22, 100000: 0.26, 120000: 0.29, 150000: 0.32, 200000: 0.35 },
  AR: { 60000: 0.21, 80000: 0.24, 100000: 0.28, 120000: 0.31, 150000: 0.34, 200000: 0.37 },
  BE: { 60000: 0.27, 80000: 0.30, 100000: 0.34, 120000: 0.37, 150000: 0.39, 200000: 0.42 },
  BL: { 60000: 0.26, 80000: 0.29, 100000: 0.33, 120000: 0.36, 150000: 0.39, 200000: 0.42 },
  BS: { 60000: 0.28, 80000: 0.31, 100000: 0.35, 120000: 0.38, 150000: 0.40, 200000: 0.43 },
  FR: { 60000: 0.26, 80000: 0.29, 100000: 0.33, 120000: 0.36, 150000: 0.38, 200000: 0.41 },
  GE: { 60000: 0.30, 80000: 0.33, 100000: 0.37, 120000: 0.40, 150000: 0.43, 200000: 0.46 },
  GL: { 60000: 0.22, 80000: 0.25, 100000: 0.29, 120000: 0.32, 150000: 0.35, 200000: 0.38 },
  GR: { 60000: 0.21, 80000: 0.24, 100000: 0.28, 120000: 0.31, 150000: 0.34, 200000: 0.37 },
  JU: { 60000: 0.28, 80000: 0.31, 100000: 0.35, 120000: 0.38, 150000: 0.41, 200000: 0.44 },
  LU: { 60000: 0.22, 80000: 0.25, 100000: 0.29, 120000: 0.32, 150000: 0.35, 200000: 0.38 },
  NE: { 60000: 0.28, 80000: 0.31, 100000: 0.35, 120000: 0.38, 150000: 0.41, 200000: 0.44 },
  NW: { 60000: 0.18, 80000: 0.21, 100000: 0.25, 120000: 0.28, 150000: 0.31, 200000: 0.34 },
  OW: { 60000: 0.18, 80000: 0.21, 100000: 0.25, 120000: 0.28, 150000: 0.31, 200000: 0.34 },
  SG: { 60000: 0.24, 80000: 0.27, 100000: 0.31, 120000: 0.34, 150000: 0.37, 200000: 0.40 },
  SH: { 60000: 0.23, 80000: 0.26, 100000: 0.30, 120000: 0.33, 150000: 0.36, 200000: 0.39 },
  SO: { 60000: 0.25, 80000: 0.28, 100000: 0.32, 120000: 0.35, 150000: 0.38, 200000: 0.41 },
  SZ: { 60000: 0.17, 80000: 0.20, 100000: 0.24, 120000: 0.27, 150000: 0.30, 200000: 0.33 },
  TG: { 60000: 0.22, 80000: 0.25, 100000: 0.29, 120000: 0.32, 150000: 0.35, 200000: 0.38 },
  TI: { 60000: 0.23, 80000: 0.26, 100000: 0.30, 120000: 0.33, 150000: 0.36, 200000: 0.39 },
  UR: { 60000: 0.19, 80000: 0.22, 100000: 0.26, 120000: 0.29, 150000: 0.32, 200000: 0.35 },
  VD: { 60000: 0.27, 80000: 0.30, 100000: 0.34, 120000: 0.37, 150000: 0.40, 200000: 0.43 },
  VS: { 60000: 0.24, 80000: 0.27, 100000: 0.31, 120000: 0.34, 150000: 0.37, 200000: 0.40 },
  ZG: { 60000: 0.15, 80000: 0.18, 100000: 0.22, 120000: 0.24, 150000: 0.27, 200000: 0.30 },
  ZH: { 60000: 0.25, 80000: 0.28, 100000: 0.32, 120000: 0.35, 150000: 0.38, 200000: 0.41 },
}

export const CANTON_NAMES = {
  AG: 'Aargau',           AI: 'Appenzell Innerrhoden', AR: 'Appenzell Ausserrhoden',
  BE: 'Bern',             BL: 'Basel-Landschaft',      BS: 'Basel-Stadt',
  FR: 'Fribourg',         GE: 'Geneva',                GL: 'Glarus',
  GR: 'Graubünden',       JU: 'Jura',                  LU: 'Luzern',
  NE: 'Neuchâtel',        NW: 'Nidwalden',             OW: 'Obwalden',
  SG: 'St. Gallen',       SH: 'Schaffhausen',          SO: 'Solothurn',
  SZ: 'Schwyz',           TG: 'Thurgau',               TI: 'Ticino',
  UR: 'Uri',              VD: 'Vaud',                  VS: 'Valais',
  ZG: 'Zug',              ZH: 'Zürich',
}

export function getMarginalRate(canton, income, maritalStatus = 'single') {
  const brackets = CANTON_RATES[canton] ?? CANTON_RATES['ZH']
  const points = Object.keys(brackets).map(Number).sort((a, b) => a - b)
  const lower = [...points].reverse().find(p => p <= income) ?? points[0]
  const upper = points.find(p => p > income) ?? points[points.length - 1]
  const baseRate = lower === upper
    ? brackets[lower]
    : brackets[lower] + ((income - lower) / (upper - lower)) * (brackets[upper] - brackets[lower])
  // Married (single primary income): ~18% lower combined rate due to federal joint brackets + cantonal splitting
  return maritalStatus === 'married' ? baseRate * 0.82 : baseRate
}
