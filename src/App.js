import React,{ useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import './App.css';
import Table from "./Table";
import {prettyPrintStat, sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";



function App() {
  const[countries, setCountries] = useState([]);
  const[country, setCountry] = useState("worldwide");
  const[countryInfo, setCountryInfo] = useState({});
  const[vaccinatedInfo, setVaccinatedInfo] = useState({});
  const[tableData, setTableData] = useState([]);

  

  //State = How we write a variable in REACT...
  
  //https://disease.sh/v3/covid-19/countries {disease.sh API call, and we will pull th einformation from here...}

  //USEEFFECT = runs a piece of code based on given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountry(data);
    });
  }, []);

  useEffect(() => {
    //The code inside here will run once when the component load and not again and also runs when the variable of the country changes...
    //async -> send a function, wait for it, do something with it...
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country, //INDIA, USA, etc.
            value: country.countryInfo.iso2//IND, US, etc.
          }));
          
          const sortedData = sortData(data);
          setTableData(sortedData);//for the countries table data
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    console.log("Yeah We did It...", countryCode);
    setCountry(countryCode);

    const url_1 ="https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1", url =
     countryCode === 'worldwide' 
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        //All of the data ... from country response
        setCountryInfo(data);
      })
    
    fetch(url_1)
      .then((response) => response.json())
      .then((data1) => {
        setCountry(countryCode);

        //All of the data ... from country response...of the vaccinated population...
        setVaccinatedInfo(data1);
      });
  };

  console.log('COUNTRY INFO >>>>', countryInfo);
  console.log('VACCINATED INFO >>>>', vaccinatedInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker by Saksham</h1>
          <h3 flex-right="10px" align="center">Dropdown for Countries</h3>
            <FormControl className="app__dropdown">
              <Select className="menu__Item" variant="outlined" value={country} onChange={onCountryChange} /*{default={}}*/>
                {/*Now, Loop through all the countries and show a dropdown list of the options*/}
                <MenuItem  placeHolder= "worldwide" value="worldwide"><b>Worldwide</b></MenuItem>
                {
                  countries.map((country)=>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
                {/* <MenuItem value="worldwide">Option 1</MenuItem>
                <MenuItem value="worldwide">Option 2</MenuItem>
                <MenuItem value="worldwide">Option 3</MenuItem>
                <MenuItem value="worldwide">Option 4</MenuItem> */}
              </Select>
            </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Cases" cases ={prettyPrintStat (countryInfo.todayCases)} total ={prettyPrintStat (countryInfo.cases)}/>

          <InfoBox title="Recovered" cases = {prettyPrintStat(countryInfo.todayRecovered)} total ={prettyPrintStat (countryInfo.recovered)}/>

          <InfoBox title="Deaths" cases = {prettyPrintStat(countryInfo.todayDeaths)} total ={prettyPrintStat (countryInfo.deaths)}/>

          <InfoBox title="Active" cases ={prettyPrintStat(countryInfo.active)} total ={prettyPrintStat (countryInfo.active)}/>

          <InfoBox title="Covid-19 Tests" cases ={prettyPrintStat(countryInfo.tests)}/>
          {/* Infoboxes title ="CoronaVirus Cases" */}
          {/* Infoboxes title ="CoronaVirus Recoveries" */}

        </div>
      

          {/*Header*/}
          {/*Title + Select input dropdown*/}

          {/*Infoboxes*/}
          {/*Infoboxes*/}
          {/*Infoboxes*/}

          

          {/*Map*/}
          <Map/>
        </div>
        
        <div className="report">
          <Card className="app__right">
            <CardContent>
              <h3 align="center">Live Cases by Country</h3>
              {/*Table*/}
              <Table countries={tableData}></Table>
              <div className="graphReport">
                <h3 align="center">Worldwide new Cases</h3>
                <LineGraph/>
              </div>
              {/*Graph*/}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

export default App;
