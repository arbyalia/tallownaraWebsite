'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type CartLine = { productId: number; quantity: number }

const KEY = 'tallownara-keranjang'
const EMPTY: CartLine[] = []
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedLines: CartLine[] = EMPTY

function getSnapshot(): CartLine[] {
  const raw = window.localStorage.getItem(KEY)
  if (raw === cachedRaw) return cachedLines
  cachedRaw = raw
  try {
    cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY
  } catch {
    cachedLines = EMPTY
  }
  return cachedLines
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function write(lines: CartLine[]) {
  if (lines.length === 0) window.localStorage.removeItem(KEY)
  else window.localStorage.setItem(KEY, JSON.stringify(lines))
  listeners.forEach((listener) => listener())
}

export function addToCart(productId: number, quantity: number, maxStock: number) {
  const lines = getSnapshot()
  const existing = lines.find((line) => line.productId === productId)
  const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, maxStock)
  write(
    existing
      ? lines.map((line) => (line.productId === productId ? { ...line, quantity: nextQuantity } : line))
      : [...lines, { productId, quantity: nextQuantity }],
  )
}

export function setCartQuantity(productId: number, quantity: number) {
  write(
    getSnapshot()
      .map((line) => (line.productId === productId ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0),
  )
}

export function removeFromCart(productId: number) {
  write(getSnapshot().filter((line) => line.productId !== productId))
}

export function clearCart() {
  write(EMPTY)
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, useCallback(() => EMPTY, []))
}

const noopSubscribe = () => () => undefined

/** False saat render server, true setelah browser siap membaca keranjang. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
