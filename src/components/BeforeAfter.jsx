import { useState } from 'react'

// Before is the base layer; After is revealed from the right edge with clip-path.
// A transparent range input covers the frame so mouse, touch and keyboard all work.
export default function BeforeAfter({ before, after, beforeAlt, afterAlt }) {
  const [pos, setPos] = useState(50)

  return (
    <div className="ba">
      <img className="ba-img" src={before} alt={beforeAlt} loading="lazy" draggable="false" />
      <img
        className="ba-img"
        src={after}
        alt={afterAlt}
        loading="lazy"
        draggable="false"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />
      <span className="ba-tag ba-tag-before">Before</span>
      <span className="ba-tag ba-tag-after">After</span>
      <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="ba-knob">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <input
        className="ba-range"
        type="range"
        min="0"
        max="100"
        step="0.5"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
      />
    </div>
  )
}
