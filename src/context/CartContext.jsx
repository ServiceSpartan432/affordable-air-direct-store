import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'aad_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) =>
    setItems((prev) => {
      // one system per cart line; replace if same sku
      const without = prev.filter((i) => i.sku !== item.sku)
      return [...without, { ...item, qty: 1 }]
    })
  const removeItem = (sku) => setItems((prev) => prev.filter((i) => i.sku !== sku))
  const clear = () => setItems([])

  const count = items.length
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * (i.qty || 1), 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
