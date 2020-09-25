import React, { useState, useEffect } from "react";
import axios from "axios";
import { GlobalStyles } from "twin.macro";

import IncidentMap from "./IncidentMap";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      // try {
      //   const result = await axios("/api/incidents");
      //
      //   setData(result.data);
      // } catch (error) {
      //   setIsError(true);
      // }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isError && (
        <div
          tw="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-75"
          style={{ zIndex: 1001 }}
        >
          <div tw="bg-white border py-2 px-5 rounded-lg flex items-center flex-col text-center">
            <i tw="text-red-600" className="fas fa-times fa-3x"></i>
            <div tw="text-xs text-gray-700 font-light mt-2 text-center">
              <span tw="block font-bold">Error</span>
              Try again later
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div
          tw="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-75"
          style={{ zIndex: 1001 }}
        >
          <div tw="bg-white border py-2 px-5 rounded-lg flex items-center flex-col text-center">
            <i
              tw="text-orange-600"
              className="fas fa-circle-notch fa-spin fa-3x"
            ></i>
            <div tw="text-xs text-gray-700 font-light mt-2 text-center">
              Please wait...
            </div>
          </div>
        </div>
      )}
      <div tw="font-sans flex flex-col min-h-screen w-full">
        <div tw="bg-orange-600 flex-none">
          <div tw="px-4">
            <div tw="flex items-center justify-between py-4">
              <div tw="w-1/2 md:w-auto text-white text-xl font-bold">
                cville fire today
              </div>
            </div>
          </div>
        </div>
        <IncidentMap incidents={data} />
      </div>
    </>
  );
}

export default App;
