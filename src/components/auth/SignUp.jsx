import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import '../../styles/Auth.css'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.fullName || formData.fullName.trim() === '') {
      setError('Vui lòng nhập họ và tên')
      return
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      setError('Vui lòng nhập số điện thoại')
      return
    }

    if (!formData.email || formData.email.trim() === '') {
      setError('Vui lòng nhập email')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      // Format phoneNumber: đảm bảo có dấu + ở đầu nếu chưa có
      let formattedPhone = formData.phoneNumber.trim()
      if (!formattedPhone.startsWith('+')) {
        // Nếu bắt đầu bằng 0, thay bằng +84
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+84' + formattedPhone.substring(1)
        } else if (formattedPhone.startsWith('84')) {
          formattedPhone = '+' + formattedPhone
        } else {
          formattedPhone = '+84' + formattedPhone
        }
      }

      // Chuẩn bị dữ liệu gửi lên API theo format của Swagger
      const userData = {
        phoneNumber: formattedPhone,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName.trim(),
      }

      const response = await authAPI.signup(userData)
      
      // Xử lý response theo format từ Swagger: { result, message, isSuccess, statusCode }
      // Hoặc kiểm tra HTTP status code (200 = thành công)
      const isSuccess = response.httpStatus === 200 || 
                       response.isSuccess === true || 
                       response.statusCode === 200 ||
                       response.statusCode === 0 // Một số API dùng 0 cho success
      
      if (isSuccess) {
        // Nếu có token trong response, tự động đăng nhập
        if (response.token || response.data?.token) {
          const token = response.token || response.data.token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(response.user || response.data?.user))
          navigate('/dashboard')
        } else {
          // Nếu không có token, hiển thị thông báo và chuyển đến trang login
          const successMessage = response.message || response.result || 'Đăng ký thành công! Vui lòng đăng nhập.'
          alert(successMessage)
          navigate('/login')
        }
      } else {
        // Nếu isSuccess = false
        const errorMsg = response.message || response.result || 'Đăng ký thất bại. Vui lòng thử lại.'
        setError(errorMsg)
      }
    } catch (err) {
      // Xử lý lỗi từ API - hiển thị message chi tiết từ server
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.error) {
        errorMessage = err.error
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err.isSuccess === false && err.message) {
        errorMessage = err.message
      } else if (err.result) {
        errorMessage = err.result
      }
      
      // Nếu có validation errors từ API
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join(', ')
      } else if (err.errors && typeof err.errors === 'object') {
        errorMessage = Object.values(err.errors).flat().join(', ')
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <Link to="/" className="auth-link" style={{ fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            ← Về trang chủ
          </Link>
        </div>
        <h1 className="auth-title">Đăng Ký</h1>
        <p className="auth-subtitle">Tạo tài khoản mới</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên của bạn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại"
              disabled={loading}
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Hệ thống sẽ tự động thêm mã quốc gia +84 nếu chưa có
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link">
            Đăng nhập ngay
          </Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" className="auth-link" style={{ fontSize: '14px' }}>
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp

