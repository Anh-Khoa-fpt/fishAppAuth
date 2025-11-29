import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = {
  items: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ONE': {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (!existing) return state
      if (existing.quantity === 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }
    }
    case 'REMOVE_ALL_OF_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (defaultState) => {
      try {
        const saved = localStorage.getItem('cart')
        return saved ? JSON.parse(saved) : defaultState
      } catch {
        return defaultState
      }
    }
  )

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  // Tự động xóa giỏ hàng khi đăng xuất (token bị xóa)
  useEffect(() => {
    // Lắng nghe sự kiện storage để xóa giỏ hàng khi đăng xuất từ tab khác
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue && e.oldValue) {
        // Token bị xóa (có oldValue nghĩa là trước đó có token, tức là đăng xuất)
        // Chỉ xóa giỏ hàng khi đăng xuất, không xóa khi chưa đăng nhập từ đầu
        if (state.items.length > 0) {
          dispatch({ type: 'CLEAR' })
        }
      }
    }

    // Lắng nghe custom event khi đăng xuất
    const handleLogout = () => {
      if (state.items.length > 0) {
        dispatch({ type: 'CLEAR' })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleLogout)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleLogout)
    }
  }, [state.items.length])

  const addToCart = (product) => {
    // Bắn event để header hoặc các component khác có thể bắt hiệu ứng
    window.dispatchEvent(new Event('cart:add'))

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        // lưu giá dạng số cho dễ tính tổng
        price: product.numericPrice ?? product.priceValue ?? 0,
        displayPrice: product.price,
      },
    })
  }

  const removeOne = (id) =>
    dispatch({ type: 'REMOVE_ONE', payload: { id } })

  const removeItemCompletely = (id) =>
    dispatch({ type: 'REMOVE_ALL_OF_ITEM', payload: { id } })

  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [state.items]
  )

  const totalCount = useMemo(
    () =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  )

  const value = {
    items: state.items,
    addToCart,
    removeOne,
    removeItemCompletely,
    clearCart,
    totalPrice,
    totalCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return ctx
}


