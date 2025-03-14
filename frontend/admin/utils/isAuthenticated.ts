import { jwtDecode, JwtPayload } from "jwt-decode";

interface decodedValueI extends JwtPayload {
  username: string;
  password: string;
}
const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  function getCookie(name: string) {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      const cookie = cookieArr[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  const tokenCookie = getCookie("token");
  if (!token) return false;
  if (!tokenCookie) return false;
  try {
    const decodedToken = jwtDecode(token) as decodedValueI;
    const decodedCookieToken = jwtDecode(tokenCookie) as decodedValueI;

    if (
      decodedToken.username === "admin" &&
      decodedCookieToken.username === "admin" &&
      decodedToken.password === "admin" &&
      decodedCookieToken.password === "admin"
    ) {
      return true;
    }
  } catch (e) {
    console.error("Error decoding token", e);
    return false;
  }
  return true;
};
export default isAuthenticated;
