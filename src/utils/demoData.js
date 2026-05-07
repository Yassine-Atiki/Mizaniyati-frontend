export const demoCategories = [
  { id: 'cat-1', name: 'Maison', colorCode: '#5b4bff', icon: 'Home' },
  { id: 'cat-2', name: 'Transport', colorCode: '#2fd6ff', icon: 'Car' },
  { id: 'cat-3', name: 'Food', colorCode: '#ff7d6b', icon: 'Fork' },
  { id: 'cat-4', name: 'Loisirs', colorCode: '#ffd56b', icon: 'Game' },
]

export const demoExpenses = [
  {
    id: 'exp-1',
    amount: 420,
    date: '2026-05-04',
    description: 'Courses premium',
    type: 'DYNAMIC',
    frequency: 'MONTHLY',
    category: demoCategories[2],
  },
  {
    id: 'exp-2',
    amount: 1800,
    date: '2026-05-02',
    description: 'Loyer loft',
    type: 'FIXED',
    frequency: 'MONTHLY',
    category: demoCategories[0],
  },
  {
    id: 'exp-3',
    amount: 220,
    date: '2026-05-01',
    description: 'Trajets Uber',
    type: 'DYNAMIC',
    frequency: 'WEEKLY',
    category: demoCategories[1],
  },
]

export const demoIncome = [
  {
    id: 'inc-1',
    source: 'Salaire Studio',
    amount: 12000,
    date: '2026-05-01',
    type: 'FIXED',
    frequency: 'MONTHLY',
    isRecurring: true,
  },
  {
    id: 'inc-2',
    source: 'Freelance UI',
    amount: 3200,
    date: '2026-05-03',
    type: 'DYNAMIC',
    frequency: 'MONTHLY',
    isRecurring: false,
  },
]

export const demoBudgets = [
  {
    id: 'bud-1',
    limitAmount: 2500,
    spentAmount: 1960,
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    category: demoCategories[0],
  },
  {
    id: 'bud-2',
    limitAmount: 1400,
    spentAmount: 640,
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    category: demoCategories[2],
  },
]

export const demoStrategies = [
  {
    id: 'str-1',
    name: '50 / 30 / 20 Focus',
    savingPercentage: 20,
    needsPercentage: 50,
    wantsPercentage: 30,
    isActive: true,
  },
  {
    id: 'str-2',
    name: 'Aggressive Savings',
    savingPercentage: 35,
    needsPercentage: 45,
    wantsPercentage: 20,
    isActive: false,
  },
]
