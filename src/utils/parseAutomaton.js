/**
 * Lee la definición de un autómata desde el texto de un archivo .txt
 *
 * Formato esperado:
 *   Q:{A1,B}
 *   Z:{a,b1}
 *   i:A
 *   A:{B}
 *   W:{(A1,B,a);(A1,A1,b1);(B,B,a);(B,A1,b)}
 */

const unique = (items) => [...new Set(items)]

const parseSet = (value) =>
  unique(
    value
      .replace(/^\s*\{/, '')
      .replace(/\}\s*$/, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )

export function parseAutomaton(text) {
  const clean = text.replace(/^\uFEFF/, '')
  const lines = clean
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const raw = {}
  for (const line of lines) {
    const match = line.match(/^([QZiAW])\s*:\s*(.*)$/i)
    if (match) raw[match[1].toUpperCase() === 'I' ? 'i' : match[1].toUpperCase()] = match[2]
  }

  const missing = ['Q', 'Z', 'i', 'A', 'W'].filter((key) => raw[key] === undefined)
  if (missing.length > 0) {
    throw new Error(`Faltan las líneas: ${missing.join(', ')}`)
  }

  const states = parseSet(raw.Q)
  const alphabet = parseSet(raw.Z)
  const initial = raw.i.trim()
  const accepting = parseSet(raw.A)

  const transitions = []
  for (const [, body] of raw.W.matchAll(/\(([^()]*)\)/g)) {
    const parts = body.split(',').map((part) => part.trim())
    if (parts.length === 3 && parts.every(Boolean)) {
      transitions.push({ from: parts[0], to: parts[1], symbol: parts[2] })
    }
  }

  if (states.length === 0) throw new Error('El conjunto de estados (Q) está vacío')
  if (alphabet.length === 0) throw new Error('El alfabeto (Z) está vacío')
  if (transitions.length === 0) throw new Error('No se encontraron transiciones en W')

  const warnings = []
  if (!states.includes(initial)) warnings.push(`El estado inicial "${initial}" no está en Q`)
  accepting
    .filter((state) => !states.includes(state))
    .forEach((state) => warnings.push(`El estado de aceptación "${state}" no está en Q`))

  // matriz[estado][símbolo] = lista de estados destino
  const matrix = Object.fromEntries(
    states.map((state) => [state, Object.fromEntries(alphabet.map((s) => [s, []]))]),
  )

  for (const { from, to, symbol } of transitions) {
    const problems = []
    if (!states.includes(from)) problems.push(`estado "${from}" no está en Q`)
    if (!states.includes(to)) problems.push(`estado "${to}" no está en Q`)
    if (!alphabet.includes(symbol)) problems.push(`símbolo "${symbol}" no está en el alfabeto`)

    if (problems.length > 0) {
      warnings.push(`Transición (${from},${to},${symbol}) omitida: ${problems.join(' y ')}`)
      continue
    }
    if (!matrix[from][symbol].includes(to)) matrix[from][symbol].push(to)
  }

  return {
    lines,
    states,
    alphabet,
    initial,
    accepting,
    transitions,
    matrix,
    warnings,
  }
}
