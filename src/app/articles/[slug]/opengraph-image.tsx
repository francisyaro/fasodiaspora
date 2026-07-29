import { ImageResponse } from 'next/og';
import { fetchArticleBySlug } from '@/lib/supabase';

// export const runtime = 'edge'; // Commented out to support Node.js environment fallback (fs/path)

// Métadonnées de l'image de partage
export const alt = 'Faso Diaspora';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: 'white',
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          Faso Diaspora
        </div>
      ),
      { ...size }
    );
  }

  // Format date
  const formattedDate = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#0f172a',
          backgroundImage: `url(${article.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Dark linear gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.3) 100%)',
            display: 'flex',
          }}
        />

        {/* Content Overlay */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 80px',
            color: 'white',
            width: '100%',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            {/* Logo Badge */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#dc2626', // burkina-red
                color: 'white',
                fontWeight: 900,
                fontSize: '18px',
                padding: '6px 16px',
                borderRadius: '6px',
                marginRight: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Faso Diaspora
            </div>

            {/* Category */}
            <div
              style={{
                display: 'flex',
                color: '#eab308', // burkina-yellow
                fontSize: '18px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {article.category}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              lineHeight: '1.25',
              marginBottom: '24px',
              wordBreak: 'break-word',
              color: '#ffffff',
            }}
          >
            {article.title}
          </div>

          {/* Metadata Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              color: '#94a3b8', // slate-400
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex', color: '#cbd5e1' }}>Par {article.author}</div>
            <div style={{ margin: '0 12px', color: '#64748b' }}>•</div>
            <div style={{ display: 'flex' }}>{formattedDate}</div>
            <div style={{ margin: '0 12px', color: '#64748b' }}>•</div>
            <div style={{ display: 'flex' }}>{article.read_time}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
