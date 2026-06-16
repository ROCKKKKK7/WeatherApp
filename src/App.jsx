import { useState } from "react";
import "./App.module.css";

function App() {
	const [city, setCity] = useState("");

	const handleSumbit = (e) => {
		e.preventDefault();
		console.log(city);
	};

  return (
    <div className={styles.container}>
      <section className={styles.topBanner}>
        <h1 className={styles.heading}>
          Простое приложение для прогноза погоды
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Поиск города"
            autoFocus
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">ОТПРАВИТЬ</button>
          <span className={styles.msg}></span>
        </form>
      </section>

      <section className={styles.ajaxSection}>
        <ul className={styles.cities}>
          <li className={styles.city}>
            <h2 className={styles.cityName}>
              <span>Город</span>
              <sup>UA</sup>
            </h2>
            <span className={styles.cityTemp}>25<sup>°C</sup></span>
            <figure>
              <img className={styles.cityIcon} src="" alt="погода" />
              <figcaption>Ясно</figcaption>
            </figure>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default App;
