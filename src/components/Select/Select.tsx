import ReactSelect from 'react-select';
import React from 'react';
import _ from 'lodash';

interface SelectProps {
  options: { value: string; label: string }[];
  onChange: Function;
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
  maxItems?: number;
}

export function Select(props: SelectProps & any) {
  const { maxItems, onChange, ...passedProps } = props;

  const dark1 = 'hsl(230, 35%, 98%)';
  const dark2 = 'hsl(230, 35%, 95%)';
  const dark3 = 'hsl(230, 35%, 90%)';
  const dark4 = 'hsl(230, 35%, 85%)';
  const dark6 = 'hsl(230, 10%, 50%)';
  const dark8 = 'hsl(230, 10%, 30%)';
  const white = '#ffffff';

  return (
    <ReactSelect
      isClearable={false}
      maxMenuHeight={150}
      menuPortalTarget={document.body}
      styles={{
        control: (provided, { isFocused }) => ({
          ...provided,
          borderRadius: 0,
          border: 'none',
          backgroundColor: dark2,
          boxShadow: 'none',
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
          ':active': { backgroundColor: dark1 },
        }),
        menu: provided => ({
          ...provided,
          borderRadius: 0,
          backgroundColor: white,
          border: `1px solid ${dark3}`,
          boxShadow: 'none',
        }),
        multiValue: provided => ({
          ...provided,
          backgroundColor: dark4,
        }),
        multiValueRemove: provided => ({
          ...provided,
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'transparent',
          },
        }),
        placeholder: provided => ({
          ...provided,
          color: dark6,
        }),
      }}
      onChange={selection => {
        if (!maxItems || _.size(selection) <= maxItems) {
          onChange(selection);
        }
      }}
      {...passedProps}
    />
  );
}
