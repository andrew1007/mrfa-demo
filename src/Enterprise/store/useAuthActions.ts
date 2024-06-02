import { useDispatch } from ".";
import { login } from "../Api";
import { Route } from "./types";

type Credentials = {
  password: string;
  userName: string;
};

const useAuthActions = () => {
  const dispatch = useDispatch();

  const loginUser = async (credentials: Credentials) => {
    const { password, userName } = credentials;
    const res = await login({ password, userName });
    dispatch(({ user }) => {
      const { publicId, userName } = res.data;
      return {
        user: {
          ...user,
          userId: publicId,
          userName,
        },
        currentRoute: Route.playlist,
      };
    });
  };

  return {
    loginUser,
  };
};

export default useAuthActions;
