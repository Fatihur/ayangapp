import React from 'react';

const AnimatedBackground = () => {
  // Generate an array of 20 hearts with random positions and animations
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    scale: 0.5 + Math.random() * 1.5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float opacity-10"
          style={{
            left: heart.left,
            top: '-10%',
            animationDelay: heart.animationDelay,
            transform: `scale(${heart.scale})`,
          }}
        >
          <span className="text-4xl">❤️</span>
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
