import React from 'react'
import '../../styles/ProductModal.css'
import { useCart } from '../../contexts/CartContext'

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart()

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    addToCart(product)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-body">
          <div className="modal-image">
            <span className="modal-icon">{product.image}</span>
          </div>
          <div className="modal-info">
            <p className="modal-category">{product.category}</p>
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-desc">{product.desc}</p>
            <div className="modal-details">
              <div className="modal-detail-item">
                <span className="detail-label">Giá:</span>
                <span className="detail-value">{product.price}</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Độ tươi:</span>
                <span className="detail-value">{product.freshness}</span>
              </div>
            </div>
            <button className="modal-add-btn" onClick={handleAddToCart}>
              Thêm Vào Giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal

