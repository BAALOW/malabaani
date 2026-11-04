import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useShopContext from "../ShopContext";
import { useNotification } from "../context/NotificationContext";

const Payment = () => {
    const { products } = useShopContext();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const intialPayment = {
        evc: false,
        sahal: false,
        zaaad: false
    };

    const [paymentMethods, setPaymentMethods] = useState(intialPayment);
    const [phone, setPhone] = useState("");

    const getSelectedPayment = () => {
        if (paymentMethods.evc) return "EVC";
        if (paymentMethods.sahal) return "Sahal";
        if (paymentMethods.zaaad) return "Zaad";
        return "";
    };

    // ✅ Hubi xogta, kadib u gudub Checkout page
    const handleProceed = () => {
        const isSelected =
            paymentMethods.evc ||
            paymentMethods.sahal ||
            paymentMethods.zaaad;

        if (!isSelected) {
            showNotification("Please select a payment method! ⚠️", "error");
            return;
        }

        if (products.length === 0) {
            showNotification("Your cart is empty! 🛒", "error");
            return;
        }

        const phoneRegex = /^061\d{7}$/;
        if (!phoneRegex.test(phone)) {
            showNotification("Phone number is not valid! ❌", "error");
            return;
        }

        navigate("/checkout", {
            state: {
                paymentMethod: getSelectedPayment(),
                phone: phone
            }
        });
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
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Payment;