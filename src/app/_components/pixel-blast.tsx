"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";

// Adapted from React Bits Pixel Blast: https://reactbits.dev/backgrounds/pixel-blast
type PixelBlastVariant = "square" | "circle" | "triangle" | "diamond";

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensity?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  className?: string;
  style?: CSSProperties;
};

const shapeMap: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int uShapeType;

const int MAX_CLICKS = 10;
uniform vec2 uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

#define BAYER4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
#define BAYER8(a) (BAYER4(0.5 * (a)) * 0.25 + bayer2(a))

float hash11(float n) {
  return fract(sin(n) * 43758.5453);
}

float valueNoise(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  return mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z) * 2.0 - 1.0;
}

float fbm(vec2 uv, float time) {
  vec3 point = vec3(uv * uScale, time);
  float amplitude = 1.0;
  float frequency = 1.0;
  float sum = 1.0;

  for (int i = 0; i < 5; ++i) {
    sum += amplitude * valueNoise(point * frequency);
    frequency *= 1.25;
  }

  return sum * 0.5 + 0.5;
}

float circleMask(vec2 point, float coverage) {
  float radius = sqrt(coverage) * 0.25;
  float distanceFromEdge = length(point - 0.5) - radius;
  float antialias = 0.5 * fwidth(distanceFromEdge);
  return coverage * (1.0 - smoothstep(-antialias, antialias, distanceFromEdge * 2.0));
}

float triangleMask(vec2 point, vec2 id, float coverage) {
  if (mod(id.x + id.y, 2.0) > 0.5) point.x = 1.0 - point.x;
  float distanceFromEdge = point.y - sqrt(coverage) * (1.0 - point.x);
  return coverage * clamp(0.5 - distanceFromEdge / fwidth(distanceFromEdge), 0.0, 1.0);
}

float diamondMask(vec2 point, float coverage) {
  float radius = sqrt(coverage) * 0.564;
  return step(abs(point.x - 0.49) + abs(point.y - 0.49), radius);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 pixelId = floor(fragCoord / uPixelSize);
  vec2 pixelUv = fract(fragCoord / uPixelSize);
  float cellSize = 8.0 * uPixelSize;
  vec2 cellCoord = floor(fragCoord / cellSize) * cellSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm(uv, uTime * 0.05) * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i) {
      vec2 position = uClickPos[i];
      if (position.x < 0.0) continue;
      vec2 clickUv = ((position - uResolution * 0.5 - cellSize * 0.5) / uResolution) * vec2(aspectRatio, 1.0);
      float elapsed = max(uTime - uClickTimes[i], 0.0);
      float radius = distance(uv, clickUv);
      float ring = exp(-pow((radius - uRippleSpeed * elapsed) / uRippleThickness, 2.0));
      float attenuation = exp(-elapsed) * exp(-10.0 * radius);
      feed = max(feed, ring * attenuation * uRippleIntensity);
    }
  }

  float threshold = BAYER8(fragCoord / uPixelSize) - 0.5;
  float visible = step(0.5, feed + threshold);
  float random = fract(sin(dot(pixelId, vec2(127.1, 311.7))) * 43758.5453);
  float coverage = visible * (1.0 + (random - 0.5) * uPixelJitter);
  float mask;

  if (uShapeType == 1) mask = circleMask(pixelUv, coverage);
  else if (uShapeType == 2) mask = triangleMask(pixelUv, pixelId, coverage);
  else if (uShapeType == 3) mask = diamondMask(pixelUv, coverage);
  else mask = coverage;

  if (uEdgeFade > 0.0) {
    vec2 normalized = gl_FragCoord.xy / uResolution;
    float edge = min(min(normalized.x, normalized.y), min(1.0 - normalized.x, 1.0 - normalized.y));
    mask *= smoothstep(0.0, uEdgeFade, edge);
  }

  vec3 srgbColor = mix(
    uColor * 12.92,
    1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, uColor)
  );
  fragColor = vec4(srgbColor, mask);
}
`;

const maxClicks = 10;

type PerformanceNavigator = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

function supportsPixelBlast() {
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

export function PixelBlast({
  variant = "square",
  pixelSize = 4,
  color = "#d8dcff",
  patternScale = 2,
  patternDensity = 0.8,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensity = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  speed = 0.5,
  edgeFade = 0.35,
  className,
  style,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(supportsPixelBlast());
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    container.appendChild(renderer.domElement);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: Math.random() * 1000 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: {
        value: Array.from(
          { length: maxClicks },
          () => new THREE.Vector2(-1, -1),
        ),
      },
      uClickTimes: { value: new Float32Array(maxClicks) },
      uShapeType: { value: shapeMap[variant] },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale },
      uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter },
      uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed },
      uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensity },
      uEdgeFade: { value: edgeFade },
    };
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

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
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let clickIndex = 0;
    const registerRipple = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      const scaleX = renderer.domElement.width / bounds.width;
      const scaleY = renderer.domElement.height / bounds.height;
      const clickPosition = uniforms.uClickPos.value[clickIndex];
      if (!clickPosition) return;

      clickPosition.set(
        (event.clientX - bounds.left) * scaleX,
        (bounds.height - (event.clientY - bounds.top)) * scaleY,
      );
      uniforms.uClickTimes.value[clickIndex] = uniforms.uTime.value;
      clickIndex = (clickIndex + 1) % maxClicks;
    };

    if (enableRipples) {
      renderer.domElement.addEventListener("pointerdown", registerRipple, {
        passive: true,
      });
    }

    const clock = new THREE.Clock();
    const timeOffset = uniforms.uTime.value;
    let frame = 0;
    let visible = true;

    const render = () => {
      if (!visible) {
        frame = 0;
        return;
      }
      uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speed;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && frame === 0) {
        frame = requestAnimationFrame(render);
      }
    });
    intersectionObserver.observe(container);

    frame = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener("pointerdown", registerRipple);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [
    color,
    edgeFade,
    enableRipples,
    isSupported,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensity,
    rippleSpeed,
    rippleThickness,
    speed,
    variant,
  ]);

  if (!isSupported) return null;

  return (
    <div
      aria-hidden="true"
      className={className}
      ref={containerRef}
      style={style}
    />
  );
}
