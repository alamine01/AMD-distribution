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

export function createWhatsAppOrderLink(cart: CartItem[], totalPrice: number): string {
    const cleanNumber = DEFAULT_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    
    let message = "Bonjour Maya Boutique ! 👋\nJe souhaite passer la commande suivante :\n\n";
    
    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `${index + 1}. *${item.name}*\n   Quantité : ${item.quantity}\n   Prix : ${itemTotal} €\n\n`;
    });
    
    message += `-------------------------\n*Total de la commande : ${totalPrice.toFixed(2)} €*\n-------------------------\n\nMerci de me confirmer la disponibilité et les détails pour le règlement.`;
    
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
