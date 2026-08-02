import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'buttonPrimary' : 'buttonSecondary';
  return <button className={`button ${variantClass} ${className}`} {...rest} />;
}
