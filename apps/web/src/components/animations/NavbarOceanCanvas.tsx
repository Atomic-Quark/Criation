"use client";

import React, { useEffect, useRef } from "react";

interface NavbarOceanCanvasProps {
  theme?: "light" | "dark";
}

export function NavbarOceanCanvas({ theme = "light" }: NavbarOceanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<"light" | "dark">(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL not supported for NavbarOceanCanvas");
      return;
    }

    const VS = `
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

    const FS = `
precision highp float;

uniform vec2  uR;   // canvas resolution in pixels
uniform float uT;   // seconds since mount
uniform float uS;   // 0.0 = sunset day, 1.0 = moonlit night

const float HORIZON = -0.02;

// ===========================================================================
//  2D HASH & NOISE UTILITIES
// ===========================================================================
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  return fract((p + p) * p);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = m * p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// ===========================================================================
//  SKY PALETTES
// ===========================================================================
vec3 getSkyColor(vec2 uv, float dayNight) {
  float h = clamp((uv.y - HORIZON) * 2.2 + 0.15, 0.0, 1.0);

  // Sunset Day: Golden horizon -> Coral -> Warm Azure
  vec3 dHori = vec3(0.98, 0.64, 0.22);
  vec3 dMid  = vec3(0.92, 0.42, 0.28);
  vec3 dTop  = vec3(0.22, 0.46, 0.82);
  vec3 day = mix(mix(dHori, dMid, smoothstep(0.0, 0.45, h)),
                 dTop, smoothstep(0.35, 1.0, h));

  // Moonlit Night: Deep cosmic sapphire -> Midnight violet -> Dark obsidian
  vec3 nHori = vec3(0.06, 0.08, 0.18);
  vec3 nMid  = vec3(0.02, 0.03, 0.09);
  vec3 nTop  = vec3(0.005, 0.008, 0.035);
  vec3 night = mix(mix(nHori, nMid, smoothstep(0.0, 0.50, h)),
                   nTop, smoothstep(0.35, 1.0, h));

  return mix(day, night, dayNight);
}

// ===========================================================================
//  STARS & SHOOTING METEORS
// ===========================================================================
vec3 renderStars(vec2 uv, vec3 col, float dayNight) {
  if (dayNight < 0.05 || uv.y < HORIZON + 0.01) return col;

  // Gentle twinkling star field
  for (int i = 0; i < 2; i++) {
    float scale = float(i == 0 ? 45.0 : 75.0);
    vec2 p = uv * scale;
    vec2 cell = floor(p);
    float h = hash12(cell + float(i) * 123.0);

    if (h > 0.84) {
      vec2 starPos = cell + vec2(hash12(cell + 3.1), hash12(cell + 7.9));
      float d = length(p - starPos);
      float tw = 0.75 + 0.25 * sin(uT * (0.4 + 0.4 * h) + h * 6.28);
      float star = exp(-d * (14.0 + float(i) * 5.0)) * tw;
      vec3 starCol = mix(vec3(0.88, 0.94, 1.00), vec3(1.00, 0.88, 0.70), hash12(cell + 13.0));
      col += starCol * star * 1.1 * dayNight;
    }
  }

  // Shooting meteors
  for (int m = 0; m < 3; m++) {
    float mId = float(m);
    float mCycle = 4.0 + mId * 2.5;
    float mProgress = fract((uT + mId * 4.2) / mCycle);

    if (mProgress < 0.25) {
      float tLocal = mProgress / 0.25;
      vec2 start = vec2(-0.8 + hash11(mId * 19.3) * 1.6, 0.35 + hash11(mId * 31.7) * 0.15);
      vec2 dir = normalize(vec2(1.4 + hash11(mId * 7.1) * 0.5, -0.6 - hash11(mId * 5.3) * 0.3));
      vec2 head = start + dir * tLocal * 0.9;

      vec2 toUV = uv - head;
      float proj = dot(toUV, -dir);
      if (proj > 0.0 && proj < 0.25) {
        vec2 perp = toUV + dir * proj;
        float distPerp = length(perp);
        float trailFade = pow(1.0 - (proj / 0.25), 1.8);
        float meteor = exp(-distPerp * 350.0) * trailFade;
        col += vec3(1.00, 0.95, 0.85) * meteor * 2.5 * dayNight;
      }
    }
  }

  return col;
}

// ===========================================================================
//  SUN & MOON
// ===========================================================================
vec3 renderSun(vec2 uv, vec3 col, vec2 pos, float sunVis) {
  if (sunVis < 0.01) return col;
  float d = length(uv - pos);

  // Soft radiant bloom
  float aura = exp(-d * 4.5) * 1.4 + exp(-d * 1.6) * 0.6;
  col += vec3(1.00, 0.78, 0.32) * aura * sunVis;

  float SUN_R = 0.18;
  float disc = smoothstep(SUN_R, SUN_R - 0.03, d);
  if (disc > 0.001) {
    float r = clamp(d / SUN_R, 0.0, 1.0);
    vec3 sunColor = mix(vec3(1.0, 1.0, 0.96), vec3(1.0, 0.82, 0.38), pow(r, 1.5));
    col = mix(col, sunColor, disc * sunVis);
  }
  return col;
}

vec3 renderMoon(vec2 uv, vec3 col, vec2 pos, float moonVis) {
  if (moonVis < 0.01) return col;
  float d = length(uv - pos);

  // Lunar halo
  float halo = exp(-d * 4.0) * 0.22 + exp(-d * 10.0) * 0.3;
  col += vec3(0.75, 0.85, 1.00) * halo * moonVis;

  float MOON_R = 0.15;
  float disc = smoothstep(MOON_R, MOON_R - 0.02, d);
  if (disc > 0.001) {
    vec2 q = (uv - pos) / MOON_R;
    float r2 = dot(q, q);
    if (r2 < 1.0) {
      float z = sqrt(1.0 - r2);
      vec3 n = normalize(vec3(q, z));
      float diff = clamp(dot(n, normalize(vec3(0.4, 0.4, 0.8))), 0.0, 1.0);
      vec3 moonCol = mix(vec3(0.90, 0.94, 0.98), vec3(0.65, 0.72, 0.85), (1.0 - diff) * 0.5);
      col = mix(col, moonCol, disc * moonVis);
    }
  }
  return col;
}

// ===========================================================================
//  WAVE LAYERS & WATER SPECULAR
// ===========================================================================
float getWaveHeight(float x, float t, float freq1, float freq2, float speed1, float speed2, float amp1, float amp2) {
  return sin(x * freq1 + t * speed1) * amp1 + cos(x * freq2 - t * speed2) * amp2;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uR) / uR.y;
  float halfW = (0.5 * uR.x) / uR.y;

  float s = clamp(uS, 0.0, 1.0);
  float dayNight = s * s * (3.0 - 2.0 * s);

  float drift = sin(uT * 0.03) * 0.015;
  float sunY  = mix( 0.08, -0.60, dayNight);
  float moonY = mix(-0.60,  0.12, dayNight);

  vec2 sunPos  = vec2( 0.15 + drift, sunY);
  vec2 moonPos = vec2(-0.15 + drift, moonY);

  float sunVis  = smoothstep(-0.45, -0.05, sunY);
  float moonVis = smoothstep(-0.45, -0.05, moonY);

  // 1. Sky
  vec3 col = getSkyColor(uv, dayNight);

  // 2. Stars & Meteors
  col = renderStars(uv, col, dayNight);

  // 3. Sun & Moon
  col = renderSun(uv, col, sunPos, sunVis);
  col = renderMoon(uv, col, moonPos, moonVis);

  vec2 activeLightPos = (sunVis > moonVis) ? sunPos : moonPos;
  float activeLightVis = max(sunVis, moonVis);
  vec3 lightColor = mix(vec3(1.00, 0.86, 0.45), vec3(0.75, 0.88, 1.00), dayNight);

  // 4. Fluid Shimmer Waves
  struct WaveLayer {
    float baseY;
    float freq1, freq2;
    float speed1, speed2;
    float amp1, amp2;
    vec3  dayColor, nightColor;
  };

  WaveLayer layers[4];
  layers[0] = WaveLayer(HORIZON + 0.010, 16.0, 32.0, 1.5, 2.2, 0.003, 0.0015, vec3(0.88, 0.55, 0.28), vec3(0.07, 0.10, 0.22));
  layers[1] = WaveLayer(HORIZON - 0.035, 12.0, 24.0, 2.0, 2.8, 0.005, 0.0025, vec3(0.76, 0.45, 0.24), vec3(0.05, 0.08, 0.18));
  layers[2] = WaveLayer(HORIZON - 0.085,  9.0, 18.0, 2.6, 3.5, 0.008, 0.0040, vec3(0.62, 0.36, 0.20), vec3(0.04, 0.06, 0.14));
  layers[3] = WaveLayer(HORIZON - 0.150,  6.0, 12.0, 3.2, 4.4, 0.012, 0.0060, vec3(0.48, 0.26, 0.16), vec3(0.02, 0.04, 0.10));

  for (int i = 0; i < 4; i++) {
    float waveY = layers[i].baseY + getWaveHeight(uv.x, uT, layers[i].freq1, layers[i].freq2, layers[i].speed1, layers[i].speed2, layers[i].amp1, layers[i].amp2);

    if (uv.y < waveY) {
      float depth = clamp((waveY - uv.y) * 8.0, 0.0, 1.0);
      vec3 layerBase = mix(layers[i].dayColor, layers[i].nightColor, dayNight);
      vec3 layerShaded = layerBase * (1.0 - depth * 0.35);

      // Specular glitter reflection
      float lightColDist = abs(uv.x - activeLightPos.x);
      float shimmerWidth = mix(0.18, 0.35, float(i) * 0.25);
      float glitter = exp(-pow(lightColDist / shimmerWidth, 2.0)) * activeLightVis;
      
      float sparkle = 0.5 + 0.5 * sin(uv.x * 55.0 + uT * 5.0 + float(i) * 3.5);
      glitter *= (0.65 + 0.35 * sparkle);
      layerShaded += lightColor * glitter * (0.35 + float(i) * 0.15);

      float edgeAlpha = smoothstep(waveY, waveY - 0.002, uv.y);
      col = mix(col, layerShaded, edgeAlpha);
    }
  }

  // Tone Mapping
  vec3 aColor = col * 0.96;
  vec3 mapped = clamp((aColor * (2.51 * aColor + 0.03)) / (aColor * (2.43 * aColor + 0.59) + 0.14), 0.0, 1.0);
  col = pow(mapped, vec3(0.96));

  float vig = 1.0 - 0.06 * pow(abs(uv.x) / max(halfW, 0.001), 3.0);
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vert = mkShader(gl.VERTEX_SHADER, VS);
    const frag = mkShader(gl.FRAGMENT_SHADER, FS);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRLoc = gl.getUniformLocation(prog, "uR");
    const uTLoc = gl.getUniformLocation(prog, "uT");
    const uSLoc = gl.getUniformLocation(prog, "uS");

    // Immediate theme resolution to prevent any hydration flash
    const isCurrentlyDark = () => {
      if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
        return true;
      }
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("criation_theme_v1");
        if (saved === "dark") return true;
        if (saved === "light") return false;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return true;
        }
      }
      return themeRef.current === "dark";
    };

    let animationFrameId: number;
    const startTime = performance.now();
    let currentS = isCurrentlyDark() ? 1.0 : 0.0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const render = (time: number) => {
      resize();

      const targetS = isCurrentlyDark() ? 1.0 : 0.0;
      currentS += (targetS - currentS) * 0.08;

      const elapsed = (time - startTime) * 0.001;

      gl.useProgram(prog);
      gl.uniform2f(uRLoc, canvas.width, canvas.height);
      gl.uniform1f(uTLoc, elapsed);
      gl.uniform1f(uSLoc, currentS);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ imageRendering: "auto" }}
    />
  );
}
