import { useQuery } from '@tanstack/react-query';
import { fetchProductStats } from '../api/client';
import CategoryChart from '../components/CategoryChart';
import { formatPrice, titleCase } from '../utils/format';

export default function Stats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-stats'],
    queryFn: fetchProductStats,
  });

  return (
    <div className="stats">
      <h1>Catalog stats</h1>
      <p className="stats__intro">Products and average price by category.</p>

      {isLoading && <p className="status">Loading stats…</p>}
      {isError && (
        <p className="status status--error">
          Could not load stats. Is the API running?
        </p>
      )}

      {data && (
        <>
          <CategoryChart stats={data} />
          <table className="stats__table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Avg. price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.category}>
                  <td>{titleCase(row.category)}</td>
                  <td>{row.count}</td>
                  <td>{formatPrice(row.averagePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
