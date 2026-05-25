import { useRef, useState } from "react";

const ContactUs = () => {

  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const message = messageRef.current.value;

    // VALIDATION
    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    // SAVE LOCALSTORAGE
    localStorage.setItem(
      "contactMessage",
      JSON.stringify({ name, email, message })
    );

    // CLEAR FORM
    nameRef.current.value = "";
    emailRef.current.value = "";
    messageRef.current.value = "";

    // SUCCESS MESSAGE
    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <div className="contact">

      {/* HERO */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
      </div>

      <div className="contact-container">

        {/* FORM */}
        <div className="contact-form">
          <h2>Get In Touch</h2>

          <input ref={nameRef} type="text" placeholder="Your Name" />
          <input ref={emailRef} type="email" placeholder="Your Email" />
          <textarea ref={messageRef} placeholder="Your Message"></textarea>

          <button  onClick={handleSend}>Send Message</button>

          {/* SUCCESS MESSAGE */}
          {sent && <p style={{ color: "green", marginTop: "10px" }}>
            ✅ Message sent successfully
          </p>}
        </div>

        {/* INFO */}
        <div className="contact-info">

          <div className="map">
            <img src="https://i.pinimg.com/736x/a3/55/42/a35542c64e77bcf79e1aa50b39f8c6e9.jpg" alt="" />
          </div>

          <div className="info-box">
            <h3>Visit Us</h3>
            <p>Mogadishu, Somalia</p>

            <h3>Phone</h3>
            <p>+252 61 234 5678</p>

            <h3>Email</h3>
            <p>info@dhadhan.com</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ContactUs;