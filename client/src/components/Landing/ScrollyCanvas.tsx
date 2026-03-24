import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Overlay } from './Overlay';

export const ScrollyCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameCount = 120; // frame_000 to frame_119

  // Calculate image paths
  const framePaths = useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => {
      const index = i.toString().padStart(3, '0');
      return `/sequence/frame_${index}_delay-0.066s.webp`;
    });
  }, [frameCount]);

  // Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const checkComplete = () => {
      loadedCount++;
      // Unblock and update visually once we have a chunk of images
      if (loadedCount === frameCount || loadedCount === parseInt((frameCount / 2).toString())) {
        setImages([...loadedImages]);
      }
    };

    framePaths.forEach((path, i) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedImages[i] = img;
        checkComplete();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${path}`);
        checkComplete(); // don't block
      };
    });
  }, [framePaths, frameCount]);

  // Framer Motion hooks for scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress to a frame index (0 to 119)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // Request Animation Frame loop linked to scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length > 0 && imgRef.current) {
      const index = Math.round(latest);
      const targetImage = images[index];
      if (targetImage) {
        // Direct DOM manipulation guarantees perfect 60fps without React re-rendering
        // Rendering via native <img> bypasses all Canvas artifacting and color-profile issues
        imgRef.current.src = targetImage.src;
      }
    }
  });

  // Initially render the first frame
  useEffect(() => {
    if (images.length > 0 && imgRef.current && !imgRef.current.src.includes('frame_000')) {
      const firstImage = images.find(img => img !== undefined);
      if (firstImage) {
        imgRef.current.src = firstImage.src;
      }
    }
  }, [images]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0B0F1A]">
        {/* Native image element provides absolute best color profiling and hardware upscaling */}
        <img
          ref={imgRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          alt="Scrollytelling background"
          style={{ willChange: 'contents' }}
        />
        {/* A subtle radial gradient overlay to enhance the premium feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F1A_100%)] opacity-80 pointer-events-none" />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
};
