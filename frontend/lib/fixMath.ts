export function fixMathDelimiters(content: string): string {
  if (!content) return ''

  let result = content

  // Fix display math: \[ ... \] → $$ ... $$
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_match, inner) => {
    return `$$${inner.trim()}$$`
  })

  // Fix inline math: \( ... \) → $ ... $
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, inner) => {
    return `$${inner.trim()}$`
  })

  // Fix bare parens used as math delimiters: ( \frac... ) → $ \frac... $
  // Only match if content looks like LaTeX (contains \, ^, _, frac, sum, etc.)
  result = result.replace(
    /\(\s*(\\[a-zA-Z]+[\s\S]*?|[^()]*[_^][^()]*)\s*\)/g,
    (_match, inner) => {
      const trimmed = inner.trim()
      // Skip if it looks like plain English or code
      if (!trimmed.match(/[\\_{}\^]|\\frac|\\sum|\\alpha|\\beta|\\theta|\\mu|\\sigma|cdot|sqrt/)) {
        return _match
      }
      return `$${trimmed}$`
    }
  )

  // Fix double-dollar signs that got mangled: $$ $$ with extra spaces
  result = result.replace(/\$\$\s+/g, '$$')
  result = result.replace(/\s+\$\$/g, '$$')

  return result
}
