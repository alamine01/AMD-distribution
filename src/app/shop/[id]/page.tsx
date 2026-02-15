import { Product } from '@/types';
import styles from './ProductDetail.module.css';
import Link from 'next/link';
import { Truck, ShieldCheck } from 'lucide-react';

// Mock Data (Reusing for now)
const products: Product[] = [
    { id: '1', name: 'Curcuma Bio du Sénégal', price: 8.50, category: 'Épicerie Fine', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=800', description: 'Curcuma pur récolté traditionnellement dans la région de Casamance. Connu pour ses propriétés anti-inflammatoires et son goût intense.' },
    { id: '2', name: 'Boucles d\'oreilles Peulh Or', price: 45.00, category: 'Bijoux', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', description: 'Magnifiques boucles d\'oreilles traditionnelles portées par les femmes Peulh. Fabriquées à la main avec du bronze plaqué or.', featured: true },
    { id: '3', name: 'Beurre de Karité Brut', price: 12.00, category: 'Bien-être', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800', description: 'Beurre de karité 100% pur et naturel, sans additifs. Idéal pour nourrir la peau et les cheveux.' },
];

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id) || products[0];

    return (
        <div className={`container ${styles.productPage}`}>
            <nav className={styles.breadcrumb}>
                <Link href="/shop">Boutique</Link> / <span>{product.name}</span>
            </nav>

            <div className={styles.layout}>
                <div className={styles.imageSection}>
                    <img src={product.image} alt={product.name} className={styles.mainImage} />
                </div>

                <div className={styles.infoSection}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.name}>{product.name}</h1>
                    <p className={styles.price}>{product.price.toFixed(2)} €</p>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <Truck size={24} />
                            </div>
                            <div>
                                <strong>Livraison Locale</strong>
                                <p>Remise en main propre à Lyon</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <strong>Artisanat Authentique</strong>
                                <p>Produits sourcés directement</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                        </div>
                        <button className="btn btn-primary">Ajouter au panier</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
