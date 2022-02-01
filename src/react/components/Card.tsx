import React, { FC, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

const Card: FC<CardProps> = ({ children, className }: CardProps) => (
  <div className={`p-7 bg-zinc-50 shadow rounded-lg dark:bg-zinc-800 ${className ?? ''}`}>
    {children}
  </div>
);

export default Card;
