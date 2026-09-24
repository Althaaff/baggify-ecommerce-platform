import { useState } from "react";
import { State } from "country-state-city";

const useCountryStates = () => {
  const [states, setStates] = useState([]);

  const fetchStates = (countryCode) => {
    if (!countryCode) return;

    const result = State.getStatesOfCountry(countryCode).map((st) => ({
      name: st.name,
      code: st.isoCode,
    }));

    setStates(result);
  };

  return { states, fetchStates };
};

export default useCountryStates;
