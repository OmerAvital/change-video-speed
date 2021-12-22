import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

function Button({
  children, className, type, ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`px-[2em] py-[.5em] bg-white shadow rounded bg-zinc-50 hover:bg-yellow-50 focus:outline-yellow-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
};

export default Button;
