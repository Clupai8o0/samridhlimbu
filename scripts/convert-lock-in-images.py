#!/usr/bin/env python3
"""Convert and compress Lock-In project images to WebP."""

from pathlib import Path
from PIL import Image

SOURCES = [
    (
        Path("/Users/clupa/Downloads/_TMwKvqsO3w.blob.jpeg"),
        Path(__file__).parent.parent / "public/projects/lock-in/dashboard.webp",
    ),
    (
        Path("/Users/clupa/Downloads/Arduino Uno Motion-2026-06-09-030909.png"),
        Path(__file__).parent.parent / "public/projects/lock-in/circuit.webp",
    ),
]

MAX_WIDTH = 1400
QUALITY = 82

for src, dest in SOURCES:
    if not src.exists():
        print(f"SKIP  {src.name} — not found")
        continue
    img = Image.open(src).convert("RGB")
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    kb_before = src.stat().st_size // 1024
    kb_after = dest.stat().st_size // 1024
    print(f"OK    {src.name}  →  {dest.name}  ({kb_before} KB → {kb_after} KB)")
