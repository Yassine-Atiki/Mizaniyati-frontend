import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Choisir',
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  useEffect(() => {
    if (!open) return undefined

    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  const handleSelect = (nextValue) => {
    onChange?.(nextValue)
    setOpen(false)
  }

  return (
    <div className={clsx('select-control', className)} ref={rootRef}>
      <button
        type="button"
        className={clsx('select-trigger', open && 'open')}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={clsx('select-value', !selected && 'placeholder')}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} className="select-chevron" />
      </button>

      {open && (
        <div className="select-menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              className={clsx('select-option', value === option.value && 'active')}
              onClick={() => handleSelect(option.value)}
              disabled={option.disabled}
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
