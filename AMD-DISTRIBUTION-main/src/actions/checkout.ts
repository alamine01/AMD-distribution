"use server";

import { headers } from "next/headers";

// Payment integration removed. Keep a stubbed action to surface a clear error when checkout is attempted.
export async function createCheckoutSession(_items: any[]) {
    const headersList = await headers();
    const origin = headersList.get("origin");

    throw new Error(
        `Paiement désactivé: l'intégration de paiement a été retirée. Aucune session n'est disponible (origin=${origin}).`
    );
}
