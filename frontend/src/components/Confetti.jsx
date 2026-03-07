import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Confetti = ({ isActive, colors = ['#C0392B', '#000000', '#FFD700'] }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Percentage position
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8
      }));
      setParticles(newParticles);

      // Clear after animation
      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive, colors]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: particle.id % 3 === 0 ? '50%' : '2px'
          }}
          initial={{
            y: -20,
            opacity: 1,
            rotate: 0
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: particle.rotation * 3,
            x: [0, (Math.random() - 0.5) * 200]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
