"use client";

import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.decorativeBg}></div>
            <div className={`container ${styles.heroContainer}`}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        L'Épicerie Fine <br />
                        <span className={styles.highlight}>Sénégalaise à Lyon</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        De la Vallée du Fleuve Sénégal jusqu'à la Rue de Marseille.
                        Céréales naturelles (Mil, Fonios), jus authentiques (Bissap, Bouye)
                        et thés précieux sélectionnés avec amour auprès de nos coopératives.
                    </motion.p>
                    <motion.div
                        className={styles.cta}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    >
                        <Link href="/shop" className="btn btn-primary">
                            Voir le catalogue <ArrowRight size={18} />
                        </Link>
                        <Link href="/about" className="btn btn-secondary">
                            Notre histoire <Info size={18} />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.imageContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className={styles.mainImageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
                            alt="Boutique Maya"
                            className={styles.actualImage}
                        />
                        <div className={styles.imageOverlay}></div>
                        <div className={styles.imageBadge}>
                            <span>Authenticité & Tradition</span>
                        </div>
                    </div>
                    <div className={styles.secondaryImageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500"
                            alt="Produits Terroir"
                            className={styles.actualImage}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
