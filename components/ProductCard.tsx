
import React from 'react';
import { Product } from '../types';
import { Plus, Minus } from 'lucide-react';
import { useApp } from '../App';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, removeFromCart } = useApp();
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4">
      <div className="w-24 h-24 flex-shrink-0 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-lg"
        />
        {product.discountPrice && (
          <span className="absolute top-1 left-1 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
            Offer
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">₹{product.price}</span>
            {product.discountPrice && (
              <span className="text-[10px] text-gray-400 line-through">₹{product.discountPrice}</span>
            )}
          </div>

          <div className="flex items-center">
            {quantity > 0 ? (
              <div className="flex items-center bg-[#146eb4]/10 rounded-lg border border-[#146eb4]/20">
                <button 
                  onClick={() => removeFromCart(product.id)}
                  className="p-1.5 text-[#146eb4] hover:bg-[#146eb4]/20 rounded-l-lg"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-sm font-bold text-[#146eb4]">{quantity}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="p-1.5 text-[#146eb4] hover:bg-[#146eb4]/20 rounded-r-lg"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="flex items-center gap-1 px-4 py-1.5 bg-[#146eb4] text-white text-xs font-bold rounded-lg hover:bg-[#115a95] transition-colors"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
