"use client";

interface ShopItemProps {
  title: string;
  description: string;
  price: string;
  disabled?: boolean;
  onClick: () => void;
}

export function ShopItem({ title, description, price, disabled, onClick }: ShopItemProps) {
  return (
    <div className="border rounded p-4 shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 my-2">{description}</p>
      <p className="font-bold mb-4">{price}</p>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400`}
      >
        {disabled ? "Suscrito" : "Suscríbete"}
      </button>
    </div>
  );
}