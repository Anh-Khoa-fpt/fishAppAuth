import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import '../../styles/Header.css'
import { useCart } from '../../contexts/CartContext'

const Header = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount, clearCart } = useCart()
  const [cartBump, setCartBump] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  // Hàm để kiểm tra và cập nhật trạng thái đăng nhập
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token) {
      setIsLoggedIn(true)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    // Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất từ tab khác
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Lắng nghe custom event khi đăng nhập thành công
    const handleLoginSuccess = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('authStateChanged', handleLoginSuccess)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleLoginSuccess)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event) => {
      const navEl = navRef.current
      const toggleEl = toggleRef.current
      if (
        navEl &&
        !navEl.contains(event.target) &&
        (!toggleEl || !toggleEl.contains(event.target))
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [menuOpen])

  useEffect(() => {
    const handleCartAdd = () => {
      setCartBump(true)
      setTimeout(() => setCartBump(false), 300)
    }

    window.addEventListener('cart:add', handleCartAdd)
    return () => window.removeEventListener('cart:add', handleCartAdd)
  }, [])

  const handleNavClick = () => {
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Dù có lỗi, vẫn tiếp tục xóa local
    } finally {
      setIsLoggedIn(false)
      setUser(null)
      // Xóa giỏ hàng khi đăng xuất
      clearCart()
      // Dispatch event để các component khác biết đã đăng xuất
      window.dispatchEvent(new Event('authStateChanged'))
      navigate('/')
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐟</span>
          <span className="logo-text">Cá Là Bạn</span>
        </Link>

        <nav ref={navRef} className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={handleNavClick}>Trang Chủ</Link>
          <Link to="/products" className="nav-link" onClick={handleNavClick}>Sản Phẩm</Link>
          <Link to="/about" className="nav-link" onClick={handleNavClick}>Giới Thiệu</Link>
          <Link to="/contact" className="nav-link" onClick={handleNavClick}>Liên Hệ</Link>
          
          {isLoggedIn ? (
            <div className="user-menu">
              <button
                type="button"
                className="welcome-text"
                onClick={() => navigate('/profile')}
              >
                Welcome, <strong>{user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'}</strong>
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login" onClick={handleNavClick}>Đăng Nhập</Link>
              <Link to="/signup" className="btn-signup" onClick={handleNavClick}>Đăng Ký</Link>
            </div>
          )}
        </nav>

        <div className="header-right">
          <button
            type="button"
            className={`cart-pill ${cartBump ? 'cart-bump' : ''}`}
            onClick={() => navigate('/cart')}
            aria-label="Giỏ hàng"
          >
            🛒
            {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
          </button>

          <button 
            className="menu-toggle"
            ref={toggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

