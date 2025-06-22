"use client";

import { useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";


import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hasActiveSubscription,
}: ItemsProps) => {
  const [pending, startTransition] = useTransition();

  /* const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts().catch(() => toast.error("Algo salio mal."));
    });
  }; */

  const onUpgrade = () => {
    toast.loading("Redirigiendo para checkout...");
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) window.location.href = response.data;
        })
        .catch(() => toast.error("oops."));
    });
  };

  return (
    <ul className="w-full">

      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Corazones Ilimitados
          </p>
        </div>

        <Button onClick={onUpgrade} disabled={pending} aria-disabled={pending}>
          {hasActiveSubscription ? "settings" : "Comprar"}
        </Button>
      </div>
    </ul>
  );
};
