import React from "react";
import { heavy } from "../resources/utils";

type RowCheckboxProps = {
  onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"]
  checked: boolean;
};

const RowCheckbox: React.FC<RowCheckboxProps> = (props) => {
  const { onChange, checked } = props;
  heavy()
  return (
    <input
      checked={checked}
      onChange={onChange}
      type="checkbox"
    />
  );
};

export default RowCheckbox;
