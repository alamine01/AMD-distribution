import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import { showToast } from './Toast';
import './ProductCard.css';

function ProductCard({ product, onOrderClick }) {
  const { addToCart } = useCart();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const handleOpenLightbox = () => {
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = (e) => {
    e?.stopPropagation();
    setIsLightboxOpen(false);
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) {
      return { text: 'Rupture de stock', className: 'out-of-stock' };
    } else if (stock < 10) {
      return { text: `Plus que ${stock} en stock`, className: 'low-stock' };
    } else {
      return { text: `En stock (${stock})`, className: 'in-stock' };
    }
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <>
      <div className="product-card" onClick={handleOpenLightbox}>
        <div className="product-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="product-placeholder">
              <span>📦</span>
            </div>
          )}
          <div className={`product-stock-badge ${stockInfo.className}`}>
            {stockInfo.text}
          </div>
          <div className="zoom-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Zoomer</span>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name" title={product.name}>{product.name}</h3>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          
          <div className="product-footer">
            <div className="product-price-wrapper">
              <span className="product-price">{formatPrice(product.price || 0)}</span>
            </div>
            
            <div className="product-actions">
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                title="Ajouter au panier"
                aria-label="Ajouter au panier"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </button>
              <button
                className="order-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOrderClick(product);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Commander
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lightbox Grand Format */}
      {isLightboxOpen && createPortal(
        <div className="product-lightbox-overlay" onClick={handleCloseLightbox}>
          <div className="product-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={handleCloseLightbox} aria-label="Fermer">×</button>
            
            <div className="lightbox-image-container">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-placeholder">📦</div>
              )}
            </div>

            <div className="lightbox-details">
              <div className="lightbox-header">
                <span className={`product-stock-badge ${stockInfo.className}`}>
                  {stockInfo.text}
                </span>
                <h2 className="lightbox-title">{product.name}</h2>
                <div className="lightbox-price">{formatPrice(product.price || 0)}</div>
              </div>

              {product.description && (
                <p className="lightbox-description">{product.description}</p>
              )}

              <div className="lightbox-actions">
                <button
                  className="lightbox-add-cart-btn"
                  onClick={(e) => {
                    handleAddToCart(e);
                    handleCloseLightbox();
                  }}
                >
                  🛒 Ajouter au panier
                </button>
                <button
                  className="lightbox-order-btn"
                  onClick={(e) => {
                    handleCloseLightbox(e);
                    onOrderClick(product);
                  }}
                >
                  💬 Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default ProductCard;
