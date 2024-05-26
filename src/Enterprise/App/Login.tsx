import React, { memo, useState } from "react";
import useAuthActions from "../state/useAuthActions";
import HeavyUselessUI from "./Shared/HeavyUselessUI";

type FieldUpdate = React.ChangeEventHandler<HTMLInputElement>;

const Login = () => {
  const { loginUser } = useAuthActions();
  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  const handleUpdate =
    (field: keyof typeof credentials): FieldUpdate =>
    (e) => {
      const text = e.currentTarget.value;
      setCredentials((prev) => ({
        ...prev,
        [field]: text,
      }));
    };

  const submit = () => {
    const { password, userName } = credentials;
    loginUser({ password, userName });
  };

  return (
    <div className="login-root">
      <HeavyUselessUI />
      <input onChange={handleUpdate("userName")} />
      <input onChange={handleUpdate("password")} />
      <button onClick={submit}>login</button>
    </div>
  );
};

export default memo(Login);
