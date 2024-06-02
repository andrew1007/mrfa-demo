import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "../../state";
import { debounce } from "lodash";
import { State } from "../../state/types";
import HeavyUselessUI from "./HeavyUselessUI";

type SearchBarProps = {
  field: keyof State["search"];
  placeholder: string;
};

const SearchBar = (props: SearchBarProps) => {
  const dispatch = useDispatch();
  const { field, placeholder } = props;
  const [value, setValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
