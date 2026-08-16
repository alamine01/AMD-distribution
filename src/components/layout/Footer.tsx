"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <span className={styles.maya}>Maya</span>
                            <span className={styles.boutique}>Boutique</span>
                        </Link>
                    </div>
                    <p className={styles.description}>
                        L'art de vivre africain à Lyon.
                        Une sélection authentique pour sublimer votre quotidien.
                    </p>
                    <div className={styles.social}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>

                <div className={styles.linksGroup}>
                    <div className={styles.links}>
                        <h3>Explorer</h3>
                        <Link href="/shop" className={styles.link}>Boutique</Link>
                        <Link href="/about" className={styles.link}>À propos</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                    </div>

                    <div className={styles.links}>
                        <h3>Aide</h3>
                        <Link href="/cgv" className={styles.link}>Livraison & Retours</Link>
                        <Link href="/legal" className={styles.link}>Mentions Légales</Link>
                        <Link href="/contact" className={styles.link}>FAQ</Link>
                    </div>
                </div>

                <div className={styles.contact}>
                    <h3>Nous trouver</h3>
                    <div className={styles.contactItem}>
                        <MapPin size={16} />
                        <span>7 Rue de Marseille, 69007 Lyon</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Phone size={16} />
                        <span>+33 7 53 13 65 28</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Mail size={16} />
                        <span>contact@maya-boutique.fr</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Clock size={16} />
                        <div>
                            <p>Lun - Sam : 10h - 20h</p>
                            <p>Dimanche : 11h - 19h</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={`container ${styles.bottomContainer}`}>
                    <p>&copy; {currentYear} Maya Boutique. Conçu avec passion à Lyon.</p>
                    <div className={styles.bottomLegal}>
                        <Link href="/legal">Vie privée</Link>
                        <span className={styles.divider}>•</span>
                        <Link href="/cgv">Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
