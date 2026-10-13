import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../lib'

interface AssetImageProps {
  src: string
  alt: string
  className?: string
  eager?: boolean
  fallbackLabel?: string
}

type LoadState = 'loading' | 'loaded' | 'failed'

export function AssetImage({
  src,
  alt,
  className = '',
  eager = false,
  fallbackLabel = '图片暂时无法加载',
}: AssetImageProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const image = imageRef.current
    if (!image?.complete) {
      setLoadState('loading')
      return
    }
    setLoadState(image.naturalWidth > 0 ? 'loaded' : 'failed')
  }, [src])

  return (
    <span
      className={`asset-image ${className} is-${loadState}`}
      aria-busy={loadState === 'loading'}
    >
      <span className="asset-placeholder" aria-hidden="true" />
      {loadState !== 'failed' ? (
        <img
          ref={imageRef}
          src={assetUrl(src)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'low'}
          onLoad={() => setLoadState('loaded')}
          onError={() => setLoadState('failed')}
        />
      ) : (
        <span className="asset-fallback" role="img" aria-label={`${alt}加载失败`}>
          <span>{fallbackLabel}</span>
        </span>
      )}
    </span>
  )
}
