import { getMarginalRate } from './taxRates.js'

export const MAX_CONTRIBUTION_2025 = 7258

export const INVESTMENT_STRATEGIES = {
  cash:         { label: 'Cash',         return: 0.005, description: 'Savings account rate — no market exposure' },
  conservative: { label: 'Conservative', return: 0.025, description: 'Mostly bonds — stable, low growth' },
  balanced:     { label: 'Balanced',     return: 0.045, description: '50% equities — moderate long-term growth' },
  growth:       { label: 'Growth',       return: 0.060, description: '80% equities — higher growth, more volatility' },
  aggressive:   { label: 'Aggressive',   return: 0.065, description: '100% equities — maximum growth potential' },
}

export function calculateResults(inputs) {
  const { canton, age, income, contribution, currentBalance = 0, strategy } = inputs
  const years = 65 - age
  const rate = INVESTMENT_STRATEGIES[strategy]?.return ?? 0.06
  const marginalRate = getMarginalRate(canton, income)

  const annualTaxSaving = contribution * marginalRate
  const effectiveCost = contribution - annualTaxSaving

  // Future value of annual contributions (end-of-year annuity)
  const fvAnnuity = (r, n) => r === 0 ? contribution * n : contribution * ((Math.pow(1 + r, n) - 1) / r)
  const fvBalance = (r, n) => currentBalance * Math.pow(1 + r, n)

  const totalAtRetirement = fvAnnuity(rate, years) + fvBalance(rate, years)

  const cashRate = 0.005
  const totalCashScenario = fvAnnuity(cashRate, years) + fvBalance(cashRate, years)
  const investmentAdvantage = totalAtRetirement - totalCashScenario
  const lifetimeTaxSaving = annualTaxSaving * years

  return {
    annualTaxSaving,
    effectiveCost,
    marginalRate,
    totalAtRetirement,
    totalCashScenario,
    investmentAdvantage,
    lifetimeTaxSaving,
    yearsUntilRetirement: years,
  }
}

export function buildChartData(inputs) {
  const { age, income, contribution, currentBalance = 0, canton } = inputs
  const marginalRate = getMarginalRate(canton, income)
  const netAfterTax = contribution * (1 - marginalRate)

  return Array.from({ length: 65 - age }, (_, i) => {
    const t = i + 1
    const base = currentBalance

    const fv = (r, c, n) => base * Math.pow(1 + r, n) + (r === 0 ? c * n : c * ((Math.pow(1 + r, n) - 1) / r))

    return {
      age: age + t,
      noThreeA:      Math.round(fv(0.005, netAfterTax, t)),
      cashThreeA:    Math.round(fv(0.005, contribution, t)),
      investedThreeA:Math.round(fv(0.065, contribution, t)),
    }
  })
}
