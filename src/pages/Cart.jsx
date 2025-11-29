import React from 'react'
import Layout from '../components/layout/Layout'
import '../styles/Cart.css'
import { useCart } from '../contexts/CartContext'

const formatCurrency = (value) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const Cart = () => {
  const {
    items,
    totalPrice,
    clearCart,
    removeOne,
    removeItemCompletely,
    addToCart,
  } = useCart()

  return (
    <Layout>
      <div className="cart-page">
        <section className="cart-hero">
          <h1>Giỏ Hàng Của Bạn</h1>
          <p>
            Danh sách sản phẩm bạn đã chọn. Khi tích hợp thanh toán, bước tiếp theo chỉ cần xác
            nhận đơn và chọn địa chỉ giao hàng.
          </p>
        </section>

        <section className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Giỏ hàng hiện đang trống. Hãy thêm một vài loại cá tươi nhé!</p>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-main">
                      <h3>{item.name}</h3>
                      <p>{formatCurrency(item.price)} / kg</p>
                    </div>
                    <div className="cart-item-meta">
                      <span className="cart-qty">x{item.quantity}</span>
                      <span className="cart-line-total">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <div className="cart-item-actions">
                        <button
                          type="button"
                          onClick={() => removeOne(item.id)}
                          className="cart-action cart-action-minor"
                        >
                          - 
                        </button>
                        <button
                          type="button"
                          onClick={() => addToCart({ id: item.id, name: item.name, priceValue: item.price })}
                          className="cart-action cart-action-add"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItemCompletely(item.id)}
                          className="cart-action cart-action-remove"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-secondary cart-clear-under"
                onClick={clearCart}
              >
                Xóa tất cả sản phẩm
              </button>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Tổng cộng</span>
                  <strong>{formatCurrency(totalPrice)}</strong>
                </div>
                <button
                  type="button"
                  className="btn-primary cart-checkout"
                  onClick={() =>
                    alert('Chưa làm ạ!')
                  }
                >
                  Thanh toán
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </Layout>
  )
}

export default Cart


