import React, { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

const Button: FC<ButtonProps> = ({ children, className, ...props }: ButtonProps) => (
  <button
    className={`px-[2em] py-[.5em] bg-white shadow rounded
                focus:outline-yellow-400 hover:bg-yellow-50
                dark:bg-zinc-700 dark:hover:bg-zinc-600 ${className ?? ''}`}
    type="button"
    {...props}
  >
    {children}
  </button>
);

export default Button;
