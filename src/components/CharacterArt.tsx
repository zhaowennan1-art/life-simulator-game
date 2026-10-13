import { useState } from 'react'
import { assetUrl } from '../lib'

interface CharacterArtProps {
  image: string
  name: string
  className?: string
  eager?: boolean
}

export function CharacterArt({ image, name, className = '', eager = false }: CharacterArtProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={`art-fallback ${className}`} role="img" aria-label={`${name}的占位立绘`}><span>{name.slice(0, 1)}</span></div>
  }

  return (
    <img
      className={className}
      src={assetUrl(image)}
      alt={`${name}人物立绘`}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  )
}
