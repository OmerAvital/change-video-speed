import React, { FC } from 'react';

export interface NumberInputProps {
  name: string;
  id: string;
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;

  onChange?(newValue: number): void;
  onBlur?(value: number): void;
}

const NumberInput: FC<NumberInputProps> = ({
  name, id, label, value, min, max, className, labelClassName, containerClassName, onChange, onBlur,
}: NumberInputProps) => (
  <div className={`flex flex-col items-center ${containerClassName ?? ''}`}>
    <label htmlFor={id} className={`text-base ${labelClassName ?? ''}`}>{label || name}</label>
    <input
      type="number"
      name={name}
      id={id}
      value={value}
      className={`mt-1 w-20 h-8 text-sm border-none rounded shadow text-center spin-button-none
                  focus:ring-0 focus:outline-yellow-400 focus:outline-offset-0 dark:bg-zinc-700 ${className ?? ''}`}
      onChange={ev => onChange && onChange(ev.target.valueAsNumber)}
      onBlur={ev => onBlur && onBlur(ev.target.valueAsNumber)}
      onInvalid={e => e.preventDefault()}
      step={0.1}
      min={min}
      max={max}
    />
  </div>
);

export default NumberInput;
