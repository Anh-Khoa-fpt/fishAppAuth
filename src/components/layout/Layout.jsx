import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../common/Header'
import '../../styles/Layout.css'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    setCanGoBack(window.history.length > 1)
  }, [location])

  const showToolbar = location.pathname !== '/'

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else if (location.pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {showToolbar && (
          <div className="page-toolbar">
            <button className="back-button" onClick={handleBack}>
              ← Quay lại
            </button>
            <span className="current-path">
              {location.pathname.replace('/', '')}
            </span>
          </div>
        )}
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

