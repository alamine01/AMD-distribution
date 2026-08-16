import { Product } from "@/types";

interface CartItem extends Product {
    quantity: number;
}

export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "221763033251";

export function getWhatsAppNumberFormatted(): string {
    const raw = DEFAULT_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    if (raw.startsWith("221")) {
        return `+221 ${raw.slice(3, 5)} ${raw.slice(5, 8)} ${raw.slice(8, 10)} ${raw.slice(10, 12)}`;
    }
    if (raw.startsWith("33")) {
        return `+33 ${raw.slice(2, 3)} ${raw.slice(3, 5)} ${raw.slice(5, 7)} ${raw.slice(7, 9)} ${raw.slice(9, 11)}`;
    }
    return `+${raw}`;
}

export function createWhatsAppOrderLink(cart: CartItem[] = [], totalPrice: number = 0): string {
    const cleanNumber = DEFAULT_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    
    let message = "Bonjour Maya Boutique ! 👋\nJe souhaite passer la commande suivante :\n\n";
    
    (cart || []).forEach((item, index) => {
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const itemTotal = (price * qty).toFixed(2);
        message += `${index + 1}. *${item.name || "Produit"}*\n   Quantité : ${qty}\n   Prix : ${itemTotal} €\n\n`;
    });
    
    const safeTotal = (totalPrice || 0).toFixed(2);
    message += `-------------------------\n*Total de la commande : ${safeTotal} €*\n-------------------------\n\nMerci de me confirmer la disponibilité et les détails pour le règlement.`;
    
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
