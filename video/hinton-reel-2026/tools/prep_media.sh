#!/usr/bin/env bash
# Pull the Higgsfield clips/images listed in tools/media_urls.tsv into the composition and write the manifest.
# Clips → 30 fps JPEG sequences in comp/assets/clips/<name>/ (gitignored); images → comp/assets/img/<name>.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p comp/assets/clips media
clips="{"; extra="["
while IFS=$'\t' read -r name url; do
  [ -z "$name" ] && continue
  ext="${url##*.}"
  [ -f "media/$name.$ext" ] || curl -sSf -o "media/$name.$ext" "$url"
  if [ "$ext" = "mp4" ]; then
    rm -rf "comp/assets/clips/$name"; mkdir -p "comp/assets/clips/$name"
    ffmpeg -v error -y -i "media/$name.mp4" -vf "fps=30,scale=1080:1936:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 3 "comp/assets/clips/$name/%04d.jpg"
    n=$(ls "comp/assets/clips/$name" | wc -l); clips="$clips\"$name\":$n,"
  else
    ffmpeg -v error -y -i "media/$name.$ext" -q:v 3 "comp/assets/img/$name.jpg"; extra="$extra\"$name.jpg\","
  fi
done < tools/media_urls.tsv
echo "window.MANIFEST = { clips: ${clips%,}}, extra: ${extra%,}] };" > comp/assets/data/manifest.js
cat comp/assets/data/manifest.js
