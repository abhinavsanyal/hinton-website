#!/bin/bash
for TIER in "1280:720 720" "960:540 540" "640:360 360"; do
  set -- $TIER
  echo "Extracting tier $2 (PNG)..."
  mkdir -p public/loader/frames/$2
  ffmpeg -v error -i public/loader/hinton-logo-source.mp4 \
    -an -vsync 0 -vf "scale=$1" \
    "public/loader/frames/$2/f_%04d.png"
  
  echo "Converting tier $2 to WEBP..."
  for f in public/loader/frames/$2/*.png; do
    cwebp -q 82 -m 6 "$f" -o "${f%.png}.webp" >/dev/null 2>&1
    rm "$f"
  done
done
echo "Done extracting and converting."
