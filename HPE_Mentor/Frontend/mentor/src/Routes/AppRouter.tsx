import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function AppRouter() {
  const user = useSelector((state: RootState) => state.accessControl);

  return (
    <>
      {user.role === "ADMIN" ? (
       <AdminRoutes />
      ) : (
        <UserRoutes />
      )}
    </>
  );
 
}

export default AppRouter;
