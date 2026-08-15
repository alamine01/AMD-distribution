"use client";

import styles from './About.module.css';
import { motion } from 'framer-motion';
import { Users, Leaf, Sparkles, Heart } from 'lucide-react';

const values = [
    {
        Icon: Users,
        title: "Engagement Local",
        desc: "Nous collaborons directement avec des \"mamans entrepreneures\" et des coopératives locales au Sénégal.",
        color: "#CD853F"
    },
    {
        Icon: Leaf,
        title: "Éco-responsabilité",
        desc: "Nous privilégions les circuits courts et les matières naturelles pour un impact minimal sur l'environnement.",
        color: "#2E7D32"
    },
    {
        Icon: Sparkles,
        title: "Qualité Supérieure",
        desc: "Chaque pièce est rigoureusement sélectionnée pour sa qualité et son origine certifiée.",
        color: "#DAA520"
    }
];

export default function AboutPage() {
    return (
        <div className={`container ${styles.aboutPage}`}>
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className={styles.title}>Notre Histoire</h1>
                <p className={styles.subtitle}>Faire rayonner les trésors de l'Afrique à Lyon.</p>
            </motion.header>

            <section className={styles.story}>
                <motion.div
                    className={styles.storyContent}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.label}>
                        <Heart size={16} fill="var(--primary-red)" color="var(--primary-red)" /> La fondatrice
                    </div>
                    <h2>Je suis Ndeye, Fondatrice de MAYA-BOUTIQUE</h2>
                    <p>
                        MAYA-BOUTIQUE a pour ambition de promouvoir le savoir-faire africain majoritairement Sénégalais. Il y a quelques années, quand je suis arrivée en France j'avais du mal à trouver des produits de qualités et qui correspondaient à mes besoins.
                    </p>
                    <p>
                        J'ai également constaté qu'il y avait une réelle demande d'approvisionnement de produit qualitatif auprès de la communauté africaine. Et c'est là que l'aventure a débuté !! J'ai commencé à acheter mes propres produits fabriqués par nos "mamans Sénégalaises" et les commercialiser auprès de la diaspora africaine et plus largement aux personnes soucieuses de découvrir les produits du terroir africain.
                    </p>
                </motion.div>
                <motion.div
                    className={styles.storyImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <div className={styles.imagePlaceholder}>
                        <img src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&q=80&w=800" alt="La Fondatrice Ndeye - Maya Boutique" />
                    </div>
                </motion.div>
            </section>

            <section className={styles.values}>
                {values.map((v, i) => (
                    <motion.div
                        key={v.title}
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                    >
                        <div className={styles.iconWrapper} style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                            <v.Icon size={28} />
                        </div>
                        <h3>{v.title}</h3>
                        <p>{v.desc}</p>
                    </motion.div>
                ))}
            </section>

            <motion.section
                className={styles.mission}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <h2>Pourquoi consommer les produits de Maya-boutique ?</h2>
                <p>
                    Développer l'entreprenariat féminin est quelque chose d'essentiel pour nous. La plupart des produits que vous retrouverez dans la boutique proviendront essentiellement de mamans entrepreneures.
                </p>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>
                    Ces dernières sont des femmes étonnantes par leur professionnalisme, leur générosité et surtout leur sens du travail. Nos mamans sont courageuses, mais aussi valeureuses. En choisissant Maya Boutique, vous participez directement au développement de leur pays et au soutien de femmes talentueuses.
                </p>
                <div className={styles.missionDeco}></div>
            </motion.section>
        </div>
    );
}
