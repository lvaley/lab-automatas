import { useEffect, useRef, useState } from 'react'
import DropZone from './components/DropZone.jsx'
import FileDisplay from './components/FileDisplay.jsx'
import VectorsPanel from './components/VectorsPanel.jsx'
import TransitionMatrix from './components/TransitionMatrix.jsx'
import Footer from './components/Footer.jsx'
import { parseAutomaton } from './utils/parseAutomaton.js'

function Section({ title, className = '', children }) {
  return (
    <section className={`panel ${className}`}>
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  )
}

export default function App() {
  const [fileName, setFileName] = useState(null)
  const [automaton, setAutomaton] = useState(null)
  const [error, setError] = useState(null)
  const loadId = useRef(0)

  // Evita que el navegador abra el archivo si se suelta fuera de la zona de carga
  useEffect(() => {
    const prevent = (event) => event.preventDefault()
    window.addEventListener('dragover', prevent)
    window.addEventListener('drop', prevent)
    return () => {
      window.removeEventListener('dragover', prevent)
      window.removeEventListener('drop', prevent)
    }
  }, [])

  // Vuelve a la pantalla inicial, sin archivo cargado
  const handleClear = () => {
    loadId.current += 1 // descarta una lectura que aún esté en curso
    setFileName(null)
    setAutomaton(null)
    setError(null)
  }

  const handleFile = async (file) => {
    const id = ++loadId.current
    setFileName(file.name)

    if (!/\.txt$/i.test(file.name) && file.type !== 'text/plain') {
      setAutomaton(null)
      setError('El archivo debe ser de tipo TXT.')
      return
    }

    try {
      const text = await file.text()
      if (id !== loadId.current) return
      setAutomaton(parseAutomaton(text))
      setError(null)
    } catch (err) {
      if (id !== loadId.current) return
      setAutomaton(null)
      setError(err.message)
    }
  }

  const warnings = automaton?.warnings ?? []
  const status = error ?? warnings[0] ?? null
  const extra = !error && warnings.length > 1 ? ` (+${warnings.length - 1} más)` : ''

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Autómatas y Lenguajes Formales</h1>
        <p>Carga un archivo .txt con la definición de un autómata finito determinista.</p>
      </header>

      <main className="app-main">
        <div className="stack">
          <Section title="Cargar archivo .txt" className="panel-fixed">
            <DropZone onFile={handleFile} onClear={handleClear} fileName={fileName} />
            <div
              className={`status-line text-truncate ${status ? 'is-visible' : ''}`}
              role="status"
              title={[error, ...warnings].filter(Boolean).join('\n')}
            >
              {status && `${status}${extra}`}
            </div>
          </Section>

          {/* Las secciones (y sus títulos) aparecen solo cuando el archivo .txt ya fue leído */}
          {automaton && (
            <>
              <Section title="Despliegue de archivo" className="panel-fixed">
                <FileDisplay lines={automaton.lines} />
              </Section>

              <div className="tables-row">
                <Section title="Vectores" className="panel-vectors">
                  <VectorsPanel automaton={automaton} />
                </Section>
                <Section title="Matriz de transición" className="panel-matrix">
                  <TransitionMatrix automaton={automaton} />
                </Section>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
