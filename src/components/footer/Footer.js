import React from "react";
import headerF from "./HeaderF.module.css";


export default function Footer() {
  return (
    <>
      <footer>
    
        <div className="footerContainer">
          
            <p>Todos los derechos reservados @2021</p>

          <div className="socialNetworksContainer">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-youtube"></i>
            <i className="fab fa-instagram"></i>
            
          </div>
        </div>
      </footer>
    </>
  );
}