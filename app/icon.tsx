import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#265C4B', // forest-700
          color: '#F8FAF8', // paper-50
          fontSize: 240,
          fontWeight: 700,
          borderRadius: '20%',
        }}
      >
        D
      </div>
    ),
    { ...size }
  )
}
