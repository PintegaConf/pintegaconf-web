// Iconos de redes sociales: constantes propias (no datos externos), dibujados en 24×24 con currentColor.
// Los usan el pie (layout/Redes.astro) y las ventanas de los ponentes (secciones/Ponentes.astro).
export const iconosRedes = {
  LinkedIn:
    '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.5a2.5 2.5 0 0 1 5 0V17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  Instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>',
  X: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>',
  GitHub:
    '<path fill="currentColor" d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.1 9 7.5 10.4.6.1.8-.2.8-.5v-2c-2.8.5-3.5-.7-3.7-1.3-.1-.3-.7-1.3-1.1-1.6-.4-.2-.9-.7 0-.7.9 0 1.5.8 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10 10 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 3 0 4.2-2.6 5.2-5 5.4.4.3.7 1 .7 2v3c0 .3.2.6.8.5A11 11 0 0 0 23 12c0-6.1-4.9-11-11-11z"/>',
  Web: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
} as const;

export type NombreRed = keyof typeof iconosRedes;
