import { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    // ADD TO CART
    const addToCart = (product) => {
        setProducts(prev => {
            const exist = prev.find(p => p._id === product._id);
            if (exist) {
                return prev.map(p =>
                    p._id === product._id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    // INCREASE
    const increaseQty = (id) => {
        setProducts(prev =>
            prev.map(p =>
                p._id === id ? { ...p, quantity: p.quantity + 1 } : p
            )
        );
    };

    // DECREASE
    const decreaseQty = (id) => {
        setProducts(prev =>
            prev.map(p =>
                p._id === id && p.quantity > 1
                    ? { ...p, quantity: p.quantity - 1 }
                    : p
            )
        );
    };

    // REMOVE
    const removeFromCart = (id) => {
        setProducts(prev => prev.filter(p => p._id !== id));
    };

    // CLEAR CART
    const clearCart = () => {
        setProducts([]);
    };

    // TOTAL PRICE
    const total = products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <ShopContext.Provider value={{
            products,
            addToCart,
            removeFromCart,
            increaseQty,
            decreaseQty,
            total,
            clearCart
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export default function useShopContext() {
    return useContext(ShopContext);
}