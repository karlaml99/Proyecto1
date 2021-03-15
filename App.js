import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Picker, Button, ImageBackground} from 'react-native';
export default function App() {
    const Imagen= {uri: "https://cms-assets.tutsplus.com/uploads/users/2659/posts/32230/image/logo-template-for-a-travel-agency-with-a-baggage-icon-2504b.jpg"};
    const [paises, setPaises] = useState([]);
    const [paisActual, setPaisActual] = useState('');
    const [ciudadesPicker, setCiudadesPicker] = useState([]);
    const [ciudadActual, setCiudadActual] = useState('');
    const [tempCiudad, setTempCiudad] = useState('');
    const [weather, setWeather] = useState('');
    const [timeZone, setTimeZone] = useState ('');
    const [longitud, setLongitud] = useState('');
    const [latitude, setLatitude] = useState('');
    const [monedaLocal, setMonedaLocal] = useState ([]);
    const [monedaActual, setMonedaActual] = useState ('');
    const [resultado, setResultado] = useState('');
   
    //promise para carga de paises
    let countriesArray = [];
    let currencyListArray = [];
    useEffect(()=> {
      fetch('https://countriesnow.space/api/v0.1/countries/positions')
      .then(response => response.json())
      .then(data => {
        let countryInfo =data.data;
        console.log("JSON: " + countryInfo.length)
        countryInfo.forEach(element => {
          countriesArray.push(element.name);
        });
        setPaises(countriesArray);
      });
      //promise para carga de monedas
      fetch('https://currency-converter13.p.rapidapi.com/list', {
        method: "GET",
        headers: {
          "x-rapidapi-key": "39cf878cb2msh4750a69a4c9eb62p1ea218jsn7cfa7755ba29",
          "x-rapidapi-host": "currency-converter13.p.rapidapi.com"
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        data.forEach(element => {
          currencyListArray.push(element)
        });
        setMonedaLocal(currencyListArray);
      })
    }, []);
    console.log("PAISE: " + paises.length);

    //console.log(paises.toString());
    let arrPickerItems  = [];
    paises.map((item, index)=>{
      if(item != undefined){
        arrPickerItems.push(<Picker.Item label={item} value={item} key={index}/>)
      }
    });
    let arrPickerCurrencies = [];
    monedaLocal.map((item, index) => {
      if(item != undefined){
        arrPickerCurrencies.push(<Picker.Item label={item} value={item} key={index}/>)
      }
    })
    return(
      <ImageBackground source ={Imagen} style={styles.foto}>
      <View style={styles.container} > 
        <Picker 
          style={styles.countriesPicker}
          selectedValue={paisActual}
          onValueChange={(itemValue, itemIndex) => {
            setPaisActual(itemValue)
            let ciudad = {"country": itemValue}
            fetch('https://countriesnow.space/api/v0.1/countries/cities', 
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              }, 
              body: JSON.stringify(ciudad)
            })
            .then(response => response.json())
            .then(data => {
              let ciudadesInfo = data.data;
              //console.log(ciudadesInfo);
              let arrPickerCiudades  = [];
              ciudadesInfo.map((item, index)=>{
                if(item != undefined){
                  arrPickerCiudades.push(<Picker.Item label={item} value={item} key={index}/>)
                }
              });
              setCiudadesPicker(arrPickerCiudades);
            });
          }}
        >
         {arrPickerItems}
        </Picker>
        {/* Picker de ciudades */}
        <Picker
          style={styles.ciudadesPickerStyle}
          selectedValue={ciudadActual}
          onValueChange={(itemValue, itemIndex) => {
            setCiudadActual(itemValue)
            const apiKey = '87370707da37bfcc0b74fc8ccc7af204';
            const URL = `https://api.openweathermap.org/data/2.5/weather?q=${itemValue}&appid=${apiKey}`;
            console.log(itemValue);
            
            fetch(URL)
            .then(response => response.json())
              .then(data => {
                console.log(JSON.stringify(data.main.temp));
                let tempC = '';
                tempC = JSON.stringify(data.main.temp);
                let Description = '';
                Description = JSON.stringify(data.weather[0].description);
                let long = 0.0;
                let lat = 0.0;
                console.log(data.coord.lon)
                console.log(data.coord.lat)
                long = JSON.stringify(data.coord.lon);
                lat = JSON.stringify(data.coord.lat);
                console.log(long);
                console.log(lat);
                let celcius = tempC * 9/5 - 459.67;
                setTempCiudad(celcius.toFixed(2));
                setWeather(Description);
                setLongitud(long);
                setLatitude(lat);
                //setTimeZone(timeZ);
              })
            fetch(`https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=${itemValue}`, {
            method: "GET",
            headers: {
              "x-rapidapi-key": "39cf878cb2msh4750a69a4c9eb62p1ea218jsn7cfa7755ba29",
              "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com"
            },
           
          })
          .then(response => {
            console.log(response);
            response.json()
          })
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.error(err);
          });
          }}
        >
          {ciudadesPicker}
        </Picker>
        {/* Temperatura de la ciudad */}
        <View style={{marginTop: 10}}>
          <Text
            style={styles.tempStyles}
          >
            Temperatura de la ciudad: {tempCiudad} °F
          </Text>
          <Text
            style={styles.tempStyles}
          >
            Clima: {weather}
          </Text>
        </View>
        <View style={styles.container}>
          <Button
            title="Time Zone"
            onPress={() => {
            const apiKey2 = 'BLNTTG4YU6PU';
            const URL2 = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey2}&format=json&by=position&lat=${latitude}&lng=${longitud}`;
            fetch(URL2)
              .then(response => response.json())
              .then(data => {
                console.log(data.abbreviation);
                console.log(data);
                let zoneT = data.abbreviation + ' - ' + data.zoneName + 
                          '- Offset: ' + (data.gmtOffset/60)/60 + ' Hours';
              setTimeZone(zoneT);
              })
            }}> 
          </Button>
          <Text
            style={styles.tempStyles}>
            {timeZone}
          </Text>
       </View>
       <View style={styles.container} >
          <Text> Selecciona una Moneda Local </Text>
          <Picker
          style={styles.currencyStyles}
            selectedValue={monedaActual}
            onValueChange={(itemValue, itemIndex) => {
              setMonedaActual(itemValue)
              let params = {
                "from-type": itemValue,
                "to-type": "USD",
                "from-value": "1"
              }
              var formBody = [];
              for (var property in params) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "=" + encodedValue);
              }
              formBody = formBody.join("&");
              fetch("https://community-neutrino-currency-conversion.p.rapidapi.com/convert", {
                method: "POST",
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                  "x-rapidapi-key": "39cf878cb2msh4750a69a4c9eb62p1ea218jsn7cfa7755ba29",
                  "x-rapidapi-host": "community-neutrino-currency-conversion.p.rapidapi.com"
                },
                body: formBody
              })
              .then(response => response.json())
              .then(data => {
                console.log(data);
                console.log(data.result);
                let result = data.result;
                setResultado(result);
              })
            }}
          >
            {arrPickerCurrencies}
          </Picker>
          <Text>
            Conversion: 1 USD =  {resultado}    {monedaActual}
          </Text>
        </View>
      </View>
    </ImageBackground>
      
    );
}

const styles = StyleSheet.create({
  currencyStyles:{
    height: 50,
    width: 200,
    backgroundColor: '#aaa',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    alignItems: 'center'
  },
  tempStyles: {
    flex: 3,
   
  
  },
  foto:{
    alignItems: 'center',
    justifyContent: 'center',
    
    flex:1
  },
  fixToText: {
    marginTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  countriesPicker:{
    height: 50,
    width: '60%',
    marginTop: 170,
    marginBottom: 15,
    backgroundColor: '#aaa',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    alignItems: 'center'
  },
  ciudadesPickerStyle:{
    height: 50,
    width: '60%',
    marginBottom: 20,
    backgroundColor: '#aaa',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  Button:{
    marginTop:60,
    width: '20%', 
    height: 40, 
    backgroundColor: "#F08A0F", 
    borderRadius:10,
  }
});
