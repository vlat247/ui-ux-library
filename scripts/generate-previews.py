#!/usr/bin/env python3
"""Render the library's three original, silent motion-study previews.

Dependencies: Python 3.10+, Pillow, NumPy, and ffmpeg with libx264. No network,
third-party footage, downloaded assets, or graphics APIs are used. The type study
uses a locally installed font; pass --font to reproduce it on another machine.

Run from the repository root:
    python3 scripts/generate-previews.py

On the Codex desktop bundle used to author these assets:
    /Users/vlat247/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/generate-previews.py

Output: 720 x 480, 24 fps, 4 seconds, H.264/yuv420p/faststart MP4s and JPEG
posters. All animation phases are periodic and use frame / (fps * duration),
without duplicating the first frame at the end. Geometry, colors, lighting,
typography composition, and animation are original procedural studies authored
for ui-ux-library. Reproduction is deterministic with the same font and toolchain.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path
import shutil
import subprocess
import time

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH, HEIGHT, FPS, DURATION = 720, 480, 24, 4
SCALE = 2
TAU = math.tau
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "previews"
RESAMPLE = Image.Resampling.LANCZOS
FONT_CANDIDATES = (
    "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "/Library/Fonts/Arial Black.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
)


def normalize(v: np.ndarray) -> np.ndarray:
    return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-8)


def rotation(x: float = 0, y: float = 0, z: float = 0) -> np.ndarray:
    cx, sx, cy, sy, cz, sz = (
        math.cos(x), math.sin(x), math.cos(y), math.sin(y), math.cos(z), math.sin(z)
    )
    return np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]]) @ np.array(
        [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]]
    ) @ np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])


def backdrop(kind: str) -> Image.Image:
    yy, xx = np.mgrid[0:HEIGHT * SCALE, 0:WIDTH * SCALE]
    x, y = xx / SCALE, yy / SCALE
    if kind == "ribbon":
        rgb = np.zeros((*x.shape, 3)) + (11, 13, 20)
        warm = np.exp(-(((x - 495) / 290) ** 2 + ((y - 278) / 235) ** 2))
        cool = np.exp(-(((x - 180) / 235) ** 2 + ((y - 95) / 205) ** 2))
        rgb += warm[..., None] * np.array([15, 4, 0])
        rgb += cool[..., None] * np.array([0, 5, 11])
    elif kind == "orbit":
        rgb = np.zeros((*x.shape, 3)) + (12, 15, 21)
        glow = np.exp(-(((x - 340) / 340) ** 2 + ((y - 228) / 240) ** 2))
        rgb += glow[..., None] * np.array([13, 13, 14])
        rgb += np.exp(-(((x - 110) / 220) ** 2 + ((y - 350) / 180) ** 2))[..., None] * np.array([9, 4, 1])
    else:
        rgb = np.zeros((*x.shape, 3)) + (20, 20, 19)
        rgb += np.exp(-(((x - 360) / 400) ** 2 + ((y - 220) / 310) ** 2))[..., None] * np.array([7, 6, 4])
    # A fixed, nearly imperceptible dither prevents visible gradient banding.
    rgb += np.random.default_rng(43).uniform(-0.32, 0.32, (*x.shape, 1))
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


BACKDROPS = {kind: backdrop(kind) for kind in ("ribbon", "orbit", "type")}


def ground(image: Image.Image, center: tuple[float, float], size: tuple[float, float], opacity: int = 110) -> None:
    layer = Image.new("RGBA", image.size)
    draw = ImageDraw.Draw(layer)
    x, y = center
    rx, ry = size
    draw.ellipse(tuple(value * SCALE for value in (x-rx, y-ry, x+rx, y+ry)), fill=(0, 0, 0, opacity))
    layer = layer.filter(ImageFilter.GaussianBlur(17 * SCALE))
    image.paste(layer, (0, 0), layer)


def shaded_colors(normals: np.ndarray, base: np.ndarray, gloss: float = 0.5, double_sided: bool = False) -> np.ndarray:
    n = normalize(normals)
    if double_sided:
        n = np.where(n[..., 2, None] < 0, -n, n)
    light = normalize(np.array([-0.65, -0.85, 1.4]))
    warm_light = normalize(np.array([1.0, -0.2, 0.65]))
    diffuse = np.clip(n @ light, 0, 1)
    fill = np.clip(n @ warm_light, 0, 1)
    half = normalize(light + np.array([0, 0, 1]))
    specular = np.clip(n @ half, 0, 1) ** 44
    broad_specular = np.clip(n @ half, 0, 1) ** 8
    rim = np.clip(1 - np.abs(n[..., 2]), 0, 1) ** 2
    color = base * (0.24 + 0.67 * diffuse[..., None] + 0.13 * fill[..., None])
    color += specular[..., None] * (150 * gloss) + broad_specular[..., None] * (29 * gloss)
    color += rim[..., None] * np.array([15, 19, 30])
    return np.clip(color, 0, 255).astype(np.uint8)


def mesh_faces(vertices: np.ndarray, normals: np.ndarray, colors: np.ndarray, *, gloss: float = 0.5, double_sided: bool = False) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    # A closed parameter seam is explicitly present in the final row/column.
    faces = np.stack((vertices[:-1, :-1], vertices[1:, :-1], vertices[1:, 1:], vertices[:-1, 1:]), axis=2).reshape(-1, 4, 3)
    normal = normalize(normals[:-1, :-1] + normals[1:, :-1] + normals[1:, 1:] + normals[:-1, 1:]).reshape(-1, 3)
    base = ((colors[:-1, :-1] + colors[1:, :-1] + colors[1:, 1:] + colors[:-1, 1:]) / 4).reshape(-1, 3)
    if not double_sided:
        visible = normal[:, 2] > -0.04
        faces, normal, base = faces[visible], normal[visible], base[visible]
    return faces, shaded_colors(normal, base, gloss, double_sided), faces[..., 2].mean(axis=1)


def draw_scene(image: Image.Image, meshes: list[tuple[np.ndarray, np.ndarray, np.ndarray]], center: tuple[float, float] = (360, 240)) -> Image.Image:
    faces = np.concatenate([item[0] for item in meshes])
    colors = np.concatenate([item[1] for item in meshes])
    depths = np.concatenate([item[2] for item in meshes])
    # Orthographic composition keeps the motion calm and the object's scale stable.
    points = (faces[..., :2] + np.array(center)) * SCALE
    draw = ImageDraw.Draw(image)
    for index in np.argsort(depths, kind="stable"):
        draw.polygon([tuple(point) for point in points[index]], fill=tuple(int(c) for c in colors[index]))
    return image.resize((WIDTH, HEIGHT), RESAMPLE)


def ribbon_mesh(t: float) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    phase = TAU * t
    u = np.linspace(0, TAU, 641)
    v = np.linspace(-1, 1, 41)
    morph = 0.15 * math.sin(phase)
    center = np.stack((
        213 * np.cos(u),
        (91 + 11 * math.cos(phase)) * np.sin(2*u),
        103 * np.sin(u) + 17 * np.sin(3*u + phase),
    ), axis=1)
    tangent = normalize(np.stack((
        -213 * np.sin(u),
        2 * (91 + 11 * math.cos(phase)) * np.cos(2*u),
        103 * np.cos(u) + 51 * np.cos(3*u + phase),
    ), axis=1))
    normal = normalize(np.cross(tangent, np.tile([0, 0, 1.0], (len(u), 1))))
    binormal = normalize(np.cross(tangent, normal))
    twist = u + 0.35 * math.sin(phase) + morph * np.cos(2*u)
    side = normal * np.cos(twist)[:, None] + binormal * np.sin(twist)[:, None]
    surface_normal = normalize(np.cross(tangent, side))
    width = 35 + 9 * np.cos(2*u - phase)
    vertices = center[:, None, :] + side[:, None, :] * (v[None, :, None] * width[:, None, None])
    # A very shallow barrel across the strip gives it a satin highlight.
    vertices += surface_normal[:, None, :] * ((1-v*v)[None, :, None] * 4)
    normals = normalize(surface_normal[:, None, :] + side[:, None, :] * v[None, :, None] * 0.23)
    transform = rotation(x=-0.20, y=0.22 * math.sin(phase), z=-0.26 + 0.07 * math.cos(phase))
    vertices, normals = vertices @ transform.T, normals @ transform.T
    blend = (0.5 + 0.5 * np.cos(u - 0.2)) ** 0.75
    coral, blue = np.array([246, 111, 76]), np.array([73, 109, 248])
    palette = coral[None, :] * blend[:, None] + blue[None, :] * (1-blend[:, None])
    colors = np.tile(palette[:, None, :], (1, len(v), 1))
    # Warm edges quietly reveal the strip thickness without drawn outlines.
    colors += (np.abs(v)[None, :, None] ** 10) * np.array([13, 9, 4])
    return mesh_faces(vertices, normals, colors, gloss=0.85, double_sided=True)


def chromatic_ribbons(t: float) -> Image.Image:
    image = BACKDROPS["ribbon"].copy()
    ground(image, (369, 384), (190, 17), 135)
    return draw_scene(image, [ribbon_mesh(t)], (360, 224))


def sphere(center: tuple[float, float, float], radius: float, color: tuple[int, int, int], phase: float) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    u, v = np.meshgrid(np.linspace(0, TAU, 193), np.linspace(0, math.pi, 113), indexing="ij")
    normals = np.stack((np.sin(v)*np.cos(u), np.cos(v), np.sin(v)*np.sin(u)), axis=-1)
    vertices = normals * radius + np.array(center)
    colors = np.zeros_like(vertices) + np.array(color)
    # A subtle colored reflection rotates with the scene's lighting cycle.
    reflection = np.clip(np.sin(u + phase) * 0.5 + 0.5, 0, 1)[..., None]
    colors += reflection * np.array([6, 3, 1])
    return mesh_faces(vertices, normals, colors, gloss=0.95)


def ring(radius: float, tube: float, transform: np.ndarray, color: tuple[int, int, int], shift: tuple[float, float, float] = (0, 0, 0)) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    u, v = np.meshgrid(np.linspace(0, TAU, 241), np.linspace(0, TAU, 17), indexing="ij")
    vertices = np.stack(((radius+tube*np.cos(v))*np.cos(u), (radius+tube*np.cos(v))*np.sin(u), tube*np.sin(v)), axis=-1)
    normals = np.stack((np.cos(v)*np.cos(u), np.cos(v)*np.sin(u), np.sin(v)), axis=-1)
    vertices = vertices @ transform.T + np.array(shift)
    normals = normals @ transform.T
    return mesh_faces(vertices, normals, np.zeros_like(vertices)+np.array(color), gloss=0.9)


def orbital_study(t: float) -> Image.Image:
    phase = TAU*t
    image = BACKDROPS["orbit"].copy()
    ground(image, (367, 392), (180, 16), 130)
    # Two large crossing orbital rings surround a grounded central sculpture.
    ring_a = rotation(x=1.13 + 0.10*math.sin(phase), y=0.28, z=-0.32)
    ring_b = rotation(x=0.53, y=1.01 + 0.12*math.cos(phase), z=0.48)
    satellite_angle = phase - 0.5
    satellite = np.array([177*math.cos(satellite_angle), 177*math.sin(satellite_angle), 0]) @ ring_a.T
    small_angle = -phase + 2.3
    small = np.array([142*math.cos(small_angle), 142*math.sin(small_angle), 0]) @ ring_b.T
    meshes = [
        ring(177, 4.3, ring_a, (225, 157, 107)),
        ring(142, 3.1, ring_b, (91, 125, 234)),
        sphere((9, 8, -3), 87, (228, 118, 65), phase),
        sphere(tuple(satellite), 35, (90, 124, 245), phase),
        sphere(tuple(small), 20, (237, 216, 183), -phase),
    ]
    return draw_scene(image, meshes, (356, 226))


def find_font(explicit: str | None) -> Path:
    candidates = [explicit] if explicit else FONT_CANDIDATES
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return Path(candidate)
    raise SystemExit("No suitable local bold font found. Pass --font /path/to/font.ttf.")


def word_mask(word: str, font_path: Path, width: int, height: int) -> Image.Image:
    font = ImageFont.truetype(str(font_path), 200*SCALE)
    bounds = font.getbbox(word)
    mask = Image.new("L", (bounds[2]-bounds[0]+8*SCALE, bounds[3]-bounds[1]+8*SCALE))
    ImageDraw.Draw(mask).text((4*SCALE-bounds[0], 4*SCALE-bounds[1]), word, font=font, fill=255, stroke_width=0)
    return mask.resize((width*SCALE, height*SCALE), RESAMPLE)


def make_kinetic_type(font_path: Path):
    masks = [np.asarray(word_mask(word, font_path, 584, 133), dtype=np.uint8) for word in ("FORM", "SHIFT")]
    # Reusable coordinate arrays keep the renderer compact and deterministic.
    yy, xx = np.mgrid[0:HEIGHT*SCALE, 0:WIDTH*SCALE]
    px, py = xx/SCALE, yy/SCALE

    def frame(t: float) -> Image.Image:
        phase = TAU*t
        image = BACKDROPS["type"].copy()
        rgb = np.asarray(image).copy()
        for row, mask in enumerate(masks):
            top = 83 + row*155
            sign = 1 if row == 0 else -1
            # Inverse-mapped type bends as one continuous ribbon, retaining legibility.
            wave = 10*np.sin((py-top)/133*TAU + phase*sign)
            breathing = 1 + 0.025*math.sin(phase + row*math.pi)
            source_x = (px-68-wave-5*math.sin(phase+row*math.pi))/breathing*SCALE
            source_y = (py-top-6*math.cos(phase+row*math.pi))*SCALE
            ix, iy = source_x.astype(np.int32), source_y.astype(np.int32)
            valid = (ix>=0)&(ix<mask.shape[1])&(iy>=0)&(iy<mask.shape[0])
            alpha = np.zeros(px.shape, dtype=np.float32)
            alpha[valid] = mask[iy[valid], ix[valid]]/255
            color = np.array((231, 226, 211) if row == 0 else (234, 109, 73))
            # Cool reflection travels across the lower word as a broad studio light.
            if row:
                band = ((np.sin((px/720)*TAU-phase)+1)/2)**5
                layer_color = color + band[..., None]*np.array([-31, 11, 45])
            else:
                layer_color = color
            rgb = np.clip(rgb*(1-alpha[..., None])+layer_color*alpha[..., None], 0, 255).astype(np.uint8)
        image = Image.fromarray(rgb, "RGB")
        draw = ImageDraw.Draw(image)
        # Small registration marks frame the artwork rather than mimic product UI.
        neutral = (88, 87, 80)
        for x, y in ((49, 54), (671, 54), (49, 426), (671, 426)):
            draw.line(((x-4)*SCALE, y*SCALE, (x+4)*SCALE, y*SCALE), fill=neutral, width=SCALE)
            draw.line((x*SCALE, (y-4)*SCALE, x*SCALE, (y+4)*SCALE), fill=neutral, width=SCALE)
        return image.resize((WIDTH, HEIGHT), RESAMPLE)

    return frame


def encode(name: str, renderer, output: Path, ffmpeg: str, posters_only: bool) -> None:
    started = time.monotonic()
    poster = renderer(0.0)
    poster.save(output / f"{name}.jpg", quality=92, optimize=True, subsampling=0)
    if not posters_only:
        command = [
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
            "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "-",
            "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "23",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-threads", "1",
            "-metadata", "creation_time=2026-10-29T00:00:00Z",
            str(output / f"{name}.mp4"),
        ]
        process = subprocess.Popen(command, stdin=subprocess.PIPE)
        assert process.stdin is not None
        try:
            for index in range(FPS*DURATION):
                process.stdin.write(renderer(index/(FPS*DURATION)).tobytes())
            process.stdin.close()
            if process.wait():
                raise RuntimeError(f"ffmpeg failed rendering {name}")
        except BaseException:
            process.kill()
            process.wait()
            raise
        path = output / f"{name}.mp4"
        if path.stat().st_size >= 1_000_000:
            raise RuntimeError(f"{path.name} exceeds the 1 MB preview budget")
    print(f"{name}: {time.monotonic()-started:.1f}s", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", choices=("chromatic-ribbons", "orbital-study", "kinetic-type"))
    parser.add_argument("--output-dir", type=Path, default=OUTPUT)
    parser.add_argument("--font", help="Local bold TrueType/OpenType font used by the typography study")
    parser.add_argument("--posters-only", action="store_true")
    args = parser.parse_args()
    ffmpeg = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
    if not args.posters_only and not Path(ffmpeg).is_file():
        raise SystemExit("ffmpeg is required to encode the previews")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    renderers = {
        "chromatic-ribbons": chromatic_ribbons,
        "orbital-study": orbital_study,
        "kinetic-type": make_kinetic_type(find_font(args.font)),
    }
    for name, renderer in renderers.items():
        if args.only is None or name == args.only:
            encode(name, renderer, args.output_dir, ffmpeg, args.posters_only)


if __name__ == "__main__":
    main()
