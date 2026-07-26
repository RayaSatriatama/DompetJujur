import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DompetJujur',
    short_name: 'DompetJujur',
    description: 'Beri jarak sebelum bertindak. Jeda 90 detik sebelum keputusan impulsif finansial.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#F8FAF8',
    theme_color: '#265C4B',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
