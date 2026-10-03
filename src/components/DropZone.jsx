import { useState } from 'react'

// Solo admite arrastrar y soltar (no abre el explorador de archivos al hacer clic)
export default function DropZone({ onFile, fileName }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`dropzone d-flex align-items-center gap-3 px-3 ${dragging ? 'is-dragging' : ''}`}
      aria-label="Zona para arrastrar y soltar un archivo TXT"
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <svg
        className="dropzone-icon flex-shrink-0"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 9.5" />
        <path d="M12 21v-8" />
        <path d="m9 15.5 3-3 3 3" />
      </svg>
      <span className="text-truncate">{fileName ?? 'Arrastrar y soltar archivo .txt'}</span>
    </div>
  )
}
