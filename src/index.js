import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class WeatherApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      city: 'Moscow',
      load: 'hide'
    }
    let weatherBuf = JSON.parse(window.localStorage.getItem('weatherbuf'));
    //this.state.weather = weatherBuf.weather;

    this.fetched = false;

    console.log(this.state.weather);

  }

  componentWillMount() {
    this.getWeatherData();
  }

  onInputChane = (e) => {
    const newCitystate = { city: e.target.value };
    this.setState(newCitystate);
  }

  getWeatherData = () => {

    this.setState({ load: 'load' });

    fetch('https://us1.locationiq.com/v1/search.php?key=302f0d75c67b72&q=' + this.state.city + '&format=json')
      .then(resp => {
        console.log(resp);
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error(resp.status);
        }
      })
      .then(resp => {
        console.log(resp);
        return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + resp[0].lat + '&lon=' + resp[0].lon + '&appid=a19641b44afdf6e04adb1c8f74e13496&units=metric')
      })
      .then(resp => {
        console.log(resp);
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error(resp.status);
        }
      })
      .then(resp => {
        console.log(resp);
        this.fetched = true;
        this.refreshWeather(resp);
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.setState({ load: 'hide' });
      });
  }

  refreshWeather(data) {
    let newWeater = { weather: data };
    this.setState(newWeater);
    console.log(this.state);
  }


  render() {

    if (!this.fetched) {
      return (
        <div className='weather-app'>
          <div className='current-box'>Fetching data...</div>
        </div>
      )
    } else {

      let iconSrc = 'http://openweathermap.org/img/wn/' + this.state.weather.current.weather[0].icon + '@2x.png';

      let hourIconSrc = this.state.weather.hourly.map((item, num) => {
        return 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '.png';
      })

      let tdMas = [], thMas = [];

      for (let i = 0; i < 7; i++) {
        let elementTd =
          <td key={i}>
            <div><img src={hourIconSrc[i + 1]} alt='icon'></img></div>
            <div className='hourly-tmp'>{Math.round(this.state.weather.hourly[i + 1].temp)}&#8451;</div>
          </td>
        tdMas.push(elementTd);

        let elementTh = <th key={i}>{(new Date(Date.now() + 3600000 * (i + 1))).getHours()}:00</th>

        thMas.push(elementTh);
      }

      let dailyMas = this.state.weather.daily.map((item, number) => {

        let dayNum = ((new Date(Date.now())).getDay() + number) > 7 ? (new Date(Date.now())).getDay() + number - 7 : (new Date(Date.now())).getDay() + number;

        let day;

        switch (dayNum) {
          case (1):
            day = 'Mon';
            break;
          case (2):
            day = 'Tue';
            break;
          case (3):
            day = 'Wed';
            break;
          case (4):
            day = 'Thu';
            break;
          case (5):
            day = 'Fri';
            break;
          case (6):
            day = 'Sat';
            break;
          case (7):
            day = 'Sun';
            break;
          default:
            break;
        }

        if (number !== 0) {
          return <div className='daily-item' key={number}>
            <div>
              {day}
            </div>
            <div>
              <img src={'http://openweathermap.org/img/wn/' + item.weather[0].icon + '.png'} alt='icon'></img>
              <div>{Math.round(item.temp.day)}&#8451;</div>
            </div>
          </div>
        } else {
          return ''
        }
      })



      return (
        <div className='weather-app'>
          <div className='current-box'>

            <div>
              <label htmlFor='input'></label>
              <input type='text' id='input' value={this.state.city} onChange={this.onInputChane}></input>
              <button onClick={this.getWeatherData}>go</button><span className={this.state.load}>Loading..</span>
            </div>

            <div className='current-main'>
              <div>
                <img src={iconSrc} alt='icon'></img> <br />
                <div className='cur-wthdics'>{this.state.weather.current.weather[0].description}</div>
              </div>
              <div className='current-temp'>
                {Math.round(this.state.weather.current.temp)}&#8451;
              <div className='feels-like'>(feels like {Math.round(this.state.weather.current.feels_like)}&#8451;)</div>
              </div>
            </div>

            <div className='current-sec'>

              <div className='current-details'>
                <div>Wind speen:</div>
                <div> {this.state.weather.current.wind_speed} m/sec</div>
                <div>Pressure: </div>
                <div>{this.state.weather.current.pressure} hPa</div>
                <div>Cloudiness: </div>
                <div>{this.state.weather.current.clouds}%</div>
                {/* <div>Pressure:{}</div> */}
              </div>

            </div>


          </div>
          <div className='hourly-box'>
            <table>

              <tbody>
                <tr>
                  {thMas}
                </tr>
                <tr>
                  {tdMas}
                </tr>
              </tbody>
            </table>
          </div>
          <div className='daily-box'>
            {dailyMas}
          </div>

        </div>
      )
    }
  }

}

ReactDOM.render(
  <WeatherApp />,
  document.getElementById('root')
)
