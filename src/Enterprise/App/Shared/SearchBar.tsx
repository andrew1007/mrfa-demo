import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "../../state";
import { debounce } from "lodash";
import { State } from "../../state/types";
import HeavyUselessUI from "./HeavyUselessUI";

type ParentProps = {
  field: keyof State["search"];
  placeholder: string;
};
type Component = React.FunctionComponent<ParentProps>;

const SearchBar: Component = (props) => {
  const dispatch = useDispatch();
  const { field, placeholder } = props;
  const [value, setValue] = useState("");

  const updateStateValue = useCallback(
    debounce((value: string) => {
      dispatch(({ search }) => ({
        search: {
          ...search,
          [field]: value,
        },
      }));
    }, 200),
    []
  );

  useEffect(() => {
    updateStateValue(value);
  }, [value]);

  const handleChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = (e) => {
    setValue(e.currentTarget.value);
  };

  return (
    <>
      <input value={value} onChange={handleChange} placeholder={placeholder} />
      <HeavyUselessUI />
    </>
  );
};

export default React.memo(SearchBar);
