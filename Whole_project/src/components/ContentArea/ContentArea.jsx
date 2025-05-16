import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";
import {DashboardPage} from "../Home/Home";
import SchoolPage from "../Schools/Schools";

function ContentArea(){

  ;
  
  return (
    <main className="absolute top-16 left-64 right-0 bottom-0 overflow-y-auto bg-gray-100">
      <Routes>
        <Route path="/" element ={<DashboardPage/>}/>
        <Route path="/schools/*" element ={<SchoolPage/>}/>
      </Routes>
      
    </main>
  );

} 

export default ContentArea;
