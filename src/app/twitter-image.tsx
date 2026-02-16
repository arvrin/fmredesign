import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Freaking Minds - Creative Marketing Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  // Use older User-Agent to get TTF format (Satori doesn't support WOFF2)
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+' } }
  ).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\)/);
  if (!match?.[1]) throw new Error(`Font not found for ${family}:${weight}`);
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function Image() {
  // Read logo as base64 for embedding
  const logoPath = join(process.cwd(), 'public', 'logo.png');
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  // Load fonts from Google Fonts CSS API (reliable URLs)
  const [playfairFont, jakartaFont] = await Promise.all([
    loadGoogleFont('Playfair Display', 700),
    loadGoogleFont('Plus Jakarta Sans', 600),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #fef5f8 0%, #f9dce6 25%, #f0bfd2 50%, #f9dce6 75%, #fef5f8 100%)',
        }}
      >
        {/* Atmospheric bloom — top left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '500px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(120, 20, 60, 0.22) 0%, transparent 65%)',
          }}
        />

        {/* Atmospheric bloom — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '450px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(100, 10, 55, 0.2) 0%, transparent 60%)',
          }}
        />

        {/* Vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(100, 15, 50, 0.1) 100%)',
          }}
        />

        {/* Decorative stars */}
        {[
          { left: 80, top: 60, size: 4 },
          { left: 1050, top: 90, size: 3.5 },
          { left: 1100, top: 450, size: 4 },
          { left: 300, top: 520, size: 3 },
          { left: 50, top: 400, size: 3 },
          { left: 700, top: 50, size: 2.5 },
        ].map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.left}px`,
              top: `${star.top}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              background: `rgba(140, 20, 65, ${0.3 + (i % 3) * 0.15})`,
              boxShadow: `0 0 ${star.size * 4}px rgba(140, 20, 65, 0.4)`,
            }}
          />
        ))}

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src={logoBase64}
            width={280}
            height={174}
            style={{ objectFit: 'contain' }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '28px',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: '"Playfair Display"',
                fontSize: '36px',
                fontWeight: 700,
                color: '#1a0a12',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Strategy. Design. Growth.
            </span>

            <span
              style={{
                fontFamily: '"Plus Jakarta Sans"',
                fontSize: '18px',
                fontWeight: 600,
                color: '#6b4a5a',
                letterSpacing: '0.02em',
                lineHeight: 1.4,
              }}
            >
              Full-service creative marketing for ambitious brands
            </span>
          </div>
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(140, 29, 74, 0.95) 0%, rgba(168, 37, 72, 0.95) 100%)',
          }}
        >
          <span
            style={{
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: '16px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.08em',
            }}
          >
            freakingminds.in
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairFont,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Plus Jakarta Sans',
          data: jakartaFont,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
}
