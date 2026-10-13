from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CHARACTER_SOURCE = ROOT / "public/assets/characters"
CHARACTER_FULL = CHARACTER_SOURCE / "full"
CHARACTER_THUMBS = CHARACTER_SOURCE / "thumb"
SCENE_SOURCE = ROOT / "public/assets/scenes"


def resize_to_fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    copy = image.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def optimize_characters() -> None:
    CHARACTER_FULL.mkdir(parents=True, exist_ok=True)
    CHARACTER_THUMBS.mkdir(parents=True, exist_ok=True)

    for source in sorted(CHARACTER_SOURCE.glob("*.png")):
        with Image.open(source) as image:
            rgba = image.convert("RGBA")
            full = resize_to_fit(rgba, (720, 960))
            thumb = resize_to_fit(rgba, (360, 480))
            full.save(
                CHARACTER_FULL / f"{source.stem}.webp",
                "WEBP",
                quality=84,
                method=6,
                exact=True,
            )
            thumb.save(
                CHARACTER_THUMBS / f"{source.stem}.webp",
                "WEBP",
                quality=78,
                method=6,
                exact=True,
            )


def optimize_scenes() -> None:
    for source in sorted(SCENE_SOURCE.glob("*.jpg")):
        with Image.open(source) as image:
            rgb = image.convert("RGB")
            scene = resize_to_fit(rgb, (1440, 810))
            scene.save(
                SCENE_SOURCE / f"{source.stem}.webp",
                "WEBP",
                quality=80,
                method=6,
            )


if __name__ == "__main__":
    optimize_characters()
    optimize_scenes()
