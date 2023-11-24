import React from "react";

export type RowCheckboxProps = {
  onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"]
  checked: boolean;
};

export const RowCheckbox: React.FC<RowCheckboxProps> = (props) => {
  const { onChange, checked } = props;

  return (
    <input
      checked={checked}
      onChange={onChange}
      type="checkbox"
    />
  );
};

export default RowCheckbox;
