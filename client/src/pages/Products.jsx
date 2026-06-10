import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../api/client';
import ProductCard from '../components/ProductCard';
import { titleCase } from '../utils/format';

export default function Products() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ['products', category, search],
    queryFn: () => fetchProducts({ category, search }),
  });

  return (
    <div className="products">
      <div className="products__toolbar">
        <input
          type="search"
          className="input"
          placeholder="Search products…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search products"
        />
        <select
          className="input"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {(categoriesQuery.data || []).map((cat) => (
            <option key={cat} value={cat}>
              {titleCase(cat)}
            </option>
          ))}
        </select>
      </div>

      {productsQuery.isLoading && <p className="status">Loading products…</p>}
      {productsQuery.isError && (
        <p className="status status--error">
          Could not load products. Is the API running?
        </p>
      )}

      {productsQuery.data && (
        <>
          <p className="products__count">
            {productsQuery.data.count} product
            {productsQuery.data.count === 1 ? '' : 's'}
          </p>
          <div className="products__grid">
            {productsQuery.data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
