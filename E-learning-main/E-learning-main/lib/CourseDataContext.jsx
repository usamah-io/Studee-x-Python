"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CourseDataContext = createContext(undefined);

export function CourseDataProvider({ children }) {
  const [courseData, setCourseData] = useState([]);
  const [statsData, setStatsData] = useState({
    totalStudyTime: 185,
    streakCount: 5,
    lastStudyDate: "2026-07-01",
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let emailParam = "";
      if (typeof window !== "undefined") {
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
          emailParam = `?email=${encodeURIComponent(savedEmail)}`;
        }
      }

      const res = await fetch(`/api/user-dashboard${emailParam}`);
      const data = await res.json();
      if (data && !data.error) {
        // Merge with localStorage overrides if present
        const savedProgress = localStorage.getItem("studee_course_progress");
        let progressMap = {};
        if (savedProgress) {
          progressMap = JSON.parse(savedProgress);
        }

        const mergedCourses = (data.courseList || []).map((course) => {
          if (progressMap[course.id] !== undefined) {
            return { ...course, progress: progressMap[course.id] };
          }
          return course;
        });

        setCourseData(mergedCourses);
        setStatsData(data.stats || {
          totalStudyTime: 185,
          streakCount: 5,
          lastStudyDate: "2026-07-01",
        });
      }
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateCourseProgress = (courseId, newProgress) => {
    // Update state
    setCourseData((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return { ...course, progress: newProgress };
        }
        return course;
      })
    );

    // Persist locally
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem("studee_course_progress");
      let progressMap = {};
      if (savedProgress) {
        progressMap = JSON.parse(savedProgress);
      }
      progressMap[courseId] = newProgress;
      localStorage.setItem("studee_course_progress", JSON.stringify(progressMap));
    }
  };

  return (
    <CourseDataContext.Provider
      value={{
        courseData,
        statsData,
        loading,
        updateCourseProgress,
        refreshData: fetchData,
      }}
    >
      {children}
    </CourseDataContext.Provider>
  );
}

export function useCourseData() {
  const context = useContext(CourseDataContext);
  if (!context) {
    throw new Error("useCourseData must be used within a CourseDataProvider");
  }
  return context;
}
