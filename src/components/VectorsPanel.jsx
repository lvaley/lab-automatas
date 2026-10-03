export default function VectorsPanel({ automaton }) {
  const columns = [
    { label: 'Q', items: automaton.states },
    { label: 'Σ', items: automaton.alphabet },
    { label: 'A', items: automaton.accepting },
  ]
  const length = Math.max(1, ...columns.map((column) => column.items.length))

  return (
    <table className="table table-bordered vector-table mb-0" style={{ '--rows': length + 1 }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.label} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length }, (_, row) => (
          <tr key={row}>
            {columns.map((column) => (
              <td key={column.label}>{column.items[row] ?? ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
