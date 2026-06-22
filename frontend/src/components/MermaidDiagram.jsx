import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      // Clear any previous diagram
      containerRef.current.innerHTML = '';
      try {
        mermaid.render('mermaid-svg', chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Mermaid render error:', error);
        containerRef.current.innerHTML = `<p class="text-red-500">Invalid diagram syntax</p>`;
      }
    }
  }, [chart]);

  return <div ref={containerRef} className="mermaid flex justify-center" />;
}