import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { authAPI } from '../../services/api'
import '../../styles/Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleAuthResponse = (response, fallbackUser = null) => {
    const isSuccess =
      response?.httpStatus === 200 ||
      response?.isSuccess === true ||
      response?.statusCode === 200 ||
      response?.statusCode === 0

    if (!isSuccess) {
      const errorMsg =
        response?.message || response?.result || 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(errorMsg)
      return false
    }

    const token =
      response?.token ||
      response?.data?.token ||
      response?.result?.token ||
      response?.result?.accessToken ||
      (typeof response?.result === 'string' ? response.result : null)

    if (token) {
      localStorage.setItem('token', token)

    const user =
      response?.user ||
      response?.data?.user ||
      response?.result?.user ||
      fallbackUser
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      window.dispatchEvent(new Event('authStateChanged'))
      navigate('/')
      return true
    }

    const successMessage = response?.message || response?.result || 'Đăng nhập thành công!'
    setError(successMessage)
    return true
  }

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
    setLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password, formData.rememberMe)
      handleAuthResponse(response)
    } catch (err) {
      // Xử lý lỗi từ API - hiển thị message chi tiết từ server
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'
      
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

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setError('')
      
      try {
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        if (!profileResponse.ok) {
          throw new Error('Không lấy được thông tin người dùng từ Google.')
        }

        const profile = await profileResponse.json()
        const fullName =
          profile.name ||
          `${profile.given_name || ''} ${profile.family_name || ''}`.trim() ||
          'Google User'

        if (!profile.email) {
          throw new Error('Google không trả về email. Không thể đăng nhập.')
        }

        const response = await authAPI.loginWithGoogle({
          email: profile.email,
          fullName,
          rememberMe: formData.rememberMe,
        })

        handleAuthResponse(response, {
          email: profile.email,
          fullName,
          name: profile.name,
          avatar: profile.picture,
        })
      } catch (err) {
        setError(
          err.message || 
          err.error || 
          'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
        )
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.')
      setGoogleLoading(false)
    },
  })

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        </div>
        <h1 className="auth-title">Đăng Nhập</h1>
        <p className="auth-subtitle">Chào mừng bạn trở lại!</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              disabled={loading}
            />
            <label htmlFor="rememberMe" style={{ margin: 0, cursor: 'pointer' }}>
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || googleLoading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="google-button"
          disabled={loading || googleLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
        </button>

        <p className="auth-footer">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="auth-link">
            Đăng ký ngay
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

export default Login

