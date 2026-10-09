import React, { useState } from 'react';
import { Product, ProductAddon } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Check, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, language, t, isFavorite, toggleFavorite } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{
    groupId: string;
    addonId: string;
    name: string;
    price: number;
  }[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!product) return null;

  const handleToggleAddon = (
    groupId: string,
    addon: ProductAddon,
    maxSelectable: number
  ) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.addonId === addon.id);
      if (exists) {
        return prev.filter((a) => a.addonId !== addon.id);
      } else {
        const groupCount = prev.filter((a) => a.groupId === groupId).length;
        if (groupCount >= maxSelectable && maxSelectable === 1) {
          // Replace single selection
          const filtered = prev.filter((a) => a.groupId !== groupId);
          return [...filtered, { groupId, addonId: addon.id, name: addon.name, price: addon.price }];
        }
        if (groupCount >= maxSelectable) return prev;
        return [...prev, { groupId, addonId: addon.id, name: addon.name, price: addon.price }];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const itemUnitPrice = product.price + addonsTotal;
  const totalPrice = itemUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedAddons, specialNote);
    onClose();
  };

  const isFav = isFavorite(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E2228] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-100 dark:border-white/10 animate-in fade-in slide-in-from-bottom duration-200">
        {/* Cover Photo */}
        <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Close & Favorite buttons */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isFav ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-white'
              }`}
            />
          </button>

          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-[#FF6B00] text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
              TZS {product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {language === 'sw' ? product.nameSw : product.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {language === 'sw' ? product.descriptionSw : product.description}
            </p>
          </div>

          {/* Add-on Groups */}
          {product.addonGroups &&
            product.addonGroups.map((group) => (
              <div key={group.id} className="pt-2 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    {language === 'sw' ? group.nameSw : group.name}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {group.required ? t.required : `${t.optional} (max ${group.maxSelectable})`}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {group.options.map((option) => {
                    const isChecked = selectedAddons.some((a) => a.addonId === option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleToggleAddon(group.id, option, group.maxSelectable)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                          isChecked
                            ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-orange-950/20'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                              isChecked
                                ? 'bg-[#FF6B00] border-[#FF6B00] text-white'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {language === 'sw' ? option.nameSw : option.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {option.price > 0 ? `+TZS ${option.price.toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special instructions */}
          <div className="pt-2 border-t border-gray-100 dark:border-white/10">
            <label className="block text-xs font-bold text-gray-900 dark:text-white mb-1.5">
              {t.specialInstructions}
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Extra serviette, mild pili pili, no onions"
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:border-[#FF6B00] outline-none"
            />
          </div>
        </div>

        {/* Footer: Quantity + Add To Cart Button */}
        <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-[#16191E]/80 backdrop-blur-xs flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white dark:bg-[#20252D] rounded-xl border border-gray-200 dark:border-white/10 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-xs text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-between text-xs sm:text-sm"
          >
            <span>{t.addToCart}</span>
            <span>TZS {totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
