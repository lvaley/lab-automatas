# Laboratorio · Autómatas y Lenguajes Formales

Aplicación en **React 19 + Vite**, con **ESLint** y **Bootstrap 5**. Carga por arrastre un archivo .txt con la definición de un autómata y despliega el archivo, los vectores (Q, Σ, A) y la matriz de transición, todo en una sola vista sin scroll.

## Formato del archivo .txt

```
Q:{A1,B}
Z:{a,b1}
i:A1
A:{B}
W:{(A1,B,a);(A1,A1,b1);(B,B,a);(B,A1,b1)}
```

| Línea | Significado | Variable en el código |
|-------|-------------|-----------------------|
| `Q`   | Conjunto de estados | `states` |
| `Z`   | Alfabeto | `alphabet` |
| `i`   | Estado inicial | `initial` |
| `A`   | Estados de aceptación | `accepting` |
| `W`   | Transiciones `(origen,destino,símbolo)` | `transitions` y `matrix` |

## Dónde cambiar las variables

Las letras del archivo se leen en un único lugar: **`src/utils/parseAutomaton.js`**.

| Qué cambiar | Línea | Código |
|-------------|-------|--------|
| Letras que se reconocen en el .txt | 33 | `/^([QZiAW])\s*:\s*(.*)$/i` |
| Lista para detectar líneas faltantes | 37 | `['Q', 'Z', 'i', 'A', 'W']` |
| Estados (Q) | 42 | `parseSet(raw.Q)` |
| Alfabeto (Z) | 43 | `parseSet(raw.Z)` |
| Estado inicial (i) | 44 | `raw.i.trim()` |
| Estados de aceptación (A) | 45 | `parseSet(raw.A)` |
| Transiciones (W) | 48 | `raw.W.matchAll(...)` |
| Mensaje de error del alfabeto | 56 | `'El alfabeto (Z) está vacío'` |
| Comentario del formato (documentación) | 6 | `Z:{a,b1}` |

### Ejemplo: cambiar la letra del alfabeto

Si el alfabeto pasara de `Z` a otra letra (por ejemplo `S`), hay que modificar **tres puntos** del mismo archivo:

1. **Línea 33:** cambiar `Z` por `S` dentro de `[QZiAW]` → `[QSiAW]`.
2. **Línea 37:** cambiar `'Z'` por `'S'` en la lista.
3. **Línea 43:** cambiar `raw.Z` por `raw.S`.

Después, actualizar el mensaje de la línea 56, el comentario de la línea 6 y la línea correspondiente en los archivos `.txt` de prueba (`ejemplo.txt`).

> El archivo puede traer las letras en mayúscula o minúscula (`Z:` o `z:`, `i:` o `I:`); el código las normaliza a `Q`, `Z`, `i`, `A` y `W`. Si cambias una letra, usa en el código la misma forma que en las líneas 33 y 37.

## Dónde se muestran los datos

Los nombres internos (`states`, `alphabet`, `accepting`, `matrix`) los consumen estos componentes, por lo que no hace falta tocarlos si solo se cambian las letras del .txt

| Archivo | Qué muestra |
|---------|-------------|
| `src/components/FileDisplay.jsx` | Contenido del TXT tal como viene (no depende de las letras) |
| `src/components/VectorsPanel.jsx` | Vectores verticales. Los encabezados **Q**, **Σ** y **A** son texto fijo en las líneas 3 a 5 |
| `src/components/TransitionMatrix.jsx` | Matriz: encabezado **Estado**, símbolos del alfabeto y estados destino |

Para cambiar el rótulo de la columna del alfabeto en pantalla (por ejemplo `Σ` por `Z`), editar `label: 'Σ'` en la línea 4 de `VectorsPanel.jsx`.

## Otros ajustes frecuentes

| Qué | Dónde |
|-----|-------|
| Texto del footer | `src/components/Footer.jsx` |
| Colores (títulos y errores) | Variables `--accent-title` y `--accent-symbol` al inicio de `src/index.css` |
| Carga por arrastre | `src/components/DropZone.jsx` |
| Cuándo aparecen las secciones | `src/App.jsx`, bloque `{automaton && (...)}` |

## Estructura

```
src/
├── App.jsx                     # Estado general y distribución de la vista
├── index.css                   # Estilos (una sola vista, sin scroll)
├── main.jsx
├── components/
│   ├── DropZone.jsx
│   ├── FileDisplay.jsx
│   ├── VectorsPanel.jsx
│   ├── TransitionMatrix.jsx
│   └── Footer.jsx
└── utils/
    └── parseAutomaton.js       # Lectura y validación del TXT
```
