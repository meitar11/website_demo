import { Link } from 'react-router-dom';
import { FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';

const features = [
  {
    icon: FaTruck,
    title: 'Fast delivery',
    text: 'Free two-day shipping on every demo order.',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure checkout',
    text: 'Helmet, rate limiting, and JWT auth out of the box.',
  },
  {
    icon: FaUndo,
    title: 'Easy returns',
    text: '30-day no-questions-asked return policy.',
  },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">Gear that just works.</h1>
        <p className="hero__subtitle">
          A demo storefront powered by an Express API and a React + Vite
          frontend.
        </p>
        <Link to="/products" className="btn btn--primary btn--lg">
          Browse products
        </Link>
      </section>

      <section className="features">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="feature">
            <Icon className="feature__icon" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
