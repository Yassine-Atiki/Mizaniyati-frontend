export const brandGradients = [
  'linear-gradient(135deg, #5b4bff, #2fd6ff)',
  'linear-gradient(135deg, #ff7d6b, #ffd56b)',
  'linear-gradient(135deg, #9c5bff, #ff4fd8)',
]

export const chartPalette = ['#5b4bff', '#2fd6ff', '#9c5bff', '#ff7d6b', '#ffd56b']

export const budgetStatus = (ratio) => {
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.8) return 'warning'
  return 'success'
}
