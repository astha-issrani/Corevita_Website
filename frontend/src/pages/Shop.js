import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Shop.css';

const products = [
  {
    id: 'mock1',
    slug: 'bee-pearl',
    name: 'CoreVita Bee Pearl Capsules',
    price: 49.99,
    originalPrice: 79.99,
    savingsPercent: 37,
    rating: 4.7,
    reviewCount: 400,
    tagline: 'Restore natural vitality, energy & mental clarity',
    featured: true,
  }
];

export default function Shop() {
  const { addToCart } = useCart();

  const handleQuickAdd = (product) => {
    addToCart({
      productId: product.id,
      packId: product.id + '_default',
      name: product.name,
      packLabel: '1 Bottle',
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
    });
  };

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container">
          <h1>Shop CoreVita</h1>
          <p>Nature's most bioavailable supplements, crafted for modern wellness</p>
        </div>
      </div>

      <div className="container shop-products">
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.slug}`} className="product-card-img-link">
                <div className="product-card-img">
                  <div className="card-bottle">
                    <div className="card-bottle-label">
                      <span>CoreVita</span>
                      <strong>BEE PEARL</strong>
                    </div>
                  </div>
                  {product.featured && <span className="featured-badge">⭐ Best Seller</span>}
                </div>
              </Link>
              <div className="product-card-info">
                <div className="product-card-rating">
                  <span className="stars">★★★★★</span>
                  <span>{product.rating} ({product.reviewCount}+ reviews)</span>
                </div>
                <Link to={`/products/${product.slug}`}>
                  <h3>{product.name}</h3>
                </Link>
                <p>{product.tagline}</p>
                <div className="product-card-price">
                  <span className="card-price">${product.price}</span>
                  <span className="card-original">${product.originalPrice}</span>
                  <span className="badge badge-green">SAVE {product.savingsPercent}%</span>
                </div>
                <div className="product-card-actions">
                  <Link to={`/products/${product.slug}`} className="btn-primary">
                    View Product
                  </Link>
                  <button className="btn-outline" onClick={() => handleQuickAdd(product)}>
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
