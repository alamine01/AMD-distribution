"use client";

import Hero from "@/components/home/Hero";
import styles from "./page.module.css";
import Link from "next/link";
import { Coffee, ShoppingBasket, Leaf, ArrowRight, Utensils, Heart } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Céréales & Mil",
    Icon: Coffee,
    description: "Araw de mil, préparations pour beignets et farines naturelles sans gluten riches en nutriments.",
    color: "#CD853F"
  },
  {
    id: 2,
    name: "Boissons & Jus",
    Icon: Coffee,
    description: "Bissap, Bouye (Baobab), jus de Gingembre frais et l'authentique Café Touba.",
    color: "#8B0000"
  },
  {
    id: 3,
    name: "Terroir & Épicerie",
    Icon: ShoppingBasket,
    description: "Touffeu, feuilles de Nguer, dattes bio et produits authentiques du terroir sénégalais.",
    color: "#DAA520"
  },
  {
    id: 4,
    name: "Infusions & Bien-être",
    Icon: Utensils,
    description: "Moringa, infusions de gingembre et fleurs d'hibiscus pour votre équilibre au quotidien.",
    color: "#2E7D32"
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />

      <section className={styles.categories}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={styles.sectionTitle}>Nos Univers Gastronomiques</h2>
          </motion.div>

          <div className={styles.grid}>
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/shop?category=${cat.id}`} className={styles.categoryCard}>
                  <div className={styles.iconCircle} style={{ '--icon-color': cat.color } as any}>
                    <cat.Icon size={32} />
                  </div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className={styles.cardCta}>
                    Découvrir <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.engagement}>
        <div className="container">
          <motion.div
            className={styles.engagementContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={styles.engagementText}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className={styles.label}>
                <Heart size={14} fill="currentColor" /> Engagement Social
              </div>
              <h3>Plus qu'une boutique, un pont entre Lyon et le Sénégal</h3>
              <p>
                La majorité de nos produits (Bissap, thés, céréales) sont issus du travail passionné de <strong>mamans entrepreneures</strong> et de coopératives agricoles locales.
              </p>
              <p>
                En choisissant Maya Boutique, vous participez directement au développement d'une économie solidaire et durable, tout en savourant l'excellence du terroir sénégalais.
              </p>
              <Link href="/about" className={styles.readMore}>
                Découvrir notre mission <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div
              className={styles.engagementImage}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800" alt="Terroir Sénégalais" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container">
          <motion.div
            className={styles.bannerContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2>Une question ? Besoin d'un conseil ?</h2>
            <p>Notre équipe à Lyon est là pour vous accompagner dans la découverte de nos trésors exotiques.</p>
            <Link href="/contact" className="btn btn-secondary">
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
