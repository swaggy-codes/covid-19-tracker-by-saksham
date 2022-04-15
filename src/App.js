import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [vaccinatedInfo, setVaccinatedInfo] = useState({});
  const [tableData, setTableData] = useState([]);



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

    const url_1 = "https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1", url =
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
          <Nav>
            <NavMenu>
              <div className="heading">
                <h1 align="center">Covid 19 Tracker by Saksham Gupta</h1>
              </div>
              <a>
                <img src="/images/coronavirus.png" alt="ORIGINALS" />
                <span>DROPDOWN FOR COUNTRIES</span>
              </a>
            </NavMenu>
            <div className="dropdown">
              <FormControl className="app__dropdown">
                <Select className="menu__Item" variant="outlined" onChange={onCountryChange} value={country} /*{default={}}*/>
                  {/*Now, Loop through all the countries and show a dropdown list of the options*/}
                  <MenuItem value="worldwide"><b>Worldwide</b></MenuItem>
                  {
                    countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                  {/* <MenuItem value="worldwide">Option 1</MenuItem>
                <MenuItem value="worldwide">Option 2</MenuItem>
                <MenuItem value="worldwide">Option 3</MenuItem>
                <MenuItem value="worldwide">Option 4</MenuItem> */}
                </Select>
              </FormControl>
            </div>
            {/*<Login onClick={handleAuth}>LogIn</Login>*/}
            { /*<h4>MCA-II-Year Project "Major"</h4> */}
          </Nav>
        </div>

        <div className="app__stats">
          <InfoBox title="Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />

          <InfoBox title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />

          <InfoBox title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />

          <InfoBox title="Active" cases={prettyPrintStat(countryInfo.active)} total={prettyPrintStat(countryInfo.active)} />

          <InfoBox title="Covid-19 Tests" cases={prettyPrintStat(countryInfo.tests)} />
          {/* Infoboxes title ="CoronaVirus Cases" */}
          {/* Infoboxes title ="CoronaVirus Recoveries" */}

        </div>


        {/*Header*/}
        {/*Title + Select input dropdown*/}

        {/*Infoboxes*/}
        {/*Infoboxes*/}
        {/*Infoboxes*/}



        {/*Map*/}

      </div>

      <div className="report">
        <Card className="app__right">
          <CardContent>
            <h2 align="center">Live Cases by Country</h2>
            {/*Table*/}
            <Table countries={tableData}></Table>
            <div className="graphReport">
              <h2 align="center">Worldwide new Cases</h2>
              <LineGraph />
            </div>
            {/*Graph*/}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Nav = styled.nav`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 75px;
    background-color: #061029;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    z-index: 3;
`;

const NavMenu = styled.div`
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    justify-content: flex-end;
    margin: 0px;
    padding: 0px;
    position: relative;
    margin-right: auto;
    margin-left: 25px;

    a {
        display: flex;
        align-items: center; 
        padding: 0px 12px;

        img {
            height: 20px;
            min-width: 20px;
            width: 20px;
            z-index: auto;
        }

        span {
            color: rgb(249,249,249);
            font-size: 13px;
            letter-spacing: 1.42px;
            line-height: 1.5;
            padding: 2px 0px;
            white-space: nowrap;
            position: relative;
        
            &:before {
                background-color: rgb(249,249,249);
                border-radius: 0px 0px 4px 4px;
                bottom: -6px;
                content: "";
                height: 2px;
                left: 0px;
                opacity: 0;
                position: absolute;
                right: 0;
                transform-origin: left center;
                transform: scaleX(0);
                transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.84) 0s;
                visibiltiy: hidden;
                width: auto;
            }
        }

        &:hover {
            span:before {
                transform: scaleX(1);
                visibility: visible;
                opacity: 1 !important;
            }
        }
    }

    @media (max-width: 50px) {
        display: none;
    }
`;

export default App;
