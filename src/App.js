import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";   // <-- important
import './App.css';


function App() {
  const [rows, setRows] = useState(100);
  const [columns, setColumns] = useState(5);
  const [data, setData] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [selectedType, setSelectedType] = useState('Name');
  const [columnName, setColumnName] = useState('Name');
  const [populationCache, setPopulationCache] = useState({});
  const [realCities, setRealCities] = useState([]);
  const [postalCodeCache, setPostalCodeCache] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // NEW: Size condition
  const [selectedSizeCondition, setSelectedSizeCondition] = useState('');

  // NEW: DOB states (replacing old text range)
  const [selectedDOBFormat, setSelectedDOBFormat] = useState('');
  const [dobFromDate, setDobFromDate] = useState(null);
  const [dobToDate, setDobToDate] = useState(null);
  const [dobDateError, setDobDateError] = useState('');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // -------------- START of replacing code area for DO Pikcer - Nov 21 12:50PM -----------------------------------------------------------------------------


  useEffect(() => {
    setColumnName(selectedType);

    // Reset everything when type changes
    if (selectedType !== 'Size') setSelectedSizeCondition('');
    if (selectedType !== 'DOB') {
      setSelectedDOBFormat('');
      setDobFromDate(null);
      setDobToDate(null);
      setDobDateError('');
    }
  }, [selectedType]);

  // Validate DOB dates
  useEffect(() => {
    if (!dobFromDate && !dobToDate) {
      setDobDateError('');
      return;
    }
    if (dobFromDate && dobToDate && dobFromDate > dobToDate) {
      setDobDateError('From date cannot be after To date');
    } else {
      setDobDateError('');
    }
  }, [dobFromDate, dobToDate]);

  const isGenerateDisabled = () => dobDateError || isLoading;




  // -------------- END of replacing code area for DOB Pikcer  -----------------------------------------------------------------------------

  // NEW: Move column up - START
  const moveColumnUp = (index) => {
    if (index === 0) return;
    setCustomColumns(prev => {
      const newCols = [...prev];
      [newCols[index - 1], newCols[index]] = [newCols[index], newCols[index - 1]];
      return newCols;
    });
  };
  // NEW: Move column up ENDS

  // NEW: Move column down START
  const moveColumnDown = (index) => {
    if (index === customColumns.length - 1) return;
    setCustomColumns(prev => {
      const newCols = [...prev];
      [newCols[index], newCols[index + 1]] = [newCols[index + 1], newCols[index]];
      return newCols;
    });
  };
  // NEW: Move column down ENDS

  // NEW: Update fieldCategories to include new Personal fields
  const fieldCategories = {
    'Personal': ['Name', 'First Name', 'Last Name', 'Gender', 'SSN', 'Shoe Size', 'DOB', 'Salary', 'Height', 'Weight'],
    'Location': ['House Number', 'Building Number', 'Street Name', 'Postal Code', 'City', 'State', 'Country', 'City Population', 'Country Population', 'Longitude', 'Latitude'],
    'Finance': ['Credit Card Number', 'CVV'],
    'Measurements': ['Size', 'Temperature (C)', 'Temperature (F)', 'Inches', 'cms', 'mts', 'KMs', 'Miles', 'Grams', 'Kilograms', 'Cubic Centimeter', 'Litres', 'Milliliters', 'KM/H', 'Miles/H', 'm/s', 'Ampere', 'Voltage', 'Wattage'],
    'Date': ['Day', 'Month', 'Year'],
    'Generic': ['String', 'Numeric', 'Boolean', 'Price', 'ID', 'Lorem Text', 'Company']
  };

  // NEW: DOB formats
  const dobFormats = [
    'dd-mm-yyyy',
    'mm-dd-yyyy',
    'dd-mmm-yyyy',
    'mmm-dd-yyyy'
  ];

  // NEW: Size conditions data
  const sizeConditions = {
    'Cloth Size': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Shoe Size(Adult)': ['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'],
    'Shoe Size(Kids)': ['2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7'],
    'Paper Size': [
      'ISO A - A0: (841x1189mm) (33.1x46.8in)',
      'ISO A - A1: (594x841mm) (23.4x33.1in)',
      'ISO A - A2: (420x594mm) (16.5x23.4in)',
      'ISO A - A3: (297x420mm) (11.7x16.5in)',
      'ISO A - A4: (210x297mm) (8.3x11.7in)',
      'ISO A - A5: (148x210mm) (5.8x8.3in)',
      'ISO A - A6: (105x148mm) (4.1x5.8in)',
      'North American - Letter: (8.5x11in) (216x279mm)',
      'North American - Legal: (8.5x14in) (216x356mm)',
      'North American - Ledger/Tabloid: (11x17in) (279x432mm)',
      'North American - Junior Legal: (5x8in) (127x203mm)',
      'North American - Executive: (7.3x10.5in) (184x267mm)',
      'ISO B - B0: (1000x1414mm) (39.4x55.7in)',
      'ISO B - B1: (707x1000mm) (27.8x39.4in)',
      'ISO B - B2: (500x707mm) (19.7x27.8in)',
      'ISO B - B3: (353x500mm) (13.9x19.7in)',
      'ISO B - B4: (250x353mm) (9.8x13.9in)',
      'Random'
    ],
    'Generic Worded': ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'],
    'Generic abbreviated': ['XS', 'S', 'M', 'L', 'XL']
  };


  // -------------- START of replacing code area for DOB Pikcer  -----------------------------------------------------------------------------


  const generateDOBData = (format, from = null, to = null) => {
    // Default: 80 years ago → 18 years ago
    const defaultFrom = new Date();
    defaultFrom.setFullYear(defaultFrom.getFullYear() - 80);

    const defaultTo = new Date();
    defaultTo.setFullYear(defaultTo.getFullYear() - 18);

    // Use user dates if provided, otherwise fall back to defaults
    const fromDate = from ? new Date(from) : defaultFrom;
    const toDate = to ? new Date(to) : defaultTo;

    // FINAL SAFETY: Always ensure from ≤ to
    const start = fromDate <= toDate ? fromDate : toDate;
    const end = fromDate <= toDate ? toDate : fromDate;

    const randomDate = faker.date.between({ from: start, to: end });

    switch (format) {
      case 'dd-mm-yyyy':
        return randomDate.toLocaleDateString('en-GB');
      case 'mm-dd-yyyy':
        return randomDate.toLocaleDateString('en-US');
      case 'dd-mmm-yyyy':
        return randomDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      case 'mmm-dd-yyyy':
        return randomDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/ /g, '-');
      default:
        return randomDate.toISOString().split('T')[0];
    }
  };

  // -------------- END of replacing code area for DOB Pikcer  -----------------------------------------------------------------------------







  // NEW: Function to generate intelligent salary data
  const generateSalaryData = () => {
    // Generate realistic salary based on normal distribution
    const baseSalary = faker.number.int({ min: 30000, max: 150000 });
    // Format with commas and currency symbol
    return `$${baseSalary.toLocaleString()}`;
  };

  // NEW: Function to generate height data in Feet(cms) format
  const generateHeightData = () => {
    // Generate height in cm (realistic adult range)
    const heightCm = faker.number.int({ min: 150, max: 200 });
    // Convert to feet and inches
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);

    return `${feet}'${inches}" (${heightCm}cm)`;
  };

  // NEW: Function to generate weight data
  const generateWeightData = () => {
    // Generate realistic weight in kg
    const weightKg = faker.number.float({ min: 50, max: 120, fractionDigits: 1 });
    return `${weightKg} kg`;
  };

  // NEW: Function to generate size data based on condition and age
  const generateSizeData = (condition, age = null) => {
    if (!condition) return faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']);

    const sizes = sizeConditions[condition];
    if (!sizes) return faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']);

    // Intelligent age matching for cloth and shoe sizes
    if (age && (condition === 'Cloth Size' || condition === 'Shoe Size(Adult)' || condition === 'Shoe Size(Kids)')) {
      if (condition === 'Cloth Size') {
        // For cloth sizes, age affects the distribution
        if (age < 18) {
          // Teens more likely to get smaller sizes
          const teenSizes = ['XS', 'S', 'M'];
          return faker.helpers.arrayElement(teenSizes);
        } else if (age > 50) {
          // Older adults more likely to get larger sizes
          const adultSizes = ['L', 'XL', 'XXL'];
          return faker.helpers.arrayElement(adultSizes);
        }
        // Adults get normal distribution
        return faker.helpers.arrayElement(sizes);
      }

      if (condition === 'Shoe Size(Adult)') {
        // Adult shoe sizes based on age
        if (age < 18) {
          // Younger adults tend to have smaller feet
          const youngAdultSizes = sizes.slice(0, 8); // 6.5 to 9.5
          return faker.helpers.arrayElement(youngAdultSizes);
        } else if (age > 40) {
          // Older adults might have more varied sizes
          const olderAdultSizes = sizes.slice(4); // 8.5 to 13
          return faker.helpers.arrayElement(olderAdultSizes);
        }
      }

      if (condition === 'Shoe Size(Kids)') {
        // Kids shoe sizes strongly correlated with age
        if (age < 5) {
          const toddlerSizes = sizes.slice(0, 4); // 2.5 to 4
          return faker.helpers.arrayElement(toddlerSizes);
        } else if (age < 8) {
          const youngKidSizes = sizes.slice(2, 6); // 3.5 to 5
          return faker.helpers.arrayElement(youngKidSizes);
        } else if (age < 12) {
          const olderKidSizes = sizes.slice(4, 8); // 4.5 to 6
          return faker.helpers.arrayElement(olderKidSizes);
        } else {
          // Pre-teens
          const preTeenSizes = sizes.slice(6); // 5.5 to 7
          return faker.helpers.arrayElement(preTeenSizes);
        }
      }
    }

    // For Paper Size Random condition
    if (condition === 'Paper Size') {
      const allPaperSizes = sizeConditions['Paper Size'].filter(size => size !== 'Random');
      return faker.helpers.arrayElement(allPaperSizes);
    }

    // Default random selection from available sizes
    return faker.helpers.arrayElement(sizes);
  };

  // Get real postal codes from free APIs
  const getPostalCodeForLocation = async (country, city = null, state = null) => {
    if (!country) {
      return faker.location.zipCode('#####');
    }
    const cacheKey = `postal_${country}_${city || ''}_${state || ''}`;
    if (postalCodeCache[cacheKey]) {
      return postalCodeCache[cacheKey];
    }
    try {
      let postalCode = '';
      if (city) {
        postalCode = await getPostalCodeByCity(city, country);
        if (postalCode) {
          setPostalCodeCache(prev => ({ ...prev, [cacheKey]: postalCode }));
          return postalCode;
        }
      }
      if (state) {
        postalCode = await getPostalCodeByState(state, country);
        if (postalCode) {
          setPostalCodeCache(prev => ({ ...prev, [cacheKey]: postalCode }));
          return postalCode;
        }
      }
      postalCode = await getPostalCodeByCountry(country);
      if (postalCode) {
        setPostalCodeCache(prev => ({ ...prev, [cacheKey]: postalCode }));
        return postalCode;
      }
      postalCode = generateCountryFormatPostalCode(country);
      setPostalCodeCache(prev => ({ ...prev, [cacheKey]: postalCode }));
      return postalCode;
    } catch (error) {
      console.log('Error fetching postal code, using fallback:', error);
      const fallback = generateCountryFormatPostalCode(country);
      setPostalCodeCache(prev => ({ ...prev, [cacheKey]: fallback }));
      return fallback;
    }
  };

  const getPostalCodeByCity = async (city, country) => {
    try {
      const countryCode = getCountryCode(country);
      if (!countryCode) return null;
      const response = await fetch(`https://api.zippopotam.us/${countryCode}/${encodeURIComponent(city)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const randomPlace = data.places[Math.floor(Math.random() * data.places.length)];
        return randomPlace['post code'] || randomPlace['postal code'];
      }
    } catch (error) {
      console.log(`Could not fetch postal codes for city ${city}, ${country}`);
    }
    return null;
  };

  const getPostalCodeByState = async (state, country) => {
    try {
      const countryCode = getCountryCode(country);
      if (!countryCode) return null;
      const stateCode = getStateCode(state, country);
      if (!stateCode) return null;
      const response = await fetch(`https://api.zippopotam.us/${countryCode}/${stateCode}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const randomPlace = data.places[Math.floor(Math.random() * data.places.length)];
        return randomPlace['post code'] || randomPlace['postal code'];
      }
    } catch (error) {
      console.log(`Could not fetch postal codes for state ${state}, ${country}`);
    }
    return null;
  };

  const getPostalCodeByCountry = async (country) => {
    try {
      const countryCode = getCountryCode(country);
      if (!countryCode) return null;
      const majorCities = getMajorCitiesForCountry(country);
      for (const city of majorCities) {
        const postalCode = await getPostalCodeByCity(city, country);
        if (postalCode) return postalCode;
      }
    } catch (error) {
      console.log(`Could not fetch postal codes for country ${country}`);
    }
    return null;
  };

  const getCountryCode = (countryName) => {
    const countryMap = {
      'United States': 'us',
      'United Kingdom': 'gb',
      'Canada': 'ca',
      'Germany': 'de',
      'France': 'fr',
      'Italy': 'it',
      'Spain': 'es',
      'Australia': 'au',
      'Japan': 'jp',
      'India': 'in',
      'Brazil': 'br',
      'China': 'cn',
      'Russia': 'ru',
      'Mexico': 'mx',
      'Netherlands': 'nl',
      'Sweden': 'se',
      'Norway': 'no',
      'Denmark': 'dk',
      'Finland': 'fi',
      'Switzerland': 'ch',
      'Austria': 'at',
      'Belgium': 'be',
      'Portugal': 'pt',
      'Ireland': 'ie',
      'New Zealand': 'nz',
      'South Korea': 'kr',
      'Singapore': 'sg',
    };
    return countryMap[countryName] || null;
  };

  const getStateCode = (stateName, country) => {
    const usStates = {
      'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar', 'california': 'ca',
      'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de', 'florida': 'fl', 'georgia': 'ga',
      'hawaii': 'hi', 'idaho': 'id', 'illinois': 'il', 'indiana': 'in', 'iowa': 'ia',
      'kansas': 'ks', 'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
      'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms', 'missouri': 'mo',
      'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv', 'new hampshire': 'nh', 'new jersey': 'nj',
      'new mexico': 'nm', 'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd', 'ohio': 'oh',
      'oklahota': 'ok', 'oregon': 'or', 'pennsylvania': 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
      'south dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut', 'vermont': 'vt',
      'virginia': 'va', 'washington': 'wa', 'west virginia': 'wv', 'wisconsin': 'wi', 'wyoming': 'wy'
    };
    const canadaProvinces = {
      'alberta': 'ab', 'british columbia': 'bc', 'manitoba': 'mb', 'new brunswick': 'nb',
      'newfoundland and labrador': 'nl', 'nova scotia': 'ns', 'ontario': 'on',
      'prince edward island': 'pe', 'quebec': 'qc', 'saskatchewan': 'sk'
    };
    const stateLower = stateName.toLowerCase();
    if (country === 'United States') {
      return usStates[stateLower] || null;
    } else if (country === 'Canada') {
      return canadaProvinces[stateLower] || null;
    }
    return null;
  };

  const getMajorCitiesForCountry = (country) => {
    const cityMap = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Glasgow'],
      'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
      'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
      'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
      'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
      'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
      'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
      'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
      'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad'],
      'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
      'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
      'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    };
    return cityMap[country] || [];
  };

  const generateCountryFormatPostalCode = (country) => {
    const formats = {
      'United States': () => faker.string.numeric(5),
      'Canada': () => {
        const letter = () => faker.string.alpha(1).toUpperCase();
        const digit = () => faker.string.numeric(1);
        return `${letter()}${digit()}${letter()} ${digit()}${letter()}${digit()}`;
      },
      'United Kingdom': () => {
        const formats = [
          () => `${faker.string.alpha(1).toUpperCase()}${faker.string.numeric(1)} ${faker.string.numeric(1)}${faker.string.alpha(2).toUpperCase()}`,
          () => `${faker.string.alpha(1).toUpperCase()}${faker.string.numeric(1)}${faker.string.alpha(1)} ${faker.string.numeric(1)}${faker.string.alpha(2).toUpperCase()}`,
        ];
        return formats[Math.floor(Math.random() * formats.length)]();
      },
      'Germany': () => faker.string.numeric(5),
      'France': () => faker.string.numeric(5),
      'Italy': () => faker.string.numeric(5),
      'Spain': () => faker.string.numeric(5),
      'Russia': () => faker.string.numeric(6),
      'Japan': () => `${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
      'China': () => faker.string.numeric(6),
      'India': () => faker.string.numeric(6),
      'Australia': () => faker.string.numeric(4),
      'Brazil': () => `${faker.string.numeric(5)}-${faker.string.numeric(3)}`,
      'default': () => faker.string.numeric(5)
    };
    return formats[country] ? formats[country]() : formats['default']();
  };

  const generateMeasurementData = (type) => {
    switch (type) {
      case 'Inches': return `${faker.number.float({ min: 0.5, max: 120, fractionDigits: 2 })} in`;
      case 'cms': return `${faker.number.float({ min: 1, max: 300, fractionDigits: 2 })} cm`;
      case 'mts': return `${faker.number.float({ min: 0.1, max: 100, fractionDigits: 2 })} m`;
      case 'KMs': return `${faker.number.float({ min: 0.1, max: 1000, fractionDigits: 2 })} km`;
      case 'Miles': return `${faker.number.float({ min: 0.1, max: 600, fractionDigits: 2 })} mi`;
      case 'Grams': return `${faker.number.float({ min: 1, max: 5000, fractionDigits: 2 })} g`;
      case 'Kilograms': return `${faker.number.float({ min: 0.1, max: 200, fractionDigits: 2 })} kg`;
      case 'Cubic Centimeter': return `${faker.number.int({ min: 10, max: 5000 })} cm³`;
      case 'Litres': return `${faker.number.float({ min: 0.1, max: 100, fractionDigits: 2 })} L`;
      case 'Milliliters': return `${faker.number.int({ min: 10, max: 5000 })} mL`;
      case 'KM/H': return `${faker.number.int({ min: 1, max: 300 })} km/h`;
      case 'Miles/H': return `${faker.number.int({ min: 1, max: 200 })} mph`;
      case 'm/s': return `${faker.number.float({ min: 0.1, max: 100, fractionDigits: 1 })} m/s`;
      case 'Ampere': return `${faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 })} A`;
      case 'Voltage': return `${faker.number.int({ min: 1, max: 480 })} V`;
      case 'Wattage': return `${faker.number.int({ min: 5, max: 2000 })} W`;
      case 'Longitude': return `${faker.number.float({ min: -180, max: 180, fractionDigits: 6 })}°`;
      case 'Latitude': return `${faker.number.float({ min: -90, max: 90, fractionDigits: 6 })}°`;
      default: return faker.lorem.word();
    }
  };

  useEffect(() => {
    if (customColumns.length > 0 && columns !== customColumns.length) {
      setColumns(customColumns.length);
    }
    let config = [...customColumns];
    if (config.length > columns) config = config.slice(0, columns);
    while (config.length < columns) {
      config.push({ name: `filler${config.length + 1}`, type: 'String' });
    }
    setColumnConfig(config);
  }, [customColumns, columns]);

  // FIXED: fetchRealCities moved inline → no more exhaustive-deps warning
  useEffect(() => {
    const loadRealCities = async () => {
      try {
        const response = await fetch(
          'http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=100&sort=-population&fields=name,country,region,population'
        );
        if (response.ok) {
          const json = await response.json();
          setRealCities(json.data || []);
        } else {
          setRealCities(getFallbackCities());
        }
      } catch {
        setRealCities(getFallbackCities());
      }
    };

    loadRealCities();
  }, []); // eslint rule satisfied — empty array is correct now

  useEffect(() => {
    setCurrentPage(1);
  }, [data, rowsPerPage]);

  // getFallbackCities remains unchanged
  const getFallbackCities = () => [
    // ... (your huge fallback list stays exactly the same)
    { name: 'Cairo', country: 'Egypt', region: 'Cairo Governorate', population: 20901000 },
    { name: 'Lagos', country: 'Nigeria', region: 'Lagos State', population: 15946000 },
    { name: 'Kinshasa', country: 'Democratic Republic of the Congo', region: 'Kinshasa', population: 14342000 },
    { name: 'Luanda', country: 'Angola', region: 'Luanda Province', population: 8330000 },
    { name: 'Dar es Salaam', country: 'Tanzania', region: 'Dar es Salaam Region', population: 6702000 },
    { name: 'Johannesburg', country: 'South Africa', region: 'Gauteng', population: 9574400 },
    { name: 'Addis Ababa', country: 'Ethiopia', region: 'Addis Ababa', population: 5012000 },
    { name: 'Cape Town', country: 'South Africa', region: 'Western Cape', population: 4336700 },
    { name: 'Nairobi', country: 'Kenya', region: 'Nairobi County', population: 4397000 },
    { name: 'Abidjan', country: "Côte d'Ivoire", region: 'Abidjan Autonomous District', population: 5174000 },
    { name: 'Algiers', country: 'Algeria', region: 'Algiers Province', population: 2587000 },
    { name: 'Casablanca', country: 'Morocco', region: 'Casablanca-Settat', population: 3690000 },
    { name: 'Tokyo', country: 'Japan', region: 'Tokyo', population: 37393000 },
    { name: 'Jakarta', country: 'Indonesia', region: 'Jakarta', population: 35386000 },
    { name: 'New Delhi', country: 'India', region: 'Delhi', population: 30291000 },
    { name: 'Shanghai', country: 'China', region: 'Shanghai', population: 27058000 },
    { name: 'Dhaka', country: 'Bangladesh', region: 'Dhaka Division', population: 21006000 },
    { name: 'Manila', country: 'Philippines', region: 'Metro Manila', population: 24899000 },
    { name: 'Seoul', country: 'South Korea', region: 'Seoul', population: 25773800 },
    { name: 'Karachi', country: 'Pakistan', region: 'Sindh', population: 16623000 },
    { name: 'Mumbai', country: 'India', region: 'Maharashtra', population: 20435000 },
    { name: 'Osaka', country: 'Japan', region: 'Osaka', population: 19000000 },
    { name: 'Bangkok', country: 'Thailand', region: 'Bangkok', population: 10580000 },
    { name: 'Tehran', country: 'Iran', region: 'Tehran', population: 8950000 },
    { name: 'Moscow', country: 'Russia', region: 'Moscow', population: 19100000 },
    { name: 'Paris', country: 'France', region: 'Île-de-France', population: 10890000 },
    { name: 'Istanbul', country: 'Turkey', region: 'Istanbul Province', population: 10042000 },
    { name: 'London', country: 'United Kingdom', region: 'England', population: 9787000 },
    { name: 'Madrid', country: 'Spain', region: 'Community of Madrid', population: 6211000 },
    { name: 'Berlin', country: 'Germany', region: 'Berlin', population: 3645000 },
    { name: 'Rome', country: 'Italy', region: 'Lazio', population: 2870000 },
    { name: 'Kiev', country: 'Ukraine', region: 'Kyiv', population: 2956000 },
    { name: 'Warsaw', country: 'Poland', region: 'Masovian Voivodeship', population: 1796000 },
    { name: 'Vienna', country: 'Austria', region: 'Vienna', population: 1914000 },
    { name: 'Bucharest', country: 'Romania', region: 'Bucharest', population: 1821000 },
    { name: 'Hamburg', country: 'Germany', region: 'Hamburg', population: 1844000 },
    { name: 'Mexico City', country: 'Mexico', region: 'Mexico City', population: 21782000 },
    { name: 'New York', country: 'United States', region: 'New York', population: 18804000 },
    { name: 'Los Angeles', country: 'United States', region: 'California', population: 12447000 },
    { name: 'Chicago', country: 'United States', region: 'Illinois', population: 8865000 },
    { name: 'Houston', country: 'United States', region: 'Texas', population: 6371000 },
    { name: 'Toronto', country: 'Canada', region: 'Ontario', population: 6491290 },
    { name: 'Guadalajara', country: 'Mexico', region: 'Jalisco', population: 5578580 },
    { name: 'Havana', country: 'Cuba', region: 'Havana Province', population: 2100000 },
    { name: 'Montreal', country: 'Canada', region: 'Quebec', population: 4298000 },
    { name: 'Miami', country: 'United States', region: 'Florida', population: 6088000 },
    { name: 'Monterrey', country: 'Mexico', region: 'Nuevo León', population: 4932000 },
    { name: 'Santo Domingo', country: 'Dominican Republic', region: 'Distrito Nacional', population: 2968000 },
    { name: 'San Juan', country: 'Puerto Rico', region: 'San Juan', population: 319500 },
    { name: 'Kingston', country: 'Jamaica', region: 'Kingston', population: 670000 },
    { name: 'São Paulo', country: 'Brazil', region: 'São Paulo', population: 22043000 },
    { name: 'Buenos Aires', country: 'Argentina', region: 'Buenos Aires Province', population: 15154000 },
    { name: 'Rio de Janeiro', country: 'Brazil', region: 'Rio de Janeiro', population: 13458000 },
    { name: 'Bogotá', country: 'Colombia', region: 'Cundinamarca', population: 10978000 },
    { name: 'Lima', country: 'Peru', region: 'Lima', population: 10719000 },
    { name: 'Santiago', country: 'Chile', region: 'Santiago Metropolitan Region', population: 7000000 },
    { name: 'Caracas', country: 'Venezuela', region: 'Capital District', population: 3000000 },
    { name: 'Medellín', country: 'Colombia', region: 'Antioquia', population: 4500000 },
    { name: 'Belo Horizonte', country: 'Brazil', region: 'Minas Gerais', population: 6270000 },
    { name: 'Guayaquil', country: 'Ecuador', region: 'Guayas Province', population: 2700000 },
    { name: 'Asunción', country: 'Paraguay', region: 'Asunción', population: 525000 },
    { name: 'Montevideo', country: 'Uruguay', region: 'Montevideo Department', population: 1350000 },
    { name: 'Melbourne', country: 'Australia', region: 'Victoria', population: 4968000 },
    { name: 'Sydney', country: 'Australia', region: 'New South Wales', population: 4926000 },
    { name: 'Brisbane', country: 'Australia', region: 'Queensland', population: 2406000 },
    { name: 'Perth', country: 'Australia', region: 'Western Australia', population: 2042000 },
    { name: 'Auckland', country: 'New Zealand', region: 'Auckland', population: 1607000 },
    { name: 'Adelaide', country: 'Australia', region: 'South Australia', population: 1469163 },
    { name: 'Port Moresby', country: 'Papua New Guinea', region: 'National Capital District', population: 400000 },
    { name: 'Suva', country: 'Fiji', region: 'Central Division', population: 93000 },
    { name: 'Wellington', country: 'New Zealand', region: 'Wellington', population: 419600 },
    { name: 'Hobart', country: 'Australia', region: 'Tasmania', population: 247000 },
    { name: 'Port Vila', country: 'Vanuatu', region: 'Shefa Province', population: 50000 },
    { name: 'Honiara', country: 'Solomon Islands', region: 'Honiara City', population: 85000 },
    { name: "Nuku'alofa", country: 'Tonga', region: 'Tongatapu', population: 25000 },
    { name: 'Funafuti', country: 'Tuvalu', region: 'Funafuti', population: 6000 }
  ];

  const getRandomRealCity = () => {
    if (realCities.length === 0) {
      const fallbackCities = getFallbackCities();
      return fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
    }
    return realCities[Math.floor(Math.random() * realCities.length)];
  };

  const fetchCountryPopulation = async (countryName) => {
    const key = `country_${countryName}`;
    if (populationCache[key]) return populationCache[key];
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const pop = data[0]?.population;
      if (pop) {
        setPopulationCache(p => ({ ...p, [key]: pop }));
        return pop;
      }
    } catch { }
    const fallback = faker.number.int({ min: 1000000, max: 1000000000 });
    setPopulationCache(p => ({ ...p, [key]: fallback }));
    return fallback;
  };

  const fetchCityPopulation = async (cityName, countryName = '') => {
    const key = `city_${cityName}_${countryName}`;
    if (populationCache[key]) return populationCache[key];
    try {
      const response = await fetch(
        `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=5`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      const cities = data.data || [];
      const best = cities[0];
      if (best?.population) {
        setPopulationCache(p => ({ ...p, [key]: best.population }));
        return best.population;
      }
    } catch { }
    const fallback = faker.number.int({ min: 50000, max: 20000000 });
    setPopulationCache(p => ({ ...p, [key]: fallback }));
    return fallback;
  };

  const fetchCityCoordinates = async (cityName, countryName = '') => {
    const cacheKey = `coords_city_${cityName}_${countryName}`;
    if (populationCache[cacheKey]) return populationCache[cacheKey];
    try {
      const response = await fetch(
        `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=5`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        let city = data.data[0];
        const exactMatch = data.data.find(c =>
          c.name.toLowerCase() === cityName.toLowerCase()
        );
        if (exactMatch) city = exactMatch;
        const coords = {
          latitude: city.latitude || city.lat,
          longitude: city.longitude || city.lng
        };
        if (coords.latitude && coords.longitude) {
          setPopulationCache(p => ({ ...p, [cacheKey]: coords }));
          return coords;
        }
      }
    } catch (error) {
      console.log(`Could not fetch coordinates for city ${cityName}`, error);
    }
    return null;
  };

  const fetchCountryCapitalCoordinates = async (countryName) => {
    const cacheKey = `coords_country_${countryName}`;
    if (populationCache[cacheKey]) return populationCache[cacheKey];
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const country = data[0];
      if (country && country.capital && country.capital.length > 0) {
        const capital = country.capital[0];
        let capitalCoords = await fetchCityCoordinates(capital, countryName);
        if (!capitalCoords && country.latlng && country.latlng.length === 2) {
          capitalCoords = {
            latitude: country.latlng[0],
            longitude: country.latlng[1]
          };
        }
        if (capitalCoords) {
          setPopulationCache(p => ({ ...p, [cacheKey]: capitalCoords }));
          return capitalCoords;
        }
      }
    } catch (error) {
      console.log(`Could not fetch capital coordinates for country ${countryName}`, error);
    }
    return null;
  };

  const stateCapitals = {
    'Alabama': 'Montgomery', 'Alaska': 'Juneau', 'Arizona': 'Phoenix', 'Arkansas': 'Little Rock', 'California': 'Sacramento',
    'Colorado': 'Denver', 'Connecticut': 'Hartford', 'Delaware': 'Dover', 'Florida': 'Tallahassee', 'Georgia': 'Atlanta',
    'Hawaii': 'Honolulu', 'Idaho': 'Boise', 'Illinois': 'Springfield', 'Indiana': 'Indianapolis', 'Iowa': 'Des Moines',
    'Kansas': 'Topeka', 'Kentucky': 'Frankfort', 'Louisiana': 'Baton Rouge', 'Maine': 'Augusta', 'Maryland': 'Annapolis',
    'Massachusetts': 'Boston', 'Michigan': 'Lansing', 'Minnesota': 'Saint Paul', 'Mississippi': 'Jackson', 'Missouri': 'Jefferson City',
    'Montana': 'Helena', 'Nebraska': 'Lincoln', 'Nevada': 'Carson City', 'New Hampshire': 'Concord', 'New Jersey': 'Trenton',
    'New Mexico': 'Santa Fe', 'New York': 'Albany', 'North Carolina': 'Raleigh', 'North Dakota': 'Bismarck', 'Ohio': 'Columbus',
    'Oklahoma': 'Oklahoma City', 'Oregon': 'Salem', 'Pennsylvania': 'Harrisburg', 'Rhode Island': 'Providence', 'South Carolina': 'Columbia',
    'South Dakota': 'Pierre', 'Tennessee': 'Nashville', 'Texas': 'Austin', 'Utah': 'Salt Lake City', 'Vermont': 'Montpelier',
    'Virginia': 'Richmond', 'Washington': 'Olympia', 'West Virginia': 'Charleston', 'Wisconsin': 'Madison', 'Wyoming': 'Cheyenne',
    'Alberta': 'Edmonton', 'British Columbia': 'Victoria', 'Manitoba': 'Winnipeg', 'New Brunswick': 'Fredericton',
    'Newfoundland and Labrador': "St. John's", 'Nova Scotia': 'Halifax', 'Ontario': 'Toronto',
    'Prince Edward Island': 'Charlottetown', 'Quebec': 'Quebec City', 'Saskatchewan': 'Regina',
    'Northwest Territories': 'Yellowknife', 'Nunavut': 'Iqaluit', 'Yukon': 'Whitehorse'
  };

  const fetchStateCapitalCoordinates = async (stateName, countryName) => {
    if (!stateName) return null;
    const normalized = stateName
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    const capitalCity = stateCapitals[normalized];
    if (!capitalCity) return null;
    return await fetchCityCoordinates(capitalCity, countryName);
  };
  //-----------------------------add custom column changes start here ---- 21 Nov ---------------


  const addCustomColumn = () => {
    const name = columnName.trim();
    const maxLen = document.getElementById('col-maxlen').value
      ? parseInt(document.getElementById('col-maxlen').value)
      : null;

    if (customColumns.some(c => c.name === name)) return alert('Column name exists');

    const columnData = { name, type: selectedType, maxLen };

    if (selectedType === 'Size' && selectedSizeCondition) {
      columnData.sizeCondition = selectedSizeCondition;
    }
    if (selectedType === 'DOB' && selectedDOBFormat) {
      columnData.dobFormat = selectedDOBFormat;
      columnData.dobFrom = dobFromDate;
      columnData.dobTo = dobToDate;
    }

    setCustomColumns([...customColumns, columnData]);
    document.getElementById('col-maxlen').value = '';

    // Reset DOB fields after adding
    setSelectedDOBFormat('');
    setDobFromDate(null);
    setDobToDate(null);
    setDobDateError('');
    setSelectedSizeCondition('');
  };




  //-------------------------------- change till  here 1st ---------------------
  const removeCustomColumn = (i) => setCustomColumns(customColumns.filter((_, idx) => idx !== i));
  const removeLastCustom = () => setCustomColumns(customColumns.slice(0, -1));
  const clearAllColumns = () => setCustomColumns([]);


  //--------------------------------------------generate data changes start here




  const generateData = async () => {
    setIsLoading(true);
    const newData = [];
    const cityColumns = columnConfig.filter(c => c.type === 'City');
    const countryColumns = columnConfig.filter(c => c.type === 'Country');
    const stateColumns = columnConfig.filter(c => c.type === 'State');
    const postalCodeColumns = columnConfig.filter(c => c.type === 'Postal Code');
    const longitudeColumns = columnConfig.filter(c => c.type === 'Longitude');
    const latitudeColumns = columnConfig.filter(c => c.type === 'Latitude');
    const needsLocationConstraint = cityColumns.length > 0 || countryColumns.length > 0 || stateColumns.length > 0 || postalCodeColumns.length > 0 || longitudeColumns.length > 0 || latitudeColumns.length > 0;

    // NEW: Check if we have age column for intelligent size matching
    const hasAgeColumn = columnConfig.some(col => col.type === 'Numeric' && (col.name.toLowerCase().includes('age') || col.name.toLowerCase().includes('year')));
    let ageValue = null;

    for (let i = 0; i < rows; i++) {
      const row = {};
      let selectedCity = null;
      let selectedCountry = null;
      let selectedState = null;
      let cityCoordinates = null;
      let countryCoordinates = null;

      //---dob changes----
      //--if (col.type === 'DOB') {
      //--    val = generateDOBData(col.dobFormat, col.dobFrom, col.dobTo);
      //--  }
      //---dob changes end------

      // NEW: Generate age first if needed for size matching
      if (hasAgeColumn) {
        ageValue = faker.number.int({ min: 1, max: 100 });
      }

      if (needsLocationConstraint) {
        const realCity = getRandomRealCity();
        selectedCity = realCity.name;
        selectedCountry = realCity.country;
        selectedState = realCity.region || faker.location.state();

        if (longitudeColumns.length > 0 || latitudeColumns.length > 0) {
          if (selectedCity) {
            cityCoordinates = await fetchCityCoordinates(selectedCity, selectedCountry);
          }
          if (!cityCoordinates && selectedState) {
            cityCoordinates = await fetchStateCapitalCoordinates(selectedState, selectedCountry);
          }
          if (!cityCoordinates && selectedCountry) {
            countryCoordinates = await fetchCountryCapitalCoordinates(selectedCountry);
          }
        }
      }

      for (const col of columnConfig) {
        let val = '';
        const isMeasurement = [
          'Inches', 'cms', 'mts', 'KMs', 'Miles', 'Grams', 'Kilograms',
          'Cubic Centimeter', 'Litres', 'Milliliters', 'KM/H', 'Miles/H',
          'm/s', 'Ampere', 'Voltage', 'Wattage', 'Longitude', 'Latitude'
        ].includes(col.type);

        if (isMeasurement) {
          val = generateMeasurementData(col.type);
        } else {
          switch (col.type) {
            case 'String': val = faker.lorem.words(3); break;
            case 'Numeric':
              // NEW: If this is an age column, use the pre-generated age value
              if (hasAgeColumn && (col.name.toLowerCase().includes('age') || col.name.toLowerCase().includes('year'))) {
                val = ageValue;
              } else {
                val = faker.number.int({ min: 0, max: 1000 });
              }
              break;
            case 'Boolean': val = faker.datatype.boolean(); break;
            case 'Price': val = faker.commerce.price({ min: 10, max: 1000 }); break;
            case 'ID': val = faker.string.uuid(); break;
            case 'Lorem Text': val = faker.lorem.sentence(); break;
            case 'Company': val = faker.company.name(); break;
            case 'Temperature (C)': val = `${faker.number.int({ min: -20, max: 50 })}°C`; break;
            case 'Temperature (F)': val = `${faker.number.int({ min: -4, max: 122 })}°F`; break;
            case 'Shoe Size': val = faker.number.int({ min: 5, max: 15 }); break;
            case 'Gender': val = faker.helpers.arrayElement(['Male', 'Female', 'Other']); break;
            case 'Credit Card Number': val = faker.string.numeric(16).replace(/(\d{4})(?=\d)/g, '$1-'); break;
            case 'CVV': val = faker.number.int({ min: 100, max: 999 }); break;
            case 'City': val = selectedCity; break;
            case 'Country': val = selectedCountry; break;
            case 'State': val = selectedState; break;
            case 'Postal Code':
              val = await getPostalCodeForLocation(selectedCountry, selectedCity, selectedState);
              break;
            case 'City Population':
              val = await fetchCityPopulation(selectedCity, selectedCountry);
              break;
            case 'Country Population':
              val = await fetchCountryPopulation(selectedCountry);
              break;
            case 'Name': val = `${faker.person.firstName()} ${faker.person.lastName()}`; break;
            case 'First Name': val = faker.person.firstName(); break;
            case 'Last Name': val = faker.person.lastName(); break;
            case 'SSN': val = faker.string.numeric(9); break;
            case 'House Number': val = faker.location.buildingNumber(); break;
            case 'Building Number': val = faker.location.buildingNumber(); break;
            case 'Street Name': val = faker.location.street(); break;
            case 'Small': val = 'Small'; break;
            case 'Medium': val = 'Medium'; break;
            case 'Large': val = 'Large'; break;
            case 'Extra Large': val = 'Extra Large'; break;
            case 'Day': val = faker.date.weekday(); break;
            case 'Month': val = faker.date.month(); break;
            case 'Year': val = faker.date.future().getFullYear(); break;
            case 'Longitude':
              if (cityCoordinates && cityCoordinates.longitude) {
                val = `${Number(cityCoordinates.longitude).toFixed(6)}°`;
              } else if (countryCoordinates && countryCoordinates.longitude) {
                val = `${Number(countryCoordinates.longitude).toFixed(6)}°`;
              } else {
                val = `${faker.number.float({ min: -180, max: 180, fractionDigits: 6 })}°`;
              }
              break;
            case 'Latitude':
              if (cityCoordinates && cityCoordinates.latitude) {
                val = `${Number(cityCoordinates.latitude).toFixed(6)}°`;
              } else if (countryCoordinates && countryCoordinates.latitude) {
                val = `${Number(countryCoordinates.latitude).toFixed(6)}°`;
              } else {
                val = `${faker.number.float({ min: -90, max: 90, fractionDigits: 6 })}°`;
              }
              break;
            case 'Size':
              // NEW: Generate size data based on condition and age
              val = generateSizeData(col.sizeCondition, ageValue);
              break;
            case 'DOB':
              // NEW: Generate DOB data based on format and range
              val = generateDOBData(col.dobFormat, col.dobFrom, col.dobTo);
              break;
            case 'Salary':
              // NEW: Generate intelligent salary data
              val = generateSalaryData();
              break;
            case 'Height':
              // NEW: Generate height data in Feet(cms) format
              val = generateHeightData();
              break;
            case 'Weight':
              // NEW: Generate weight data
              val = generateWeightData();
              break;
            default: val = faker.lorem.word();
          }
        }
        if (col.maxLen && typeof val === 'string')
          val = val.slice(0, col.maxLen);
        row[col.name] = val;

        // ... rest of your switch/cases

        if (col.maxLen && typeof val === 'string') val = val.slice(0, col.maxLen);
        row[col.name] = val;
      }
      newData.push(row);
    }
    setData(newData);
    setIsLoading(false);
  };





  //--------------- within this section some changes -----------------



  // --no change from herer -------------------------------------------
  const downloadCSV = () => {
    if (data.length === 0) return;
    const csv =
      Object.keys(data[0]).join(',') +
      '\n' +
      data.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadJSON = () => {
    if (data.length === 0) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const getPopulationHint = (type) =>
    type === 'City Population'
      ? '🏙️ Real city data from API'
      : type === 'Country Population'
        ? '🌍 Real country data from API'
        : null;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handleResetClick = () => setShowResetConfirm(true);
  const handleResetConfirm = () => window.location.reload();
  const handleResetCancel = () => setShowResetConfirm(false);



  //-----------no change till here --------------








  return (
    <div className={`App ${theme}-theme`}>
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Reset</h3>
            <p>Reset will reload the site and all data will be lost.</p>
            <div className="modal-buttons">
              <button onClick={handleResetCancel} className="modal-button cancel">Cancel</button>
              <button onClick={handleResetConfirm} className="modal-button confirm">Continue</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>


      <h1>Fake Data Generator</h1>


      {/* FIRST CARD – now expands horizontally automatically */}


      <div className="custom-section" style={{
        display: 'flex',
        flexWrap: 'wrap',              // keep wrap so it still works on very small screens
        gap: '1rem',
        alignItems: 'flex-end',
        padding: '1.5rem',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#2d2d2d',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        width: '100%',
        minWidth: 'fit-content',      // ← NEW: prevents shrinking too much
        boxSizing: 'border-box',
        overflow: 'visible',
        justifyContent: 'flex-start'  // ← NEW: keeps everything left-aligned in one row
      }}>

        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          Column Name:
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Enter column name"
            style={{ marginTop: '0.25rem', padding: '0.5rem' }}
          />
        </label>
        {/*/----------monior updates above, between comments -------*/}


        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          Type:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ marginTop: '0.25rem', padding: '0.5rem' }}
          >
            {Object.entries(fieldCategories).map(([cat, fields]) => (
              <optgroup key={cat} label={cat}>
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
              </optgroup>
            ))}
          </select>
        </label>

        {/* Size Condition */}
        {selectedType === 'Size' && (
          <label style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            Condition/Choice:
            <select
              value={selectedSizeCondition}
              onChange={(e) => setSelectedSizeCondition(e.target.value)}
              style={{ marginTop: '0.25rem', padding: '0.5rem' }}
            >
              <option value="">Select Size Type</option>
              {Object.keys(sizeConditions).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}

        {/* NEW: DOB datepicker */}
        {selectedType === 'DOB' && (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
              Format:
              <select
                value={selectedDOBFormat}
                onChange={(e) => setSelectedDOBFormat(e.target.value)}
                style={{ marginTop: '0.25rem', padding: '0.5rem' }}
              >
                <option value="">Select Date Format</option>
                {dobFormats.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>


            {/*// ----------starting here, changes below till next comment - Nov 21 */}


            {selectedDOBFormat && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>From Date:</label>
                  <DatePicker
                    selected={dobFromDate}
                    onChange={setDobFromDate}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>To Date:</label>
                  <DatePicker
                    selected={dobToDate}
                    onChange={setDobToDate}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                  />
                </div>

                {dobDateError && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    {dobDateError}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          Max Length:
          <input id="col-maxlen" type="number" min="1" placeholder="Optional" style={{ marginTop: '0.25rem', padding: '0.5rem' }} />
        </label>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={addCustomColumn} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>+</button>
          <button onClick={removeLastCustom} disabled={customColumns.length === 0} style={{ padding: '0.6rem 1.2rem', backgroundColor: customColumns.length === 0 ? '#6c757d' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>-</button>
        </div>
      </div>



      {/* //----------changes above----------------------------*/}

      {customColumns.length > 0 && (
        <div className="added-columns-section">
          <div className="section-header">
            <h3>Added Columns ({customColumns.length})</h3>
            <button onClick={clearAllColumns} className="clear-all-btn">Clear All</button>
          </div>
          <table className="columns-table">
            <thead>
              <tr style={{
                backgroundColor: theme === 'light' ? '#f8f9fa' : '#495057',
                color: theme === 'light' ? '#212529' : '#e9ecef',
                fontWeight: '600',
                textAlign: 'left'
              }}>
                <th style={{ padding: '12px 8px', fontSize: '14px' }}>Order</th>
                <th style={{ padding: '12px 8px', fontSize: '14px' }}>Column Name</th>
                <th style={{ padding: '12px 8px', fontSize: '14px' }}>Type</th>
                <th style={{ padding: '12px 8px', fontSize: '14px' }}>Max Length</th>
                <th style={{ padding: '12px 8px', fontSize: '14px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {customColumns.map((col, i) => (
                <tr key={i} style={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#343a40',
                  borderBottom: `1px solid ${theme === 'light' ? '#dee2e6' : '#495057'}`
                }}>
                  <td>
                    <div className="order-controls">
                      <button onClick={() => moveColumnUp(i)} disabled={i === 0} className="order-btn" title="Move up">↑</button>
                      <button onClick={() => moveColumnDown(i)} disabled={i === customColumns.length - 1} className="order-btn" title="Move down">↓</button>
                    </div>
                  </td>
                  <td>{col.name}</td>
                  <td>
                    {col.type}
                    {/* NEW: Show size condition if applicable */}
                    {col.type === 'Size' && col.sizeCondition && (
                      <div className="size-condition-hint">({col.sizeCondition})</div>
                    )}
                    {/* NEW: Show DOB format if applicable */}
                    {col.type === 'DOB' && col.dobFormat && (
                      <div className="size-condition-hint">({col.dobFormat})</div>
                    )}
                    {getPopulationHint(col.type) && (
                      <div className="population-hint">{getPopulationHint(col.type)}</div>
                    )}
                  </td>
                  <td>{col.maxLen || '-'}</td>
                  <td>
                    <button onClick={() => removeCustomColumn(i)} className="remove-btn">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="button-group">
        <label>Rows:<input type="number" value={rows} min="1" onChange={e => setRows(parseInt(e.target.value))} /></label>
        <label>Columns:<input type="number" value={columns} min="1" onChange={e => setColumns(parseInt(e.target.value))} /></label>
        <button onClick={generateData} disabled={isGenerateDisabled()}>{isLoading ? 'Generating…' : 'Generate Data'}</button>
        <button onClick={downloadCSV} disabled={data.length === 0 || isLoading}>Download CSV</button>
        <button onClick={downloadJSON} disabled={data.length === 0 || isLoading}>Download JSON</button>
        <button onClick={handleResetClick}>Reset!</button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Fetching real city and population data…</p>
        </div>
      )}

      {data.length > 0 && (
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Sample Random Data</h2>
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                  {[25, 50, 100, 200, 300, 500, 1000].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</button>
                <select value={currentPage} onChange={(e) => handlePageChange(parseInt(e.target.value))}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
              </div>
            )}
          </div>
          <table>
            <thead>
              <tr>
                {Object.keys(displayedData[0] || {}).map(k => <th key={k}>{k}</th>)}
              </tr>
            </thead>
          </table>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <tbody>
                {displayedData.map((r, i) => (
                  <tr key={i}>
                    {Object.values(r).map((v, j) => <td key={j}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;