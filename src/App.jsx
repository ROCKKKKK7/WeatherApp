import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.module.css";

function App() {
	return;
	<>
		<div className={styles.container}>
			<section className={styles.topBanner}>
				<h1 className={styles.heading}>
					Простое приложение для прогноза погоды
				</h1>

				<form>
					<input type="text" placeholder="Поиск города" autoFocus />

					<button type="submit">ОТПРАВИТЬ</button>

					<span className={styles.msg}></span>
				</form>
			</section>

			<section className={styles.ajaxSection}>
				<ul className={styles.cities}></ul>
			</section>
        <li class="city">
          <h2 class="city-name" data-name="...">
            <span>...</span>
            <sup>...</sup>
          </h2>
          <span class="city-temp">...<sup>°C</sup></span>
          <figure>
            <img class="city-icon" src="..." alt="..."/>
            <figcaption>...</figcaption>
          </figure>
        </li>
		</div>
	</>;
}

export default App;
