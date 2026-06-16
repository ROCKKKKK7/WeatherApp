import { useState } from "react";
import styles from "./App.module.css";

const apiKey = import.meta.env.VITE_API_KEY;

function App() {
	const [city, setCity] = useState("");

	const handleSubmit = (e) => {
	e.preventDefault();
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
		console.log(data); // посмотри что приходит в консоли
		})
		.catch(() => {
		console.log("Город не найден");
		});
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
						<span className={styles.cityTemp}>
							25<sup>°C</sup>
						</span>
						<figure>
							<img
								className={styles.cityIcon}
								src=""
								alt="weather"
							/>
							<figcaption>Ясно</figcaption>
						</figure>
					</li>
				</ul>
			</section>
		</div>
	);
}

export default App;
