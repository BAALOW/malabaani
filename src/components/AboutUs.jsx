import { FaHamburger, FaUsers, FaConciergeBell, FaLeaf } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="about">

      {/* HERO */}
      <div className="about-hero">
        <h1>About Us</h1>
      </div>

      {/* STORY */}
      <div className="about-story">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            Welcome to malabeen restaurent, where we bring authentic Somali flavors to your table.
            Our passion for delicious food drives everything we do.
            Over time, Malabeen has grown into more than just a restaurant — it has become a community space filled with joy, laughter, and unforgettable moments. We take pride in our friendly service, clean environment, and carefully prepared menu that satisfies every customer. At Malabeen, every meal tells a story, and every guest is part of our journey.
          </p>
          <button>Read More</button>
        </div>

        <div className="story-img">
          <img src="https://i.pinimg.com/1200x/41/a1/33/41a133e2c4d964c5aea12f03187990f8.jpg" alt="" />
        </div>
      </div>

      {/* MISSION */}
      <div className="about-mission">
        <div className="mission-img">
          <img src="https://i.pinimg.com/736x/86/11/f7/8611f7462f50374fee61713e5165d338.jpg" alt="" />
        </div>

        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a memorable dining experience with quality ingredients.
          </p>

          <ul>
            <li>✔ Quality & Tradition</li>
            <li>✔ Fresh Ingredients</li>
            <li>✔ Authentic Recipes</li>
            <li>✔ Friendly Service</li>
            <li>✔ Community Focus</li>
            <li>✔ Customer Satisfaction</li>
            <li>✔ Clean & Cozy Environment</li>
            <li>✔ Continuous Improvement</li>

          </ul>
        </div>
      </div>

      {/* WHY US */}
      <div className="why-us">
        <h2>Why Choose Us?</h2>

        <div className="why-cards">
          <div className="card">
            <FaHamburger className="icon" />
            <h3>Great Taste</h3>
            <p>Delicious meals for everyone.</p>
          </div>

          <div className="card">
            <FaUsers className="icon" />
            <h3>Family Friendly</h3>
            <p>Enjoy with your loved ones.</p>
          </div>

          <div className="card">
            <FaConciergeBell className="icon" />
            <h3>Best Service</h3>
            <p>Fast and friendly service.</p>
          </div>
          <div className="card">
            <FaLeaf className="icon" />
            <h3>Fresh Ingredients</h3>
            <p>Only the freshest for you.</p>
          </div>
          
        </div>

      </div>
      {/* FOOTER */}
<div className="footer">

  <div className="footer-container">

    <div className="footer-box">
      <h3>Malabeen</h3>
      <p>
        We provide the best Somali traditional food with great taste and quality service.
      </p>
    </div>

    <div className="footer-box">
      <h3>Quick Links</h3>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Menu</li>
        <li>Contact</li>
      </ul>
    </div>

    <div className="footer-box">
      <h3>Contact</h3>
      <p>Mogadishu, Somalia</p>
      <p>+252 61 234 5678</p>
      <p>info@malabeen.com</p>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2026 Malabeen Restaurant. All Rights Reserved.</p>
  </div>

</div>

    </div>
  );
}

export default AboutUs;