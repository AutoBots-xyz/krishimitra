fetch("http://localhost:5174/api/advisory?lat=23.2599&lng=77.4126&crop=Wheat")
  .then(r => r.json())
  .then(data => console.log({
    summary: data.summary,
    irrigation_advice: data.irrigation_advice,
    disease_risk_alert: data.disease_risk_alert,
    hasWeatherData: !!data.weatherData
  }))
  .catch(console.error)
