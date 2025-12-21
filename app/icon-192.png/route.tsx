import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#1e3a5f',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4a853',
          fontWeight: 'bold',
          borderRadius: 24,
        }}
      >
        TV
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
