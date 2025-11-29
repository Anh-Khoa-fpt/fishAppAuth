import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import '../styles/Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // Nếu parse lỗi thì bỏ qua, dùng dữ liệu rỗng
      }
    }
  }, [])

  const displayName =
    user?.fullName || user?.name || user?.userName || user?.email?.split('@')[0] || 'Người dùng'

  return (
    <Layout>
      <div className="profile-page">
        <section className="profile-hero">
          <div className="profile-avatar">
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-hero-text">
            <p className="eyebrow">Tài khoản của bạn</p>
            <h1>{displayName}</h1>
            <p>
              Đây là trang tổng quan thông tin tài khoản. Các thông tin
              như địa chỉ giao hàng, lịch sử đơn hàng sẽ được hiển thị tại đây.
            </p>
          </div>
        </section>

        <section className="profile-info-card">
          <h2>Thông tin cơ bản</h2>
          <div className="profile-info-grid">
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{user?.email || 'chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Họ tên</span>
              <span className="value">{user?.fullName || user?.name || 'chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Số điện thoại</span>
              <span className="value">{user?.phoneNumber || 'chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Vai trò</span>
              <span className="value">{user?.role || 'Khách hàng'}</span>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Profile


