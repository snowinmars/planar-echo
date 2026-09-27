import { WORLD } from './contract.js';

import type { ClientMount } from '@planar/shared';

const COLORS: Record<number, string> = {
  1: '#4ea3ff',
  2: '#ff6b4a',
};

export const mount: ClientMount = (host) => {
  const canvas = host.canvas;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas2D is unavailable');
  let frame = 0;

  const draw = (): void => {
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#111318';
    context.fillRect(0, 0, width, height);
    const scale = Math.min(width, height) / WORLD;
    for (const dot of host.readTransforms()) {
      context.beginPath();
      context.fillStyle = dot.entityId === host.ownedEntityId
        ? (COLORS[dot.entityId] ?? '#ffffff')
        : '#d8d8d8';
      context.arc(dot.x * scale, dot.y * scale, 8, 0, Math.PI * 2);
      context.fill();
    }
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);

  const onKey = (event: KeyboardEvent): void => {
    const step = (dx: number, dy: number): void => {
      event.preventDefault();
      host.sendMove(dx, dy);
    };
    switch (event.key) {
      case 'ArrowLeft':
        step(-1, 0);
        return;
      case 'ArrowRight':
        step(1, 0);
        return;
      case 'ArrowUp':
        step(0, -1);
        return;
      case 'ArrowDown':
        step(0, 1);
        return;
      default:
        return;
    }
  };
  window.addEventListener('keydown', onKey);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('keydown', onKey);
  };
};
