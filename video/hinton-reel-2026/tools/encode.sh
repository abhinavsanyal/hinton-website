#!/usr/bin/env bash
# Final encodes: 2-pass H.264 (High, yuv420p, 30 fps, GOP 60) + AAC 256k from frames/ and audio/mix.wav.
#   out/hinton-reel-9x16.mp4   1080×1920 Reel master
#   out/hinton-reel-3x4.mp4    1080×1440 feed cut (centre crop; the layout keeps everything inside y 240–1680)
# usage: tools/encode.sh [preview-path]   (optional ~26 MB preview for chat/phone review)
set -euo pipefail
cd "$(dirname "$0")/.."
LOG=$(mktemp -d)
enc() {  # $1 out  $2 video bitrate  $3 extra -vf
  local vf=${3:-null}
  ffmpeg -nostdin -v error -y -framerate 30 -i frames/f_%05d.jpg -vf "$vf" -c:v libx264 -preset slow -profile:v high \
    -b:v "$2" -g 60 -pix_fmt yuv420p -pass 1 -passlogfile "$LOG/p" -an -f mp4 /dev/null
  ffmpeg -nostdin -v error -y -framerate 30 -i frames/f_%05d.jpg -i audio/mix.wav -vf "$vf" -c:v libx264 -preset slow \
    -profile:v high -b:v "$2" -maxrate "$(( ${2%k} * 2 ))k" -bufsize "$(( ${2%k} * 4 ))k" -g 60 -pix_fmt yuv420p -pass 2 \
    -passlogfile "$LOG/p" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$1"
}
enc out/hinton-reel-9x16.mp4 4800k
enc out/hinton-reel-3x4.mp4 4200k "crop=1080:1440:0:240"
if [ -n "${1:-}" ]; then
  ffmpeg -nostdin -v error -y -framerate 30 -i frames/f_%05d.jpg -i audio/mix.wav -c:v libx264 -preset slow -b:v 2300k \
    -maxrate 4600k -bufsize 9200k -g 60 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$1"
fi
rm -rf "$LOG"
ls -la out/hinton-reel-9x16.mp4 out/hinton-reel-3x4.mp4 ${1:+"$1"}
