"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";

// Adapted from React Bits Magic Rings: https://reactbits.dev/animations/magic-rings
type MagicRingsProps = {
  color?: string;
  colorTwo?: string;
  speed?: number;
  ringCount?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  anchorId?: string;
  className?: string;
  style?: CSSProperties;
};

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform vec2 uResolution, uOrigin;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn
    ? smoothstep(0.0, uFadeIn, t)
    : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = 0.62 + (1.0 - smoothstep(th, th * 1.5, d)) * 0.82;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - uOrigin) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);

  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(
      c,
      rc,
      vec3(ring(
        p,
        uBaseRadius + fi * uRadiusStep,
        pow(uRingGap, fi),
        i == 0 ? 0.0 : 2.95 * fi,
        px
      ))
    );
  }

  float n = fract(
    sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) *
    43758.5453
  );
  float ringStrength = max(c.r, max(c.g, c.b));
  c += (n - 0.5) * uNoiseAmount * ringStrength;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}
`;

type PerformanceNavigator = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function supportsMagicRings() {
  const performanceNavigator = navigator as PerformanceNavigator;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const hasLimitedMemory =
    typeof performanceNavigator.deviceMemory === "number" &&
    performanceNavigator.deviceMemory <= 2;
  const hasLimitedCpu =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 2;

  if (
    prefersReducedMotion ||
    performanceNavigator.connection?.saveData ||
    hasLimitedMemory ||
    hasLimitedCpu
  ) {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

export function MagicRings({
  color = "#c4c9ff",
  colorTwo = "#6873ff",
  speed = 0.9,
  ringCount = 7,
  attenuation = 10.8,
  lineThickness = 1.45,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 0.37,
  blur = 0,
  noiseAmount = 0.008,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  anchorId,
  className,
  style,
}: MagicRingsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 768px)");
    const updateSupport = () => {
      setIsSupported(desktopMedia.matches && supportsMagicRings());
    };

    updateSupport();
    desktopMedia.addEventListener("change", updateSupport);

    return () => desktopMedia.removeEventListener("change", updateSupport);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      uTime: { value: 0 },
      uAttenuation: { value: attenuation },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(color) },
      uColorTwo: { value: new THREE.Color(colorTwo) },
      uLineThickness: { value: lineThickness },
      uBaseRadius: { value: baseRadius },
      uRadiusStep: { value: radiusStep },
      uScaleRate: { value: scaleRate },
      uRingCount: { value: Math.min(Math.max(ringCount, 1), 10) },
      uOpacity: { value: opacity },
      uNoiseAmount: { value: noiseAmount },
      uRotation: { value: (rotation * Math.PI) / 180 },
      uRingGap: { value: ringGap },
      uFadeIn: { value: fadeIn },
      uFadeOut: { value: fadeOut },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(1, 1);
    scene.add(new THREE.Mesh(geometry, material));

    const anchor = anchorId ? document.getElementById(anchorId) : null;
    const resize = () => {
      renderer.setSize(
        Math.max(container.clientWidth, 1),
        Math.max(container.clientHeight, 1),
        false,
      );
      uniforms.uResolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      );
      const containerBounds = container.getBoundingClientRect();
      const anchorBounds = anchor?.getBoundingClientRect();
      const pixelRatio = renderer.getPixelRatio();
      uniforms.uOrigin.value.set(
        anchorBounds
          ? (anchorBounds.left +
              anchorBounds.width / 2 -
              containerBounds.left) *
              pixelRatio
          : renderer.domElement.width / 2,
        anchorBounds
          ? (containerBounds.bottom -
              anchorBounds.top -
              anchorBounds.height / 2) *
              pixelRatio
          : renderer.domElement.height / 2,
      );
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    if (anchor) resizeObserver.observe(anchor);
    resize();

    let frame = 0;
    let isVisible = true;

    const render = (time: number) => {
      uniforms.uTime.value = time * 0.001 * speed;
      renderer.render(scene, camera);
      frame = isVisible ? requestAnimationFrame(render) : 0;
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      if (isVisible && frame === 0) frame = requestAnimationFrame(render);
    });
    intersectionObserver.observe(container);
    frame = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      cancelAnimationFrame(frame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [
    attenuation,
    anchorId,
    baseRadius,
    color,
    colorTwo,
    fadeIn,
    fadeOut,
    isSupported,
    lineThickness,
    noiseAmount,
    opacity,
    radiusStep,
    ringCount,
    ringGap,
    rotation,
    scaleRate,
    speed,
  ]);

  if (!isSupported) return null;

  return (
    <div
      aria-hidden="true"
      className={className}
      ref={containerRef}
      style={{
        ...style,
        ...(blur > 0 ? { filter: `blur(${blur}px)` } : {}),
      }}
    />
  );
}
