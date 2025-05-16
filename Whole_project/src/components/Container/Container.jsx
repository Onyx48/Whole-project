import React, { useState } from "react";
import { ContentArea, Sidebar, Header } from "../index";

function Container() {
  return (
    <div >
      <Header/>
      <Sidebar/>
      <ContentArea/>
    </div>
  )
}

export default Container;
