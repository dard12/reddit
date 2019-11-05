import ReactSelect from 'react-select';
import React from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
  onChange: Function;
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
}

export function Select(props: SelectProps & any) {
  const { ...passedProps } = props;

  const dark1 = 'hsl(230, 35%, 98%)';
  const dark2 = 'hsl(230, 35%, 95%)';
  const dark6 = 'hsl(230, 10%, 50%)';
  const dark8 = 'hsl(230, 10%, 30%)';
  const primary1 = 'hsl(170, 85%, 95%)';
  const primary5 = 'hsl(170, 85%, 75%)';
  const white = '#ffffff';

  return (
    <ReactSelect
      styles={{
        control: provided => ({
          ...provided,
          borderRadius: 0,
          border: 'none',
          backgroundColor: dark2,
          boxShadow: 'none',
          ':focus': { border: `1px solid ${primary5}` },
        }),
        dropdownIndicator: provided => ({
          ...provided,
          color: dark8,
        }),
        indicatorSeparator: provided => ({
          ...provided,
          display: 'none',
        }),
        option: (provided, { isFocused }) => ({
          ...provided,
          backgroundColor: isFocused ? dark1 : white,
        }),
        menu: provided => ({
          ...provided,
          borderRadius: 0,
          backgroundColor: white,
          border: `1px solid ${dark2}`,
          boxShadow: 'none',
        }),
        multiValue: provided => ({
          ...provided,
          backgroundColor: white,
        }),
        placeholder: provided => ({
          ...provided,
          color: dark6,
        }),
      }}
      {...passedProps}
    />
  );
}
