import axios from 'axios'

const API_BASE_URL = 'https://api.metrohcmc.xyz'

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor để xử lý response và lỗi
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  // Đăng nhập
  // Theo Swagger: POST /api/Auth/sign-in với { email, password, rememberMe }
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/api/Auth/sign-in', {
        email,
        password,
        rememberMe,
      })
      return {
        ...response.data,
        httpStatus: response.status,
      }
    } catch (error) {
      // Trả về cả error response để xử lý tốt hơn
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },


  signup: async (userData) => {
    try {
      // Endpoint mặc định - cần kiểm tra và cập nhật theo Swagger
      // Nếu vẫn lỗi 404, hãy kiểm tra Swagger và cập nhật endpoint ở đây
      const response = await api.post('/api/Auth/customer/register', userData)
      return {
        ...response.data,
        httpStatus: response.status, // Thêm HTTP status để xử lý
      }
    } catch (error) {
      // Trả về cả error response để xử lý tốt hơn
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Đăng nhập bằng Google theo Swagger: POST /api/Auth/sign-in-by-google
  loginWithGoogle: async ({ email, fullName, rememberMe = true }) => {
    try {
      const response = await api.post('/api/Auth/sign-in-by-google', {
        email,
        fullName,
        rememberMe,
      })
      return {
        ...response.data,
        httpStatus: response.status,
      }
    } catch (error) {
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },

  // Đăng xuất
  // Theo Swagger: POST /api/Auth/logout (không có parameters)
  logout: async () => {
    try {
      // Gọi API logout
      await api.post('/api/Auth/logout')
      // Xóa token và user khỏi localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      // Dù API có lỗi, vẫn xóa token và user ở local
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Trả về error nếu cần
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },
}

export default api

