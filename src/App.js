import React, { useState, useEffect } from "react";
import "twin.macro";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faTimes } from "@fortawesome/free-solid-svg-icons";

import IncidentMap from "./IncidentMap";
import Modal from "./Modal";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      const rows = document.querySelectorAll(
        "body > center > table:nth-child(3) > tbody > tr > td > table > tbody > tr"
      );

      const data = Array.from(rows)
        .slice(1, -1)
        .filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.children[1].textContent === v.children[1].textContent
            ) === i
        )
        .filter(
          (v, i, a) =>
            a.findIndex(
              (t) =>
                t.children[3].textContent === v.children[3].textContent &&
                t.children[4].textContent === v.children[4].textContent
            ) === i
        )
        .map((row) => {
          const cells = row.querySelectorAll("td");
          return Array.from(cells).reduce(
            (accumulator, currentValue, index) => {
              return {
                ...accumulator,
                [index]: currentValue.textContent.trim(),
              };
            },
            {}
          );
        });

      try {
        const result = await axios.post(process.env.REACT_APP_GEOLOCATION_API, {
          incidents: data,
        });

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <td colSpan={4} tw="relative">
      {isError && (
        <Modal>
          <FontAwesomeIcon tw="text-red-600" icon={faTimes} size="3x" />
          <div tw="text-xs text-gray-700 font-light mt-2 text-center">
            <span tw="block font-bold">Error</span>
            Try again later
          </div>
        </Modal>
      )}
      {isLoading && (
        <Modal>
          <FontAwesomeIcon
            tw="text-orange-600"
            icon={faCircleNotch}
            size="3x"
            spin
          />
          <div tw="text-xs text-gray-700 font-light mt-2 text-center">
            Please wait...
          </div>
        </Modal>
      )}
      <IncidentMap incidents={data} />
    </td>
  );
}

export default App;
