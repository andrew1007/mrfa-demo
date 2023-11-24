import React, { ChangeEventHandler } from "react";
import { applyState, State, useDispatch } from "./StateManager";

type SearchBarStateProps = ReturnType<ReturnType<typeof mappedState>>;
type SearchBarComponent = React.FunctionComponent<SearchBarStateProps>;
type HandleTextUpdate = ChangeEventHandler<HTMLInputElement>;

const SearchBar: SearchBarComponent = (props) => {
  const { text } = props;
  const dispatch = useDispatch();

  const handleTextUpdate: HandleTextUpdate = (e) => {
    const text = e.currentTarget.value
    dispatch(() => ({
      searchText: text || "",
    }));
  };

  return <input value={text} onChange={handleTextUpdate} />;
};

const mappedState = () => (state: State) => ({
  text: state.searchText,
});

export default applyState(mappedState)(SearchBar);
