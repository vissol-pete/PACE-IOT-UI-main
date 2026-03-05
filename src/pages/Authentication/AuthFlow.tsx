import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { router } from "../../features";
import { RouterProvider } from "react-router-dom";
import { setUserEmail, setUserRole } from "../../redux/Slice/Authentication/AuthenticationSlice";
import InactivityTracker from "../../utils/InactivityTracker";

export default function AuthFlow() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Inject a fake "God Mode" session into Redux so the UI components 
    // don't crash when they try to check if you have permission to view them.
    dispatch(setUserRole("SuperAdmin")); 
    dispatch(setUserEmail("poctest@example.com"));
  }, [dispatch]);

  // Force the app to load the main dashboard router, completely ignoring Cognito!
  return (
    <>
      <InactivityTracker />
      <RouterProvider router={router} />
    </>
  );
}