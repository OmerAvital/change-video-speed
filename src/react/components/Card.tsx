import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
}

function Card({ children, className }: CardProps): React.ReactElement {
  return (
    <div className={`bg-zinc-50 p-7 shadow rounded-lg dark:bg-zinc-800 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
