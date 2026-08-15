import Link from "next/link";
import styles from "../Checkout.module.css";

export default function CancelPage() {
    return (
        <div className={`container ${styles.empty}`}>
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h1>Commande annulée</h1>
            <p>Votre paiement n'a pas été finalisé. Vos articles sont toujours dans votre panier.</p>
            <div className={styles.actionButtons}>
                <Link href="/checkout" className="btn btn-primary">
                    Retour au paiement
                </Link>
                <Link href="/shop" className="btn btn-secondary">
                    Continuer mes achats
                </Link>
            </div>
        </div>
    );
}
