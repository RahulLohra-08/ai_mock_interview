'use client'
import React, { useEffect, useRef } from 'react'
import styles from './ParallaXNews.module.scss'
import Image from 'next/image';
import { useTransform, useScroll, motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import useDimension from '@/utils/Hooks/useDimension';


const ParallaXNews = () => {

    const container = useRef(null);
    const {height} = useDimension();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'end start'] // top of the container to the bottom of the viewport/window AND End of the container to the top of the viewport/window
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, height * 0.2]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, height * -0.2]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 0.4]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, height * -0.4]);

    useEffect(() => {
      const lenis = new Lenis({smooth: true,
      smoothTouch: true, 
    });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }, [])
    
    
    const images = [
        '1.png',
        '2.png',
        '3.png',
        '11.png',
        '5.png',
        '6.png',
        '7.png',
        '8.png',
        '9.png',
        '10.png',
        '12.png',
        '4.png',
    ];

  return (
    <main className={styles.main}>
        <div className={styles.spacer}></div>
        <div ref={container} className={styles.gallery}>
            <Column images={[images[0], images[1], images[2]]} y={y} />
            <Column images={[images[3], images[4], images[5]]} y={y2} />
            <Column images={[images[6], images[7], images[8]]} y={y3}/>
            <Column images={[images[9], images[10], images[11]]} y={y4}/>
        </div>
        <div className={styles.spacer}></div>
    </main>
  )
}

export default ParallaXNews



const Column = ({ images, y }) => {
  return (
    <div className={styles.column}>
      {images.map((image, index) => {
        return (
            <motion.div className={styles.imageContainer} key={index}
                style={{y}}
            >
                <Image 
                    key={index}
                    src={`/images/${image}`} // Adjust the path as necessary
                    alt={`Image ${index + 1}`}
                    width={300} // Set appropriate width
                    height={200} // Set appropriate height
                />
            </motion.div>
        )
    })}
    </div>
  )
}