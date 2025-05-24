import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";
import {DashboardPage} from "../Home/Home";
import SchoolsPage from "../Schools/Schools";
import ScenarioPage from "../Scenario/Scenario";

import StudentPage from './../Students/Student';
import SettingsPage from "../settings/Settings";

function ContentArea(){

  ;
  
  return (
    <main className="absolute top-16 left-64 right-0 bottom-0 overflow-y-auto bg-gray-100">
      <Routes>
        <Route path="/" element ={<DashboardPage/>}/>
        <Route path="/schools/*" element ={<SchoolsPage/>}/>
        <Route path="/scenario/*" element={<ScenarioPage/>}/>
        <Route path="/students/*" element={<StudentPage/>}/>
        <Route path ="/settings/*" element={<SettingsPage/>}/>
      </Routes>
      
    </main>
  );

} 

export default ContentArea;
