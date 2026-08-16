"use client";

import { useCart } from "@/context/CartContext";
import styles from "./Checkout.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, User } from "lucide-react";
import { createWhatsAppOrderLink, getWhatsAppNumberFormatted } from "@/lib/whatsapp";

export default function CheckoutPage() {
    const { cart = [], totalPrice = 0, totalItems = 0 } = useCart();
    const router = useRouter();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        note: ""
    });

    const safeTotalPrice = totalPrice || 0;
    const safeTotalItems = totalItems || 0;

    const whatsappLink = createWhatsAppOrderLink(cart, safeTotalPrice, customerInfo);
    const formattedPhone = getWhatsAppNumberFormatted();

    if (!cart || cart.length === 0) {
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
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '16px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} /> Vos Coordonnées (Optionnel)
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Nom complet</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Ndeye Diop"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Téléphone</label>
                                <input
                                    type="tel"
                                    placeholder="Ex: 06 12 34 56 78"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Adresse de livraison</label>
                            <input
                                type="text"
                                placeholder="Ex: 7 Rue de Marseille, 69007 Lyon"
                                value={customerInfo.address}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Note / Instruction</label>
                            <input
                                type="text"
                                placeholder="Ex: Livraison l'après-midi"
                                value={customerInfo.note}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Articles commandés ({safeTotalItems})</h2>
                    {cart.map((item) => {
                        const itemPrice = item.price || 0;
                        const itemQuantity = item.quantity || 1;
                        const itemTotal = itemPrice * itemQuantity;

                        return (
                            <div key={item.id} className={styles.item}>
                                {item.image && (
                                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                                )}
                                <div className={styles.itemInfo}>
                                    <h3>{item.name}</h3>
                                    <p>{itemQuantity} x {itemPrice.toFixed(2)} €</p>
                                </div>
                                <p className={styles.itemTotal}>{itemTotal.toFixed(2)} €</p>
                            </div>
                        );
                    })}
                </div>

                <motion.aside
                    className={styles.summary}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h2>Résumé</h2>
                    <div className={styles.summaryRow}>
                        <span>Produits ({safeTotalItems})</span>
                        <span>{safeTotalPrice.toFixed(2)} €</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Livraison</span>
                        <span className={styles.free}>Gratuit</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                        <span>Total à payer</span>
                        <span>{safeTotalPrice.toFixed(2)} €</span>
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
