'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed-top"
            style={{
                scaleX,
                height: '4px',
                background: 'linear-gradient(90deg, #007bff, #00d2ff)',
                transformOrigin: '0%',
                zIndex: 2000
            }}
        />
    );
}
