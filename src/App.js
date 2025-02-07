import React, { useState, useEffect } from 'react';
import './App.css';
import farmImage from './assets/farmer-image.jpg';  // Import the farm image for hero section
import riceImage from './assets/Rice-farming.jpg'; 
import cowpeaImage from './assets/Cowpea-farming.jpg';  
import DryseasonImage from './assets/Dry-season-farming.jpg';  
import fruitImage from './assets/fruit-farm.jpg';
import VegetableImage from './assets/Vegetable-farm.jpg';
import cashImage from './assets/cash-crop.jpeg'; 
import SeedImage from './assets/Seed-farm.jpg';
import consultImage from './assets/consult-farm.jpg';
import axios from 'axios';
import debounce from 'lodash.debounce'; 





const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchParameter, setSearchParameter] = useState('cropName');
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
      ecology: '',
      yieldPotential: '',
      duration: '',
      productionSystem: ''
    });
  


 //   const fetchFilteredCrops = debounce(async (query) => {
 //     if (!query.trim()) {
  //        setFilteredCrops([]);
 //         return;
 //     }
  //    setLoading(true);
//setError(null);
   //   try {
   //       const response = await axios.get('http://localhost:7000/api/crops/search', {
   //           params: { parameter: searchParameter, query: query.toLowerCase() },
   //       });
          // Remove duplicates based on _id
  //        const uniqueCrops = Array.from(new Map(response.data.map(crop => [crop._id, crop])).values());
  //        setFilteredCrops(uniqueCrops);
  //    } catch (err) {
  //        setError('Error fetching data. Please try again.');
  //    } finally {
  //        setLoading(false);
  //    }
 // }, 500);  



  // Fetch crops from the API when the component mounts
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/crops');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  // Update filtered crops based on the search query
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    if (query.trim()) {
      try {
        const response = await axios.get(`http://localhost:7000/api/crops/search`, {
          params: {
            parameter: searchParameter,
            query: query
          }
        });
        setFilteredCrops(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setFilteredCrops([]);
    }
  };


   // Debounced API Call
   const fetchFilteredCrops = debounce(async () => {
    if (!searchQuery || !searchQuery.trim()) {  // Prevent undefined error
      setFilteredCrops([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:7000/api/crops/search', {
        params: {
          cropName: searchQuery,
          ecology: filters.ecology,
          yieldPotential: filters.yieldPotential,
          duration: filters.duration,
          productionSystem: filters.productionSystem
        }
      });
      setFilteredCrops(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
}, 500);


// Effect to handle API calls with debounce
useEffect(() => {
  fetchFilteredCrops();
  return () => fetchFilteredCrops.cancel();
}, [searchQuery, filters]);

const handleFilterChange = (e) => {
  setFilters({ ...filters, [e.target.name]: e.target.value });
};




  // Select a crop and display its details
  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setSearchQuery('');
    setFilteredCrops([]);
  };
  
 return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-title">Welcome To <br /> Farmers Helpline</h1>
            <button className="cta-button">Call Us Today</button>
          </div>
          <div className="image-content">
            <img src={farmImage} alt="Farm" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Crop Name"
            className="search-bar"
          />
          <select name="ecology" onChange={handleFilterChange}>
            <option value="">Ecology</option>
            <option value="Savanna">Savanna</option>
            <option value="Forest">Forest</option>
            <option value="Mangrove">Mangrove</option>
          </select>
          <select name="yieldPotential" onChange={handleFilterChange}>
            <option value="">State</option>
            <option value="Adamawa">Adamawa</option>
            <option value="Katsina">Katsina</option>
            <option value="Ebonyi">Ebonyi</option>
            <option value="Lagos">Lagos</option>
            <option value="Benue">Benue</option>
          </select>
          <select name="duration" onChange={handleFilterChange}>
            <option value="">Crop Duration</option>
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
          <select name="productionSystem" onChange={handleFilterChange}>
            <option value="">Production System</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Rainfed">Rainfed</option>
          </select>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        {filteredCrops.length > 0 && (
          <div className="search-results">
            <ul>
              {filteredCrops.map((crop) => (
                <li key={crop._id} onClick={() => setSelectedCrop(crop)}>
                  {crop.cropName} - {crop.ecology}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>


      {/* Crop Details Section */}
{selectedCrop && (
  <section className="crop-details-section">
    <h2 align="center">Crop Details</h2>
    <div className="crop-details-container">
      <table className="crop-details-table">
        <tbody>
          <tr>
            <th>Crop Name</th>
            <td>{selectedCrop.cropName}</td>
          </tr>
          <tr>
            <th>Variety</th>
            <td>{selectedCrop.variety}</td>
          </tr>
          <tr>
            <th>Ecology</th>
            <td>{selectedCrop.ecology}</td>
          </tr>
          <tr>
            <th>Yield Potential</th>
            <td>{selectedCrop.yieldPotential}</td>
          </tr>
          <tr>
            <th>Duration</th>
            <td>{selectedCrop.duration}</td>
          </tr>
          <tr>
            <th>Production System</th>
            <td>{selectedCrop.productionSystem}</td>
          </tr>
          <tr>
            <th>Planting Dates</th>
            <td>
              <ul>
                <li><strong>Northern Guinea Savanna:</strong> {selectedCrop.plantingDates.northernGuineaSavanna}</li>
                <li><strong>Southern Guinea Savanna:</strong> {selectedCrop.plantingDates.southernGuineaSavanna}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Harvesting</th>
            <td>{selectedCrop.harvesting}</td>
          </tr>
          <tr>
            <th>Storage</th>
            <td>{selectedCrop.storage}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
)}

      {/* Featured Search Section */}
      <section className="featured-search-section">
        <h1 align="center">Featured Search</h1>
        <br />
        <div className="featured-search-container">
          <div className="featured-search-item">
            <img src={riceImage} alt="Rice Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Rice Farming</h3>
            <p className="featured-search-description">How to farm rice in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
          <div className="featured-search-item">
            <img src={cowpeaImage} alt="Cowpea Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Cowpea Farming</h3>
            <p className="featured-search-description">How to farm Cowpea in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
          <div className="featured-search-item">
            <img src={DryseasonImage} alt="Dry Season Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Dry Season Farming</h3>
            <p className="featured-search-description">Explore dry season farming in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section">
        <h2 className="category-header">Farming Categories</h2>
        <div className="category-container">
          <div className="category-item">
            <img src={fruitImage} alt="Fruits" className="category-image" />
            <h3 className="category-title">Fruits</h3>
            <p className="category-description">Learn about different types of fruits and how to grow them.</p>
          </div>
          <div className="category-item">
            <img src={cashImage} alt="Cash Crops" className="category-image" />
            <h3 className="category-title">Cash Crops</h3>
            <p className="category-description">Get tips and advice on growing valuable cash crops.</p>
          </div>
          <div className="category-item">
            <img src={SeedImage} alt="Seeds" className="category-image" />
            <h3 className="category-title">Seeds</h3>
            <p className="category-description">Discover the importance of quality seeds for successful farming.</p>
          </div>
          <div className="category-item">
            <img src={VegetableImage} alt="Vegetables" className="category-image" />
            <h3 className="category-title">Vegetables</h3>
            <p className="category-description">Learn how to grow a variety of vegetables for your farm.</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <h2 className="category-header">What We Do</h2>
        <div className="category-container">
          <div className="category-item">
          <img src={consultImage} alt="Consultation" className="category-image" />
            <h3 className="category-title">Consultation</h3>
            <p className="category-description">We provide expert consultation for all types of farming.</p>
          </div>
          <div className="category-item">
          <img src={consultImage} alt="Training" className="category-image" />
            <h3 className="category-title">Training</h3>
            <p className="category-description">We offer hands-on training for farmers on best practices.</p>
          </div>
          <div className="category-item">
          <img src={consultImage} alt="Supply of Inputs" className="category-image" />
            <h3 className="category-title">Supply of Inputs</h3>
            <p className="category-description">We supply high-quality seeds, fertilizers, and tools.</p>
          </div>
          <div className="category-item">
          <img src={consultImage} alt="Market Linkage" className="category-image" />
            <h3 className="category-title">Market Linkages</h3>
            <p className="category-description">We help farmers connect with markets for their produce.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
