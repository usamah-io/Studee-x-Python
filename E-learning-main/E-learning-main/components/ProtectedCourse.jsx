"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ProtectedCourse component wraps a course card component.
 * If the user is not logged in, they are redirected to /login with a redirectTo parameter.
 * Otherwise, it executes the click handler or redirects directly to the course detail.
 */
export default function ProtectedCourse({ subjectId, children, onClick }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);
  }, []);

  const handleAuthCheck = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const logged = localStorage.getItem("isLoggedIn") === "true";
    if (!logged) {
      router.push(`/login?redirectTo=/lesson/${subjectId}`);
    } else {
      if (onClick) {
        onClick(e);
      } else {
        router.push(`/lesson/${subjectId}`);
      }
    }
  };

  try {
    const child = React.Children.only(children);
    return React.cloneElement(child, {
      onClick: handleAuthCheck,
    });
  } catch (error) {
    // Fallback wrapper div in case multiple children or invalid element passed
    return (
      <div onClick={handleAuthCheck} className="contents cursor-pointer">
        {children}
      </div>
    );
  }
}
