"""Synthesises public/soundtrack.wav: a 120 bpm A-minor bed with the effects mixed in on the video's cues.

Everything is generated here (no samples), so the track is ours to publish. Cue times match Showcase.tsx:
scenes start at 0s (glyph), 4.5s (hero), 8.0s (facts) and 10.9s (contact). Re-run after changing timings:
    python scripts/soundtrack.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
LENGTH = 16.4
BEAT = 0.5  # 120 bpm
rng = np.random.default_rng(7)
out = np.zeros(int(SR * LENGTH))


def t(seconds):
    return np.arange(int(SR * seconds)) / SR


def add(signal, at, gain=1.0):
    start = int(at * SR)
    end = min(len(out), start + len(signal))
    if start < len(out):
        out[start:end] += signal[: end - start] * gain


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lowpass(signal, cutoff):
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(signal)
    acc = 0.0
    for i, x in enumerate(signal):
        acc += alpha * (x - acc)
        y[i] = acc
    return y


def kick():
    x = t(0.35)
    freq = 45 + 85 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-x * 9)


def hat():
    x = t(0.05)
    return np.diff(rng.standard_normal(len(x) + 1)) * np.exp(-x * 90) * 0.25


def bass(midi, length):
    x = t(length)
    f = note(midi)
    saw = sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 6))
    return lowpass(saw, 500) * np.exp(-x * 3) * 0.6


def pad(chord, length):
    x = t(length)
    env = np.minimum(x / 0.4, 1) * np.minimum((length - x) / 0.4, 1)
    tone = sum(np.sin(2 * np.pi * note(m) * x) + 0.5 * np.sin(2 * np.pi * note(m) * 1.003 * x) for m in chord)
    return tone * env / len(chord) * 0.25


def chime(midi, length=1.0):
    x = t(length)
    f = note(midi)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-x * 5)


def noise_sweep(length, f_from, f_to, rising=True):
    x = t(length)
    n = rng.standard_normal(len(x))
    cutoff = np.linspace(f_from, f_to, len(x))
    y = np.empty_like(n)
    acc = 0.0
    for i, v in enumerate(n):  # time-varying one-pole lowpass
        acc += (1 - np.exp(-2 * np.pi * cutoff[i] / SR)) * (v - acc)
        y[i] = acc
    env = (x / length) ** 2 if rising else np.sin(np.pi * x / length) ** 2
    return y * env


def click():
    x = t(0.012)
    return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 500)


# --- Music bed: Am - F - C - G, one chord per bar (2s) ---------------------------------------------------
progression = [(57, [69, 72, 76]), (53, [65, 69, 72]), (48, [64, 67, 72]), (55, [67, 71, 74])]
for bar in range(9):
    at = bar * 4 * BEAT
    root, chord = progression[bar % 4]
    if at >= LENGTH - 1:
        break
    add(pad(chord, 4 * BEAT), at, 1.3)
    for step in range(8):  # eighth-note hats throughout
        add(hat(), at + step * BEAT / 2, 0.5 if step % 2 else 0.8)
    for beat in range(4):
        if at + beat * BEAT >= 4.5:  # the beat drops in with the hero
            add(kick(), at + beat * BEAT, 0.55)
            add(bass(root - 12, BEAT / 2), at + beat * BEAT + BEAT / 2, 0.7)
# Final A-minor chord rings out under the contact scene's ending.
add(pad([69, 72, 76, 81], 1.6), 14.8, 1.1)

# --- Effects, on the video's cues ------------------------------------------------------------------------
add(noise_sweep(1.8, 300, 6000), 0.6, 0.5)  # dive into the s
add(np.sin(2 * np.pi * np.cumsum(np.linspace(220, 880, int(1.8 * SR))) / SR) * t(1.8) / 1.8, 0.6, 0.12)
boom = kick() * 1.4
add(boom, 2.4, 1.0)  # inside the letter: black
add(noise_sweep(1.1, 6000, 400, rising=False), 2.7, 0.35)  # the I backs out
add(chime(81, 1.2), 3.6, 0.35)  # the red S lands
add(noise_sweep(0.5, 800, 5000), 4.2, 0.25)  # into the hero
add(noise_sweep(0.5, 800, 5000), 7.6, 0.25)  # into the facts

# Counter ticks: one per number the odometers roll past (ease-out cubic over 2s, staggered 0.25s).
for index, value in enumerate([9, 5, 4]):
    start = 8.0 + 0.2 + index * 0.25
    for k in range(1, value + 1):
        p = k / value
        add(click(), start + 2 * (1 - (1 - p) ** (1 / 3)), 0.25)

add(noise_sweep(0.6, 500, 4000), 10.4, 0.3)  # the page lifts off the footer
add(chime(88, 0.3), 12.85, 0.12)  # cursor reaches the pill
add(click(), 13.5, 0.6)  # click down
add(click(), 13.56, 0.4)  # and up
for i, m in enumerate([81, 84, 88, 93]):  # sparks
    add(chime(m, 0.4), 13.52 + i * 0.04, 0.12)
add(chime(76, 0.9), 13.9, 0.2)  # download chip

# Fade the tail and normalise to -1 dBFS.
fade = int(0.8 * SR)
out[-fade:] *= np.linspace(1, 0, fade)
out *= 10 ** (-1 / 20) / np.max(np.abs(out))
pcm = (out * 32767).astype(np.int16)
stereo = np.repeat(pcm[:, None], 2, axis=1)

path = Path(__file__).resolve().parent.parent / "public" / "soundtrack.wav"
with wave.open(str(path), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(stereo.tobytes())
print(f"wrote {path} ({LENGTH}s)")
