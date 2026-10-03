export default function FileDisplay({ lines }) {
  // Reduce la letra cuando hay muchas transiciones para no generar scroll
  const size = Math.max(0.7, 1.05 - lines.join('').length / 1200)

  return (
    <div className="file-display" style={{ fontSize: `${size}rem` }}>
      {lines.map((line, index) => {
        const [key, value = ''] = line.split(/:(.*)/s)
        const pieces = value.split(';')
        return (
          <div className="file-line" key={index}>
            <strong>{key}:</strong>
            {pieces.map((piece, i) => (
              <span key={i}>
                {piece}
                {i < pieces.length - 1 && (
                  <>
                    ;<wbr />
                  </>
                )}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
