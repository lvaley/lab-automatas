export default function TransitionMatrix({ automaton }) {
  const states = automaton.states
  const alphabet = automaton.alphabet

  return (
    <table
      className="table table-bordered matrix-table mb-0"
      style={{ '--rows': Math.max(1, states.length) + 1 }}
    >
      <thead>
        <tr>
          <th scope="col">Estado</th>
          {alphabet.map((symbol) => (
            <th key={symbol} scope="col">
              {symbol}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {states.length === 0 ? (
          <tr>
            <td className="text-body-secondary">&nbsp;</td>
          </tr>
        ) : (
          states.map((state) => (
            <tr key={state}>
              <th scope="row">{state}</th>
              {alphabet.map((symbol) => (
                <td key={symbol}>{automaton.matrix[state][symbol].join(', ')}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
