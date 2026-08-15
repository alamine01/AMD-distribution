"use client";

import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/actions/checkout";
import styles from "./Checkout.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
           await createCheckoutSession(cart);
        } catch (error) {
            alert("Une erreur est survenue lors de l'initialisation du paiement.");
        } finally {
            setLoading(false);
        }
    };

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

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2rem' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? "Chargement..." : "Procéder au paiement sécurisé"}
                    </button>

                    <p className={styles.secureInfo}>
                        🔒 Paiement sécurisé
                    </p>
                </motion.aside>
            </div>
        </motion.div>
    );
}
