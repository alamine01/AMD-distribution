import { useCart } from '../context/CartContext';
import { showToast } from './Toast';
import './ProductCard.css';

function ProductCard({ product, onOrderClick }) {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast('Produit ajouté au panier', 'success');
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) {
      return { text: 'Rupture de stock', className: 'out-of-stock' };
    } else if (stock < 10) {
      return { text: `${stock} en stock`, className: 'low-stock' };
    } else {
      return { text: `${stock} en stock`, className: 'in-stock' };
    }
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className={`product-stock ${stockInfo.className}`}>
          {stockInfo.text}
        </div>
        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="product-price">{formatPrice(product.price || 0)}</span>
          </div>
          <div className="product-actions">
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              title="Ajouter au panier"
            >
              🛒
            </button>
            <button
              className="order-button"
              onClick={() => onOrderClick(product)}
            >
              Commander
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
