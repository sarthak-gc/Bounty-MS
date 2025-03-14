import { jwtDecode, JwtPayload } from "jwt-decode";

interface decodedValueI extends JwtPayload {
  id: string;
  role: string;
}

export const isTeacherAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");

  function getCookie(name: string): string | null {
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

  if (!token || !tokenCookie) return false;

  try {
    const decodedToken = jwtDecode<decodedValueI>(token);
    const decodedCookieToken = jwtDecode<decodedValueI>(tokenCookie);

    if (
      decodedToken.id === decodedCookieToken.id &&
      decodedToken.role === "teacher" &&
      decodedCookieToken.role === "teacher"
    ) {
      return true;
    }
  } catch (e) {
    console.error("Error decoding token", e);
    return false;
  }

  return false;
};

export const isStudentAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");

  function getCookie(name: string): string | null {
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

  if (!token || !tokenCookie) return false;

  try {
    const decodedToken = jwtDecode<decodedValueI>(token);
    const decodedCookieToken = jwtDecode<decodedValueI>(tokenCookie);

    if (
      decodedToken.id === decodedCookieToken.id &&
      decodedToken.role === "student" &&
      decodedCookieToken.role === "student"
    ) {
      return true;
    }
  } catch (e) {
    console.error("Error decoding token", e);
    return false;
  }

  return false;
};
