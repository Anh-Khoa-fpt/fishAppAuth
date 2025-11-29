import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import { PRODUCTS } from '../data/products'
import { useCart } from '../contexts/CartContext'
import ProductModal from '../components/common/ProductModal'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Lắng nghe sự kiện khi đăng nhập/đăng xuất
    const handleAuthChange = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }

    window.addEventListener('authStateChanged', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.interactive')

    const handleTouchStart = (event) => {
      event.currentTarget.classList.add('touch-active')
    }

    const handleTouchEnd = (event) => {
      event.currentTarget.classList.remove('touch-active')
    }

    elements.forEach((el) => {
      el.addEventListener('touchstart', handleTouchStart, { passive: true })
      el.addEventListener('touchend', handleTouchEnd)
      el.addEventListener('touchcancel', handleTouchEnd)
    })

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('touchstart', handleTouchStart)
        el.removeEventListener('touchend', handleTouchEnd)
        el.removeEventListener('touchcancel', handleTouchEnd)
      })
    }
  }, [])

  const featuredProducts = PRODUCTS.slice(0, 4)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Cá Tươi Sống Chất Lượng Cao</h1>
          <p className="hero-subtitle">
            Chuyên cung cấp các loại cá tươi sống, đảm bảo chất lượng và an toàn vệ sinh thực phẩm
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary interactive">
              Xem Sản Phẩm
            </Link>
            <Link to="/about" className="btn-secondary interactive">
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
        <div className="hero-image">
          
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card interactive"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsModalOpen(true)
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-header">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer" onClick={(e) => e.stopPropagation()}>
                  <span className="product-price">{product.price}</span>
                  <button
                    type="button"
                    className="btn-add-cart interactive"
                    onClick={() => addToCart(product)}
                  >
                    Thêm Vào Giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <Link to="/products" className="btn-primary interactive">
              Xem Tất Cả Sản Phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          {isLoggedIn ? (
            <>
              <h2>Sẵn Sàng Mua Hàng Ngay?</h2>
              <p>Khám phá các sản phẩm cá tươi sống chất lượng cao</p>
              <Link to="/products" className="btn-primary btn-large interactive">
                Mua Hàng Ngay
              </Link>
            </>
          ) : (
            <>
              <h2>Sẵn Sàng Đặt Hàng Ngay?</h2>
              <p>Đăng ký tài khoản để nhận nhiều ưu đãi đặc biệt</p>
              <Link to="/signup" className="btn-primary btn-large interactive">
                Đăng Ký Ngay
              </Link>
            </>
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}

export default Home

