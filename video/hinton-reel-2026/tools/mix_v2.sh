#!/usr/bin/env bash
# Final mix: VO (compressed, warmed, small room) + score ducked under VO + SFX, loudness-normalised for Instagram (-14 LUFS, -1 dBTP).
set -euo pipefail
cd "$(dirname "$0")/../audio"
FC="[0:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-22dB:ratio=3.5:attack=4:release=140:makeup=4,aecho=0.9:0.6:38|67:0.10|0.06,volume=2.0,asplit=2[vo][sc];
[1:a]volume=0.5[m];[m][sc]sidechaincompress=threshold=0.01:ratio=10:attack=20:release=380:makeup=1[md];
[2:a]volume=0.65[fx];
[vo][md][fx]amix=inputs=3:normalize=0:duration=longest,alimiter=limit=0.95:attack=3:release=60[pre]"
ffmpeg -v error -y -i vo.wav -i score.wav -i sfx.wav -filter_complex "$FC" -map "[pre]" -ar 48000 -c:a pcm_s24le premix.wav
M=$(ffmpeg -hide_banner -i premix.wav -af loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
get() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i premix.wav -af "loudnorm=I=-14:TP=-1.0:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" -ar 48000 -c:a pcm_s24le mix.wav && ffmpeg -v error -y -i mix.wav -c:a flac mix.flac
ffmpeg -hide_banner -i mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
