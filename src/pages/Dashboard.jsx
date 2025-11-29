import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import Layout from '../components/layout/Layout'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Lấy thông tin user từ localStorage hoặc API
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    authAPI.logout()
    navigate('/')
  }

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-container">
          <div className="dashboard-card">
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-content">
            <div className="welcome-section">
              <h2>Chào mừng!</h2>
              {user && (
                <div className="user-info">
                  <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                  <p><strong>Tên:</strong> {user.fullName || user.name || user.email?.split('@')[0] || 'N/A'}</p>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-button">
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

