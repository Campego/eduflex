"use client";

import { useState } from "react";
import { ShopItem } from "./ShopItem";

interface ShopItemsListProps {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
}

export function ShopItemsList({ hearts, points, hasActiveSubscription }: ShopItemsListProps) {

  const [isSubscribed, setIsSubscribed] = useState(hasActiveSubscription);

  const handleSubscribe = () => {

    alert("Suscripción premium activada!");
    setIsSubscribed(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <ShopItem
        title="Suscripción Premium"
        description="Desbloquea todos los cursos y contenidos exclusivos."
        price="S/10 / mes"
        disabled={isSubscribed}
        onClick={handleSubscribe}
      />
      {}
    </div>
  );
}