
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { ShopItemsList } from "./ShopItemsList";

const ShopPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Tienda
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Más beneficios, menos límites.
          </p>

          {}
          <ShopItemsList
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;