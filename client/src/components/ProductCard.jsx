import { FaStar, FaCartPlus } from 'react-icons/fa';
import classNames from 'classnames';
import { formatPrice, formatRating, titleCase } from '../utils/format';
import { useCartStore } from '../store/useCartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="product-card">
      <div className="product-card__body">
        <span className="product-card__category">
          {titleCase(product.category)}
        </span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__meta">
          <span className="product-card__rating">
            <FaStar aria-hidden="true" /> {formatRating(product.rating)}
          </span>
          <span
            className={classNames('product-card__stock', {
              'product-card__stock--out': !product.inStock,
            })}
          >
            {product.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="product-card__footer">
        <span className="product-card__price">
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!product.inStock}
          onClick={() => addItem(product)}
        >
          <FaCartPlus aria-hidden="true" /> Add
        </button>
      </div>
    </article>
  );
}
