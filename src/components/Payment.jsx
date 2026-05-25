import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useShopContext from "../ShopContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext"; // ✅
import API from "../api";

const Payment = () => {
    const { products, total, clearCart } = useShopContext();
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification(); // ✅
    const navigate = useNavigate();

    const intialPayment = {
        evc: false,
        sahal: false,
        zaaad: false
    };

    const [paymentMethods, setPaymentMethods] = useState(intialPayment);
    const [phone, setPhone] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const getSelectedPayment = () => {
        if (paymentMethods.evc) return "EVC";
        if (paymentMethods.sahal) return "Sahal";
        if (paymentMethods.zaaad) return "Zaad";
        return "";
    };

    const handleProceed = () => {
        const isSelected =
            paymentMethods.evc ||
            paymentMethods.sahal ||
            paymentMethods.zaaad;

        if (!isSelected) {
            showNotification("Please select a payment method! ⚠️", "error"); // ✅
            return;
        }

        if (products.length === 0) {
            showNotification("Your cart is empty! 🛒", "error"); // ✅
            return;
        }

        const phoneRegex = /^061\d{7}$/;
        if (!phoneRegex.test(phone)) {
            showNotification("Phone number is not valid! ❌", "error"); // ✅
            return;
        }

        setShowModal(true);
    };

    // ✅ MARKA CONFIRM LA DHUFTO - ORDER LA KEYDIYO
    const handleConfirm = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            await API.post("/orders/place", {
                items: products,
                total: total,
                paymentMethod: getSelectedPayment(),
                phone: phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            clearCart();
            setShowModal(false);
            showNotification("Order placed successfully! 🎉", "success"); // ✅
            navigate("/orders");

        } catch (err) {
            console.log(err);
            showNotification("Order failed! Please try again ❌", "error"); // ✅
        }
        setLoading(false);
    };

    return (
        <div>
            <h2 className="payment-title">Pay With</h2>

            <div className="payment-cards">
                <div
                    className={`payment-card ${paymentMethods.zaaad ? "selected" : ""}`}
                    onClick={() => setPaymentMethods({ ...intialPayment, zaaad: true })}
                >
                    <h3>Zaad</h3>
                </div>

                <div
                    className={`payment-card ${paymentMethods.evc ? "selected" : ""}`}
                    onClick={() => setPaymentMethods({ ...intialPayment, evc: true })}
                >
                    <h3>EVC</h3>
                </div>

                <div
                    className={`payment-card ${paymentMethods.sahal ? "selected" : ""}`}
                    onClick={() => setPaymentMethods({ ...intialPayment, sahal: true })}
                >
                    <h3>Sahal</h3>
                </div>
            </div>

            <input
                type="text"
                placeholder="061XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button className="btn-proceeed" onClick={handleProceed}>
                Proceed
            </button>

            {/* MODAL */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">

                        <h2>Order Summary</h2>

                        <h3>Products</h3>
                        {products.map((p, i) => (
                            <div key={i} className="modal-product">
                                <img src={p.urlImage} alt="" />
                                <span>{p.name}</span>
                                <span>{p.quantity} x ${p.price}</span>
                            </div>
                        ))}

                        <h4>Total: ${total}</h4>

                        <h3>Payment Info</h3>
                        <p>Method: {getSelectedPayment()}</p>
                        <p>Phone: {phone}</p>

                        <div className="modal-buttons">
                            <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>

                            <button
                                className="confirm-btn"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Confirm ✅"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;