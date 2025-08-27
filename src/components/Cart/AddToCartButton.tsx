"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Product } from '@/types/ecomerce';
import { useToastContext } from '@/components/providers/ToastProvider';

interface AddToCartButtonProps {
  product: Product;
  storeId: number;
  className?: string;
}

export const AddToCartButton = ({ product, storeId, className }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addItem, setStoreId } = useCartStore();
  const { addToCart } = useToastContext();

  // Establecer el ID de la tienda cuando se monte el componente
  useEffect(() => {
    setStoreId(storeId);
  }, [storeId, setStoreId]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.SKU || !product.Nombre || !product.Precio) {
      alert('Información del producto incompleta');
      return;
    }

    setIsAdding(true);
    
    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 300));

    addItem({
      SKU: product.SKU,
      Nombre: product.Nombre,
      Precio: product.Precio,
      Imagen: product.Imagen,
      Categoria: product.Categoria,
      Marca: product.Marca,
    });

    setIsAdding(false);
    setAddedToCart(true);
    
    // Mostrar toast de confirmación usando el método especializado
    addToCart(product.Nombre);
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      setAddedToCart(false);
      setShowQuantityInput(false);
      setQuantity(1);
    }, 3000);
  };

  const handleQuantityChange = (newQuantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddWithQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.SKU || !product.Nombre || !product.Precio) {
      alert('Información del producto incompleta');
      return;
    }

    setIsAdding(true);
    
    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Agregar la cantidad especificada
    for (let i = 0; i < quantity; i++) {
      addItem({
        SKU: product.SKU,
        Nombre: product.Nombre,
        Precio: product.Precio,
        Imagen: product.Imagen,
        Categoria: product.Categoria,
        Marca: product.Marca,
      });
    }

    setIsAdding(false);
    setAddedToCart(true);
    
    // Mostrar toast de confirmación usando el método especializado
    addToCart(product.Nombre, quantity);
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      setAddedToCart(false);
      setShowQuantityInput(false);
      setQuantity(1);
    }, 3000);
  };

  if (addedToCart) {
    return (
      <Button
        variant="default"
        className={`${className} bg-green-600 hover:bg-green-700 text-white transition-all duration-300 scale-105`}
        disabled
      >
        <Check className="w-4 h-4 mr-2" />
        ¡Agregado al Carrito!
      </Button>
    );
  }

  if (showQuantityInput) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleQuantityChange(quantity - 1, e)}
          className="w-8 h-8 p-0"
          disabled={isAdding}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleQuantityChange(parseInt(e.target.value) || 1);
          }}
          className="w-16 text-center"
          disabled={isAdding}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleQuantityChange(quantity + 1, e)}
          className="w-8 h-8 p-0"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handleAddWithQuantity}
          className="flex-1"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Agregando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar ({quantity})
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowQuantityInput(false);
          }}
          className="px-2"
          disabled={isAdding}
        >
          ×
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button
        onClick={handleAddToCart}
        className="flex-1 transition-all duration-200 hover:scale-105"
        disabled={isAdding}
      >
        {isAdding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Agregando...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al Carrito
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowQuantityInput(true);
        }}
        className="px-3 transition-all duration-200 hover:scale-105"
        disabled={isAdding}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
