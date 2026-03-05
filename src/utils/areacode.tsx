import { parsePhoneNumberFromString, getCountryCallingCode, getCountries, isSupportedCountry } from "libphonenumber-js";

// Generate a map of all supported countries with their calling codes
export const getAllCallingCodes = () => {
  const supportedCountries = [
    "US",
    "GB",
    "AU",
    "FR",
    "DE",
    "IN" /*...*/, // Add all supported country codes here, or fetch dynamically
  ];

  const callingCodes = supportedCountries
    .map((countryCode) => {
      if (isSupportedCountry(countryCode)) {
        return { country: countryCode, callingCode: getCountryCallingCode(countryCode) };
      }
      return null;
    })
    .filter(Boolean); // Remove any null entries in case of unsupported countries

  return callingCodes;
};

// Generate a list of unique calling codes
export const getUniqueCallingCodes = () => {
  const supportedCountries = [
    "US",
    "CA",
    "GB",
    "AU",
    "FR",
    "DE",
    "IN" /*...*/, // Add all supported country codes here
  ];

  // Create a Set to store unique calling codes
  const callingCodesSet = new Set();

  supportedCountries.forEach((countryCode) => {
    if (isSupportedCountry(countryCode)) {
      callingCodesSet.add(getCountryCallingCode(countryCode));
    }
  });

  // Convert the Set to an array for easy use
  return Array.from(callingCodesSet);
};

export const validatePhoneNumber = (phoneNumber: string, countryCode: any) => {
  // Parse the phone number with the given country code
  const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);

  // Check if the parsed number is valid
  return parsedNumber ? parsedNumber.isValid() : false;
};

export interface Country {
  code: string;
  label: string;
}

export const getCountryCodes = (): Country[] => {
  const countries = [...getCountries()]; // Spread into array

  return countries.map((countryCode) => ({
    code: `+${getCountryCallingCode(countryCode)}`,
    label: countryCode as string,
  }));
};

export const formatElectricDemand = (number: number) => {
  // Helper function to truncate a number to one decimal place
  function truncateToDecimal(num: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.trunc(num * factor) / factor;
  }
  // If number is less than 1000, return it formatted to one decimal place if needed
  if (number < 1000) {
    return number % 1 === 0 ? number.toString() : truncateToDecimal(number, 1).toString(); // No decimal if it's an integer
  }

  // Format the number with 1 decimal place if it's in the thousands, millions, or billions range
  if (number >= 1000000000) {
    return `${truncateToDecimal(number / 1000000000, 1)}B`;
  } else if (number >= 1000000) {
    return `${truncateToDecimal(number / 1000000, 1)}M`;
  } else {
    return `${truncateToDecimal(number / 1000, 1)}K`;
  }
};
