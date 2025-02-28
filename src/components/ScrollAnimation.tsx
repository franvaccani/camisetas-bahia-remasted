import React, { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  animation: 'fade-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'zoom-in';
  delay?: number;
  threshold?: number;
  className?: string;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation,
  delay = 0,
  threshold = 0.1,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'scroll-animation-fade-up';
      case 'fade-in':
        return 'scroll-animation-fade-in';
      case 'slide-in-left':
        return 'scroll-animation-slide-in-left';
      case 'slide-in-right':
        return 'scroll-animation-slide-in-right';
      case 'zoom-in':
        return 'scroll-animation-zoom-in';
      default:
        return 'scroll-animation-fade-in';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`scroll-animation ${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;