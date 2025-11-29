import React, { useMemo, useState } from 'react'
import Layout from '../components/layout/Layout'
import '../styles/Products.css'
import { useCart } from '../contexts/CartContext'
import { PRODUCTS } from '../data/products'
import ProductModal from '../components/common/ProductModal'

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((item) => item.category)))
    return ['all', ...unique]
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  return (
    <Layout>
      <div className="products-page">
        <section className="products-hero">
          <div>
            <p className="eyebrow">Danh mục sản phẩm</p>
            <h1>Chọn loại cá tươi theo nhu cầu của bạn</h1>
            <p>
              Hơn 50 loại cá được cập nhật theo mùa, truy xuất nguồn gốc rõ ràng và giao hàng trong vòng
              24 giờ tại TP.HCM và các tỉnh lân cận.
            </p>
          </div>
          <div className="hero-highlight">
            <div>
              <span>100%</span>
              <p>Kiểm định an toàn</p>
            </div>
            <div>
              <span>12+</span>
              <p>Kho lạnh khu vực</p>
            </div>
          </div>
        </section>

        <section className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'Tất cả' : category}
            </button>
          ))}
        </section>

        <section className="products-grid">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="product-card interactive"
              onClick={() => {
                setSelectedProduct(product)
                setIsModalOpen(true)
              }}
              style={{ cursor: 'pointer' }}
            >
              <header>
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
              </header>
              <div className="product-meta">
                <span className="product-price">{product.price}</span>
                <span className="product-freshness">{product.freshness}</span>
              </div>
              <button
                className="btn-primary"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product)
                }}
              >
                Thêm vào giỏ
              </button>
            </article>
          ))}
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
    </Layout>
  )
}

export default Products


