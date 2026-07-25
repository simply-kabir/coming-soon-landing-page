"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient starfield background.
 *
 * Tuning notes (per creative direction — restraint over density):
 * - Star count is deliberately low (~1 star per 9,000px^2) — roughly half
 *   the density of a typical "particle library" starfield.
 * - Radius and max opacity are both kept small so stars read as a quiet
 *   texture rather than a foreground element.
 * - Twinkle cycles are slow (12-26s per star) so the motion is felt more
 *   than seen.
 * - Occasional shooting stars cross the field as a rare accent, not a loop.
 */

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let rafId: number;
    let lastShootingStarSpawn = 0;

    const STAR_DENSITY = 1 / 9000; // ~half of a typical dense starfield
    const MIN_RADIUS = 0.4;
    const MAX_RADIUS = 1.1;
    const MIN_OPACITY = 0.15;
    const MAX_OPACITY = 0.45;
    const MIN_TWINKLE_SECONDS = 12;
    const MAX_TWINKLE_SECONDS = 26;

    function buildStars() {
      const count = Math.round(width * height * STAR_DENSITY);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
        baseOpacity:
          MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY),
        twinkleSpeed:
          1 /
          (MIN_TWINKLE_SECONDS +
            Math.random() * (MAX_TWINKLE_SECONDS - MIN_TWINKLE_SECONDS)),
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function spawnShootingStar() {
      const startX = Math.random() * width * 0.7 + width * 0.15;
      const startY = Math.random() * height * 0.35;
      shootingStars.push({
        x: startX,
        y: startY,
        length: 70 + Math.random() * 90,
        angle: (Math.PI / 180) * (35 + Math.random() * 20),
        speed: 260 + Math.random() * 160,
        opacity: 0,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.6,
      });
    }

    let lastTime = performance.now();

    function draw(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      // Stars — slow, subtle twinkle
      for (const s of stars) {
        const twinkle =
          0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * Math.PI * 2 + s.twinklePhase);
        const opacity = s.baseOpacity * (0.55 + twinkle * 0.45);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 219, 205, ${opacity.toFixed(3)})`;
        ctx.fill();
      }

      // Shooting stars — rare, faint gold streaks
      if (now - lastShootingStarSpawn > 4500 + Math.random() * 5000) {
        lastShootingStarSpawn = now;
        if (Math.random() < 0.85) spawnShootingStar();
      }

      shootingStars = shootingStars.filter((star) => {
        star.life += dt;
        const progress = star.life / star.maxLife;
        if (progress >= 1) return false;

        star.x += Math.cos(star.angle) * star.speed * dt;
        star.y += Math.sin(star.angle) * star.speed * dt;

        const fade =
          progress < 0.2
            ? progress / 0.2
            : progress > 0.7
              ? 1 - (progress - 0.7) / 0.3
              : 1;

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, "rgba(201, 169, 110, 0)");
        gradient.addColorStop(1, `rgba(201, 169, 110, ${(0.55 * fade).toFixed(3)})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        return true;
      });

      rafId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
