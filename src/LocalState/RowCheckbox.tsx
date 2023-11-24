import React from "react";

type RowCheckboxProps = {
  onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"]
  checked: boolean;
};

const RowCheckbox: React.FC<RowCheckboxProps> = (props) => {
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
