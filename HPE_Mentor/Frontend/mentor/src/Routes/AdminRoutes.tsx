import { Test } from "grommet-icons";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "../components/NoPage";
import Navbar from "../components/header/Navbar";
import EditQuiz from "../components/main/AdminPages/EditQuiz";
import Profile from "../components/main/AdminPages/Profile";
import Technologies from "../components/main/AdminPages/Technologies";
import Trainees from "../components/main/AdminPages/Trainees";
import Tutorials from "../components/main/AdminPages/Tutorials/Tutorials";
import AssessmentPage from "../components/main/UserPages/AssessmentPage";
import MainContent from "../components/main/UserPages/MainContent";
import UserContent from "../components/main/UserPages/UserContent";
import EditAssessment from "../components/main/AdminPages/EditAssessment";
import Dashboard from "../components/main/AdminPages/Dashboard";
import { Grommet } from "grommet";
import { hpe } from "grommet-theme-hpe";


function AdminRoutes() {
  return (
    <Grommet theme={hpe}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/technologies" element={<Technologies />}></Route>
          <Route path="/trainees" element={<Trainees />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/*" element={<NoPage />}></Route>
        </Route>
        <Route path="/technologies/:techid" element={<Tutorials />}></Route>
        <Route
          path="/technologies/quiz/create/:techid/:quizid/:quizname"
          element={<EditQuiz />}
        ></Route>
        <Route
          path="/technologies/assessment/create/:techid/:assessmentid/:assessmentname"
          element={<EditAssessment />}
        ></Route>
        <Route path="/HPEMentor" element={<MainContent />} />
        <Route
          path="/HPEMentor/tutorial/:tutid"
          element={<UserContent />}
        ></Route>
        <Route
          path="/HPEMentor/assessment/:assessmentid"
          element={<AssessmentPage />}
        ></Route>
      </Routes>
    </BrowserRouter>
    </Grommet>
  );
}

export default AdminRoutes;
