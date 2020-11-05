import React from "react";
import "twin.macro";

function Modal(props) {
  return (
    <div
      tw="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-75"
      style={{ zIndex: 1001 }}
    >
      <div tw="bg-white border py-2 px-5 rounded-lg flex items-center flex-col text-center">
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
