import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Tutorials from "../components/main/AdminPages/Tutorials/Tutorials";
import AssessmentPage from "../components/main/UserPages/AssessmentPage";
import MainContent from "../components/main/UserPages/MainContent";
import UserContent from "../components/main/UserPages/UserContent";
import NoPage from "../components/NoPage";
import AttemptQuiz from "../components/main/UserPages/AttemptQuiz";
import { Grommet } from "grommet";
import { hpe } from "grommet-theme-hpe";

function UserRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/technologies/:techid" element={<Tutorials />}></Route>
          <Route
            path="/HPEMentor/tutorial/:techid"
            element={<UserContent />}
          ></Route>

          <Route
            path="/HPEMentor/assessment/:assessmentid"
            element={<AssessmentPage />}
          ></Route>
          
          <Route
            path="/HPEMentor/attempt/quiz/:quizid/:quizname"
            element={<AttemptQuiz />}
          ></Route>

          <Route
            path="/attempt/assessment/:assessmentid/:assessmentname"
            element={<AssessmentPage />}
          ></Route>

          <Route path="/*" element={<NoPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default UserRoutes;
