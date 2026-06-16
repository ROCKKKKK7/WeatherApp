import { useState } from "react";
import styles from "./App.module.css";

const apiKey = import.meta.env.VITE_API_KEY;

function App() {
	const [city, setCity] = useState("");
	// список найденных городов
	const [cities, setCities] = useState([]);
	const [msg, setMsg] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				if (data.cod === "404") {
					setMsg(" Город не найден");
					return;
				}
				setMsg("");
				const { main, name, sys, weather } = data;

				//защита от дубликатов
				const dataName = `${name},${sys.country}`.toLowerCase();
				const alreadyExists = cities.some(c => c.dataName === dataName);
					if (alreadyExists) {
						setMsg("Этот город уже добавлен");
						return;
					}
				const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

				// добавляем новый город в список
				setCities((prev) => [
					...prev,
					{
						dataName,
						name,
						country: sys.country,
						temp: Math.round(main.temp),
						icon,
						description: weather[0].description,
					},
				]);
				// очищаем поле ввода
				setCity("");
			})
			.catch(() => {
				setMsg(" Город не найден");
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
					<button type="submit">ОТПРАВИТЬ </button>
					<span className={styles.msg}>{msg}</span>
				</form>
			</section>

			<section className={styles.ajaxSection}>
				<ul className={styles.cities}>
					{cities.map((c, index) => (
						<li key={index} className={styles.city}>
							<h2 className={styles.cityName}>
								<span>{c.name}</span>
								<sup>{c.country}</sup>
							</h2>
							<div className={styles.cityTemp}>
								{c.temp}
								<sup>°C</sup>
							</div>
							<figure>
								<img
									className={styles.cityIcon}
									src={c.icon}
									alt={c.description}
								/>
								<figcaption>{c.description}</figcaption>
							</figure>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default App;
