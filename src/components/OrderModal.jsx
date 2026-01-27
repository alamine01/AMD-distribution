import { useState } from 'react';
import './OrderModal.css';

function OrderModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    quantity: 1,
    address: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      alert('Veuillez remplir au moins le nom et le téléphone');
      return;
    }
    onSubmit(formData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const totalPrice = (product.price || 0) * formData.quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Commander: {product.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="customerName">Nom complet *</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Téléphone *</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantité *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse de livraison</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes supplémentaires</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Prix unitaire:</span>
              <span>{formatPrice(product.price || 0)}</span>
            </div>
            <div className="summary-row">
              <span>Quantité:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Envoyer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderModal;
