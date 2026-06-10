import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaStore } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const count = useCartStore((state) => state.totalQuantity());

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <FaStore aria-hidden="true" /> ShopDemo
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="navbar__cart" aria-label={`Cart, ${count} items`}>
          <FaShoppingCart aria-hidden="true" />
          <span className="navbar__cart-count">{count}</span>
        </div>
      </div>
    </header>
  );
}
