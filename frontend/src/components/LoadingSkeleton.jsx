import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const shimmer = {
    initial: { backgroundPosition: '-200% 0' },
    animate: { backgroundPosition: '200% 0' },
  };

  const SkeletonCard = () => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-4">
        {/* Title skeleton */}
        <motion.div
          className="h-6 rounded"
          style={{
            background: 'linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%)',
            backgroundSize: '200% 100%',
            width: '60%'
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Content lines */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-4 rounded"
              style={{
                background: 'linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%)',
                backgroundSize: '200% 100%',
                width: i === 3 ? '40%' : '100%'
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const SkeletonText = () => (
    <motion.div
      className="h-4 rounded mb-2"
      style={{
        background: 'linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%)',
        backgroundSize: '200% 100%',
        width: '100%'
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  if (type === 'card') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <SkeletonText key={i} />
        ))}
      </>
    );
  }

  return null;
};

export default LoadingSkeleton;
