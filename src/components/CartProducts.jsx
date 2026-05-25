import useShopContext from "../ShopContext";

const CartProducts = () => {
    const {
        products,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total
    } = useShopContext();

    return (
        <div className="cart-products">
            <h2>Cart Products</h2>

            {products.length === 0 ? (
                <p style={{ textAlign: "center", color: "#888" }}>
                    Your cart is empty! 🛒
                </p>
            ) : (
                <>
                    {products.map((product, index) => (
                        <div className="cart-product" key={index}>
                            <img src={product.urlImage} alt="" />
                            <span>{product.name}</span>
                            <span>${product.price * product.quantity}</span>

                            <div className="qty-box">
                                <button onClick={() => decreaseQty(product._id)}>-</button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increaseQty(product._id)}>+</button>
                            </div>

                            <button
                                className="btn-delete"
                                onClick={() => removeFromCart(product._id)}
                            >
                                delete
                            </button>
                        </div>
                    ))}

                    <h3>Total price: ${total}</h3>
                </>
            )}
        </div>
    );
};

export default CartProducts;