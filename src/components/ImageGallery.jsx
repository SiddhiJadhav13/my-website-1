import React, { useState } from 'react';

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1560184897-6af7b2bd6f3e?q=80&w=1400&auto=format&fit=crop', alt: 'Agent at doorstep' },
  { src: 'https://images.unsplash.com/photo-1555529771-5a12b0ee2d1f?q=80&w=1400&auto=format&fit=crop', alt: 'Signing documents' },
  { src: 'https://images.unsplash.com/photo-1573164574398-2f48f2a7b4b7?q=80&w=1400&auto=format&fit=crop', alt: 'Happy customer' },
  { src: 'https://images.unsplash.com/photo-1520975910502-1f9f7a1f1c3b?q=80&w=1400&auto=format&fit=crop', alt: 'Office interaction' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop', alt: 'City skyline' },
];

export default function ImageGallery() {
  const [index, setIndex] = useState(null);

  function open(i) { setIndex(i); document.body.style.overflow = 'hidden'; }
  function close() { setIndex(null); document.body.style.overflow = ''; }
  function prev() { setIndex((i) => (i === 0 ? IMAGES.length - 1 : i - 1)); }
  function next() { setIndex((i) => (i === IMAGES.length - 1 ? 0 : i + 1)); }

  return (
    <div className="image-gallery">
      <div className="thumb-grid">
        {IMAGES.map((img, i) => (
          <button key={i} className="thumb" onClick={() => open(i)} aria-label={`Open ${img.alt}`}>
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>

      {index !== null && (
        <div className="lightbox" onClick={close}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={close} aria-label="Close">✕</button>
            <button className="lb-prev" onClick={prev} aria-label="Previous">‹</button>
            <img className="lb-image" src={IMAGES[index].src} alt={IMAGES[index].alt} />
            <button className="lb-next" onClick={next} aria-label="Next">›</button>
            <div className="lb-caption">{IMAGES[index].alt}</div>
          </div>
        </div>
      )}
    </div>
  );
}