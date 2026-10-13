import { AssetImage } from './AssetImage'

interface CharacterArtProps {
  image: string
  name: string
  className?: string
  eager?: boolean
}

export function CharacterArt({ image, name, className = '', eager = false }: CharacterArtProps) {
  return (
    <AssetImage
      className={`character-art ${className}`}
      src={image}
      alt={`${name}人物立绘`}
      eager={eager}
      fallbackLabel={name.slice(0, 1)}
    />
  )
}
