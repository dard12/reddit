import React from 'react';
import _ from 'lodash';

const CreatableSelect = require('react-select/creatable').default;

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
    <CreatableSelect
      isClearable={false}
      maxMenuHeight={150}
      menuPortalTarget={document.body}
      styles={{
        control: (provided: any, { isFocused }: any) => ({
          ...provided,
          borderRadius: 0,
          border: 'none',
          backgroundColor: dark2,
          boxShadow: 'none',
        }),
        dropdownIndicator: (provided: any) => ({
          ...provided,
          color: dark8,
        }),
        indicatorSeparator: (provided: any) => ({
          ...provided,
          display: 'none',
        }),
        option: (provided: any, { isFocused }: any) => ({
          ...provided,
          backgroundColor: isFocused ? dark1 : white,
          ':active': { backgroundColor: dark1 },
        }),
        menu: (provided: any) => ({
          ...provided,
          borderRadius: 0,
          backgroundColor: white,
          border: `1px solid ${dark3}`,
          boxShadow: 'none',
        }),
        multiValue: (provided: any) => ({
          ...provided,
          backgroundColor: dark4,
        }),
        multiValueRemove: (provided: any) => ({
          ...provided,
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'transparent',
          },
        }),
        placeholder: (provided: any) => ({
          ...provided,
          color: dark6,
        }),
      }}
      onChange={(selection: any) => {
        if (!maxItems || _.size(selection) <= maxItems) {
          onChange(selection);
        }
      }}
      {...passedProps}
    />
  );
}
