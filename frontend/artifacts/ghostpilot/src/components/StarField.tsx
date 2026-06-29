import { useEffect, useRef } from "react";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1 + 0.5,
      baseOpacity: Math.random() * 0.6 + 0.2,
      period: Math.random() * 5000 + 3000,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint orbit arcs
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(0.1); // slight tilt
      ctx.strokeStyle = "rgba(0, 200, 255, 0.06)";
      ctx.lineWidth = 1;

      const radii = [0.3, 0.45, 0.6];
      radii.forEach((r) => {
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          canvas.width * r,
          (canvas.width * r) * 0.6, // ellipse height ratio
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      });
      ctx.restore();

      // Draw stars
      stars.forEach((star) => {
        const opacity =
          star.baseOpacity +
          Math.sin(time / star.period * Math.PI * 2 + star.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 244, 255, ${Math.max(0.1, opacity)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
