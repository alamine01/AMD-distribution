import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Ici vous pouvez ajouter la logique pour passer la commande
    // Pour l'instant, on affiche juste un message
    alert(`Commande de ${cartItems.length} article(s) pour un total de ${formatPrice(getTotalPrice())}`);
    // Vous pouvez aussi rediriger vers une page de checkout ou ouvrir un modal
  };

  return (
    <>
      <button className="cart-button" onClick={() => setIsOpen(true)}>
        <div className="cart-button-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
          </svg>
          <span className="cart-button-text">By Now</span>
        </div>
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        )}
      </button>

      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Panier</h2>
              <button className="close-cart" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p>Votre panier est vide</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} />
                          ) : (
                            <div className="cart-item-placeholder">📦</div>
                          )}
                        </div>
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p className="cart-item-price">{formatPrice(item.price)}</p>
                          <div className="cart-item-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button
                              className="remove-btn"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total:</span>
                      <span className="total-price">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="cart-actions">
                      <button className="clear-cart-btn" onClick={clearCart}>
                        Vider le panier
                      </button>
                      <button className="checkout-btn" onClick={handleCheckout}>
                        Commander
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
