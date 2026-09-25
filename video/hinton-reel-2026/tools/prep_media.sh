#!/usr/bin/env bash
# Bring the Higgsfield clips/stills listed in tools/media_urls.tsv into the composition and write the manifest.
# Files already in media/ are used as-is (e.g. downloaded by hand); unreachable ones are skipped (still fallback).
# Clips → 30 fps JPEG sequences in comp/assets/clips/<name>/ (gitignored); stills → comp/assets/img/<name>.jpg
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p comp/assets/clips media
clips="{"; extra="["
seq_from() {  # name, source mp4, extra ffmpeg input args, filter prefix
  rm -rf "comp/assets/clips/$1"; mkdir -p "comp/assets/clips/$1"
  ffmpeg -nostdin -v error -y $3 -i "$2" -vf "${4}fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 3 "comp/assets/clips/$1/%04d.jpg"
  clips="$clips\"$1\":$(ls "comp/assets/clips/$1" | wc -l),"
}
while IFS=$'\t' read -r name url; do
  [ -z "$name" ] && continue
  ext="${url##*.}"
  [ -f "media/$name.$ext" ] || curl -sSf -o "media/$name.$ext" "$url" 2>/dev/null || { echo "skip $name (not available)"; continue; }
  if [ "$ext" = "mp4" ]; then
    seq_from "$name" "media/$name.mp4" "" ""
  else
    ffmpeg -nostdin -v error -y -i "media/$name.$ext" -q:v 3 "comp/assets/img/$name.jpg"; extra="$extra\"$name.jpg\","
  fi
done < tools/media_urls.tsv
# derived: the coins clip's payoff (last 1.74 s) as smooth 2× slow motion
if [ -f media/v10_coins.mp4 ]; then
  seq_from v10_coins_slow media/v10_coins.mp4 "-ss 3.3 -t 1.74" "setpts=2.0*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
fi
echo "window.MANIFEST = { clips: ${clips%,}}, extra: [${extra#[}] };" | sed 's/, extra: \[\]/, extra: []/; s/,\] };/] };/' > comp/assets/data/manifest.js
cat comp/assets/data/manifest.js
