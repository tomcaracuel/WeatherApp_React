import { LoadingButton } from "@mui/lab" 
import { Box, Container, TextField, Typography } from "@mui/material" 
import { useState } from "react"
import './App.scss'

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=en&q=` 



export default function App() {
  const [city, setCity] = useState("") 
  const [error, setError] = useState({
    error: false,
    message: "",
  }) 
  const [loading, setLoading] = useState(false) 

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  }) 

  const onSubmit = async (e) => {
    e.preventDefault() 
    setError({ error: false, message: "" }) 
    setLoading(true) 

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" } 

      const res = await fetch(API_WEATHER + city) 
      const data = await res.json() 

      if (data.error) {
        throw { message: data.error.message } 
      }

      console.log(data) 

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      }) 
    } catch (error) {
      console.log(error) 
      setError({ error: true, message: error.message }) 
    } finally {
      setLoading(false) 
    }
  } 


  return (
    <div className="background">
    <div className="Container">
      <div className="Typography">
        <h1>Weather App</h1>
      </div>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="City"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Searching..."
        >
          Search
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h6"
            component="h4"
          >
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API" target="_blank"
        >
          WeatherAPI.com
        </a>
      </Typography>
    </div>
    </div>
  ) 
}
