// import { useState, useEffect } from "react";
// import { Country, State } from "country-state-city";

// export default function useCountryCodes() {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     try {
//       const allCountries = Country.getAllCountries().map((country) => ({
//         label: country.name,
//         value: country.isoCode,
//         flag: country.flag || "",
//         phoneCode: country.phonecode,
//         name: country.name,
//         isoCode: country.isoCode,
//       }));

//       setCountries(allCountries);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to load countries:", err);
//       setError("Failed to load countries");
//       setLoading(false);
//     }
//   }, []);

//   return { countries, loading, error };
// }

import { useState, useEffect } from "react";
import { Country } from "country-state-city";

const useCountryCodes = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const all = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
      flag: country.flag,
    }));

    setCountries(all);
  }, []);

  return { countries };
};

export default useCountryCodes;
