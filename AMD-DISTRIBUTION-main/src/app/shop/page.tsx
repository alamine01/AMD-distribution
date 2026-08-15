"use client";

import { useState } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';
import { Filter, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Données réelles extraites des captures d'écran - URLs d'images vérifiées (Nourriture uniquement)
const products: Product[] = [
    { id: '1', name: 'Arraw de mangue et mil', price: 2.80, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600', description: 'Mélange traditionnel de mangue séchée et de mil.' },
    { id: '2', name: 'Arraw de manioc', price: 2.80, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1536304921969-fb757989938b?auto=format&fit=crop&q=80&w=600', description: 'Céréales de manioc naturelles.' },
    { id: '3', name: 'Arraw marque Fatou', price: 3.00, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600', description: 'Arraw de qualité supérieure, marque Fatou.' },
    { id: '4', name: 'Arraw Thieb Riz', price: 6.00, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1516746878348-ff3f233f2e05?auto=format&fit=crop&q=80&w=600', description: 'Arraw spécial pour la préparation du Thieb.' },
    { id: '5', name: 'Madd Zena Nature', price: 7.00, category: 'Sucrés & Salés', image: 'https://images.unsplash.com/photo-1615485577144-d0ec3d5ac334?auto=format&fit=crop&q=80&w=600', description: 'Fruit du Saba senegalensis, goût authentique.' },
    { id: '6', name: 'Pack Ramadan Boisson', price: 55.00, category: 'Packs Ramadan', image: 'https://images.unsplash.com/photo-1544787210-2211d7c9282b?auto=format&fit=crop&q=80&w=600', description: 'Sélection complète de boissons pour le mois de Ramadan.' },
    { id: '7', name: 'Pack Ramadan Prêt À L\'emploi', price: 80.00, category: 'Packs Ramadan', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600', description: 'Kit complet de repas prêts pour la rupture du jeûne.' },
    { id: '8', name: 'Café Touba Jamm Ak Xeewal', price: 13.00, category: 'Boissons & Jus', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600', description: 'L\'authentique café Touba aromatisé.' },
    { id: '9', name: '4 cotés', price: 4.00, category: 'Terroir & Épicerie', image: 'https://images.unsplash.com/photo-1544333323-5374c20f135b?auto=format&fit=crop&q=80&w=600', description: 'Fruit du Tetrapleura tetraptera pour vos infusions.' },
    { id: '10', name: 'Accra prêt à l\'emploi', price: 10.00, category: 'Sucrés & Salés', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600', description: 'Préparation pour Accras de qualité artisanale.' },
    { id: '11', name: 'AL DANKE', price: 3.00, category: 'Terroir & Épicerie', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600', description: 'Plante traditionnelle aux vertus uniques.' },
    { id: '12', name: 'Ananas séché biologique', price: 4.99, category: 'Sucrés & Salés', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=600', description: 'Tranches d\'ananas bio séchées au soleil.' },
    { id: '13', name: 'Arachide grillées', price: 5.00, category: 'Sucrés & Salés', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&q=80&w=600', description: 'Arachides grillées croquantes et savoureuses.' },
    { id: '14', name: 'Araw de riz', price: 6.00, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', description: 'Araw à base de riz sélectionné.' },
    { id: '15', name: 'Arraw', price: 6.00, category: 'Arraw & Céréales', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600', description: 'Arraw traditionnel pur.' },
];

const categories = ['Tous', 'Arraw & Céréales', 'Boissons & Jus', 'Sucrés & Salés', 'Terroir & Épicerie', 'Packs Ramadan'];

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState(100);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    const SidebarContent = () => (
        <>
            <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>
                    <Filter size={18} /> Catégories
                </h3>
                <ul className={styles.filterList}>
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                className={activeCategory === cat ? styles.activeFilter : ''}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    if (window.innerWidth <= 768) setIsFilterOpen(false);
                                }}
                            >
                                {cat}
                                {activeCategory === cat && <ChevronRight size={14} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>
                    <SlidersHorizontal size={18} /> Prix maximum : {maxPrice} €
                </h3>
                <div className={styles.priceRange}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className={styles.priceLabels}>
                        <span>0 €</span>
                        <span>100 €</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className={`container ${styles.shopPage}`}>
            <motion.header
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.title}>Notre Catalogue</h1>
                <p className={styles.subtitle}>Découvrez les trésors de l'Afrique et du Sénégal sélectionnés avec soin.</p>
            </motion.header>

            <div className={styles.layout}>
                <motion.aside
                    className={styles.sidebar}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <SidebarContent />
                </motion.aside>

                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <motion.div
                                className={styles.mobileOverlay}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                            />
                            <motion.aside
                                className={styles.mobileSidebar}
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                <div className={styles.mobileSidebarHeader}>
                                    <h3>Filtres</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className={styles.closeBtn}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className={styles.mobileSidebarContent}>
                                    <SidebarContent />
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <main className={styles.main}>
                    <div className={styles.resultsBar}>
                        <div className={styles.mobileFilterToggle}>
                            <button
                                className={styles.filterBtn}
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <Filter size={18} /> Filtrer
                            </button>
                        </div>
                        <span className={styles.resultsCount}>{filteredProducts.length} produits trouvés</span>
                        <div className={styles.controls}>
                            <select className={styles.sort}>
                                <option>Trier par : Nouveautés</option>
                                <option>Prix : Croissant</option>
                                <option>Prix : Décroissant</option>
                            </select>
                        </div>
                    </div>

                    <motion.div
                        className={styles.productGrid}
                        layout
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
