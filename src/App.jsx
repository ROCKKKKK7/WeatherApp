import { useState } from "react";
import styles from "./App.module.css";
import iconMap from "./mapingicon.js";

const apiKey="842b2633b40c320ac50b9ceeaa858211"

function App() {
	const [darkMode, setDarkMode] = useState(true); // Смена темы
	const [loading, setLoading] = useState(false); // состояние загрузки
	const [city, setCity] = useState("");
	const [cities, setCities] = useState([]); // список найденных городов
	const [msg, setMsg] = useState("");
	const [unit, setUnit] = useState("C"); // смена C F
	const convertTemp = (temp) => {
		if (unit === "F") return Math.round((temp * 9) / 5 + 32);
		return temp;
	};

	// функция удаления
	const handleDelete = (dataName) => {
		setCities((prev) => prev.filter((c) => c.dataName !== dataName));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		let inputVal = city.trim();

		if (inputVal.includes(",")) {
			const parts = inputVal.split(",");
			if (parts[1].trim().length > 2) {
				inputVal = parts[0].trim();
			}
		}

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				if (data.cod === "404") {
					setMsg(" Город не найден");
					setLoading(false);
					return;
				}
				setMsg("");
				const { main, name, sys, weather, wind } = data;

				//защита от дубликатов
				const dataName = `${name},${sys.country}`.toLowerCase();
				const alreadyExists = cities.some(
					(c) => c.dataName === dataName,
				);
				if (alreadyExists) {
					setMsg(" Этот город уже добавлен");
					setLoading(false);
					return;
				}
				const icon = `/src/assets/${iconMap[weather[0].icon] || "weather.svg"}`;

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
						humidity: main.humidity,
						wind: Math.round(wind.speed),
						pressure: main.pressure,
					},
				]);
				// очищаем поле ввода
				setCity("");
			})
			.catch(() => {
				setMsg(" Город не найден");
			})
			.finally(() => setLoading(false));
	};

	// геолокация
	const handleGeoLocation = () => {
		if (!navigator.geolocation) {
			setMsg("Геолокация не поддерживается вашим браузером");
			return;
		}

		setMsg("Определяем местоположение...");
		setLoading(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						const { main, name, sys, weather, wind } = data;
						const dataName = `${name},${sys.country}`.toLowerCase();
						const alreadyExists = cities.some(
							(c) => c.dataName === dataName,
						);
						if (alreadyExists) {
							setMsg("Этот город уже добавлен");
							setLoading(false);
							return;
						}
						const icon = `/src/assets/${iconMap[weather[0].icon] || "weather.svg"}`;
						setCities((prev) => [
							...prev,
							{
								dataName,
								name,
								country: sys.country,
								temp: Math.round(main.temp),
								icon,
								description: weather[0].description,
								humidity: main.humidity,
								wind: Math.round(wind.speed),
								pressure: main.pressure,
							},
						]);
						setMsg("");
						setLoading(false);
					})
					.catch(() => setMsg("Не удалось получить погоду"));
			},
			() => {
				(setMsg("Не удалось определить местоположение"),
					setLoading(false));
			},
			{ timeout: 5000 },
		);
	};

	return (
		<div
			className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
		>
			<section className={styles.topBanner}>
				<h1 className={styles.heading}>Погода</h1>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Поиск города"
						autoFocus
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					<button
						type="submit"
						disabled={loading}
						className={styles.submitBtn}
					>
						{loading ? (
							<span className={styles.spinner}></span>
						) : (
							"ОТПРАВИТЬ"
						)}
					</button>
					<span className={styles.msg}>{msg}</span>
					<button
						type="button"
						className={styles.geoBtn}
						onClick={handleGeoLocation}
						disabled={loading}
					>
						{loading ? (
							<span className={styles.spinner}></span>
						) : (
							"Моё место"
						)}
					</button>
					<span className={styles.msg}>{msg}</span>
				</form>
				<div className={styles.unitToggle}>
					<button
						className={unit === "C" ? styles.activeUnit : ""}
						onClick={() => setUnit("C")}
					>
						°C
					</button>
					<span>|</span>
					<button
						className={unit === "F" ? styles.activeUnit : ""}
						onClick={() => setUnit("F")}
					>
						°F
					</button>
					<button
						className={styles.themeBtn}
						onClick={() => setDarkMode((prev) => !prev)}
					>
						{darkMode ? "Светлая" : "Тёмная"}
					</button>
				</div>
			</section>

			<section className={styles.ajaxSection}>
				<ul className={styles.cities}>
					{cities.map((c, index) => (
						<li key={index} className={styles.city}>
							<button
								className={styles.deleteBtn}
								onClick={() => handleDelete(c.dataName)}
							>
								✕
							</button>
							<h2 className={styles.cityName}>
								<span>{c.name}</span>
								<sup>{c.country}</sup>
							</h2>
							<div className={styles.cityTemp}>
								{convertTemp(c.temp)}
								<sup>°{unit}</sup>
							</div>
							<figure>
								<img
									className={styles.cityIcon}
									src={c.icon}
									alt={c.description}
								/>
								<figcaption>{c.description}</figcaption>
							</figure>
							<ul className={styles.cityDetails}>
								<li>
									Влажность: <strong>{c.humidity}%</strong>
								</li>
								<li>
									Ветер: <strong>{c.wind} м/с</strong>
								</li>
								<li>
									Давление: <strong>{c.pressure} гПа</strong>
								</li>
							</ul>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default App;
