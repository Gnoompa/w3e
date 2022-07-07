import { MouseEventHandler, useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function handleOnMouseDown(event: React.MouseEvent<HTMLElement>, cb: CallableFunction): void {
  event.button == 0 && cb()
}

export function formatWalletAddress(address: string): string {
  return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : ''
}
