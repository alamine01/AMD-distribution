"use client";

import { useCart } from "@/context/CartContext";
import styles from "./Checkout.module.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { createWhatsAppOrderLink, getWhatsAppNumberFormatted } from "@/lib/whatsapp";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems } = useCart();
    const router = useRouter();

    const whatsappLink = createWhatsAppOrderLink(cart, totalPrice);
    const formattedPhone = getWhatsAppNumberFormatted();

    if (cart.length === 0) {
        return (
            <motion.div
                className={`container ${styles.empty}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>Votre panier est vide</h1>
                <p>Veuillez ajouter des produits avant de passer commande.</p>
                <button className="btn btn-primary" onClick={() => router.push("/shop")}>
                    Retour à la boutique
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`container ${styles.checkoutPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className={styles.title}>Récapitulatif de la commande</h1>

            <div className={styles.layout}>
                <div className={styles.itemsSection}>
                    {cart.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <img src={item.image} alt={item.name} className={styles.itemImage} />
                            <div className={styles.itemInfo}>
                                <h3>{item.name}</h3>
                                <p>{item.quantity} x {item.price.toFixed(2)} €</p>
                            </div>
                            <p className={styles.itemTotal}>{(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                    ))}
                </div>

                <motion.aside
                    className={styles.summary}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h2>Résumé</h2>
                    <div className={styles.summaryRow}>
                        <span>Produits ({totalItems})</span>
                        <span>{totalPrice.toFixed(2)} €</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Livraison</span>
                        <span className={styles.free}>Gratuit</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                        <span>Total à payer</span>
                        <span>{totalPrice.toFixed(2)} €</span>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            backgroundColor: '#25D366',
                            borderColor: '#25D366',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            padding: '0.9rem',
                            textDecoration: 'none'
                        }}
                    >
                        <MessageCircle size={20} /> Commander via WhatsApp
                    </a>

                    <p className={styles.secureInfo} style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                        📲 Numéro WhatsApp : <strong>{formattedPhone}</strong>
                    </p>
                </motion.aside>
            </div>
        </motion.div>
    );
}
