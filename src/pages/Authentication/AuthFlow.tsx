import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useDispatch } from "react-redux";
import { authRouter } from "../../features/Routes/authRouter";
import { router } from "../../features";
import { RouterProvider } from "react-router-dom";
import { setUserEmail, setUserRole } from "../../redux/Slice/Authentication/AuthenticationSlice";
import InactivityTracker from "../../utils/InactivityTracker";

export default function AuthFlow() {
  // const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);

  // console.log("user", user);
  // console.log("test authStatus", authStatus);

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const fetchUserAttributesData = async () => {
    try {
      const attributes = await fetchUserAttributes();
      dispatch(setUserRole(attributes["custom:role_id"]));
      dispatch(setUserEmail(attributes?.email));

      handleLogin();
      // console.log("checkAttributeVerification", attributes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "loggedIn") {
        if (event.newValue === "false") {
          console.log("User logged out from another tab.");
          signOut();
        }
        if (event.newValue === "true") {
          console.log("User logged in from another tab");
          handleRefresh();
        }
      }
    };

    // Set up the event listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  async function currentSession() {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      // console.log("accessToken", accessToken?.toString());
      console.log("idToken", idToken?.toString());
      if (idToken) {
        setToken(idToken.toString());
        axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchUserAttributesData();
      currentSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  if (authStatus === "authenticated" && token) {
    return (
      <>
        <InactivityTracker />
        <RouterProvider router={router} />
      </>
    );
  } else {
    return <RouterProvider router={authRouter} />;
  }
}
