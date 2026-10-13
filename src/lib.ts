export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const formatCash = (value: number) => new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
}).format(value)

export const quarterLabel = (quarter: number) => {
  const seasons = ['春', '夏', '秋', '冬']
  const year = Math.ceil(quarter / 4)
  return `第 ${year} 年 · ${seasons[(quarter - 1) % 4]}`
}
