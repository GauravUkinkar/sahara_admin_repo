import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute(Component) {
  return function AuthWrapper(props) {
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (!loggedIn) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setIsAuth(true);
      }
    }, [router]);

    if (!isAuth) return null; // Prevent flickering

    return <Component {...props} />;
  };
}
