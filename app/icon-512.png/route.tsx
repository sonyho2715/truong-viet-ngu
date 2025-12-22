import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#facc15',
          fontWeight: 'bold',
          borderRadius: 64,
        }}
      >
        TV
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
