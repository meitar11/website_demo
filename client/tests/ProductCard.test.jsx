import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../src/components/ProductCard';
import { useCartStore } from '../src/store/useCartStore';

const product = {
  id: 'p1',
  name: 'Aurora Wireless Headphones',
  category: 'audio',
  price: 129.99,
  rating: 4.6,
  inStock: true,
  description: 'Over-ear headphones with active noise cancellation.',
};

describe('ProductCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('renders product details', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Aurora Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('adds the product to the cart when clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={product} />);
    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().totalQuantity()).toBe(1);
  });

  it('disables the button for out-of-stock products', () => {
    render(<ProductCard product={{ ...product, inStock: false }} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
