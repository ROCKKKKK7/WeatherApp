import { useState } from "react";
import styles from "./App.module.css";
import iconMap from "./mapingicon.js";
import weatherTranslations from "./weatherTranslations.js";
import translations from "./translations.js";

const apiKey = "842b2633b40c320ac50b9ceeaa858211";

function App() {
	const [lang, setLang] = useState("ru"); // смена языка
	const [darkMode, setDarkMode] = useState(true); // Смена темы
	const [loading, setLoading] = useState(false); // состояние загрузки
	const [city, setCity] = useState("");
	const [cities, setCities] = useState([]); // список найденных городов
	const [msg, setMsg] = useState("");
	const [unit, setUnit] = useState("C"); // смена C F
	const t = translations[lang];

	const convertTemp = (temp) => {
		if (unit === "F") return Math.round((temp * 9) / 5 + 32);
		return temp;
	};

	// функция превода
	const translateCity = async (name, targetLang) => {
		if (targetLang === "en") return name;
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric&lang=ru`;
		const res = await fetch(url);
		const data = await res.json();
		return data.name || name;
	};
	// обновление карточки при смене языка
	const handleLangChange = async (newLang) => {
		setLang(newLang);
		setMsg("");
		const updated = await Promise.all(
			cities.map(async (c) => {
				const translatedName = await translateCity(
					c.originalName,
					newLang,
				);
				return { ...c, name: translatedName };
			}),
		);
		setCities(updated);
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

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

		fetch(url)
			.then((response) => response.json())
			.then(async (data) => {
				if (data.cod === "404") {
					setMsg(t.cityNotFound);
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
					setMsg(t.cityExists);
					setLoading(false);
					return;
				}
				const icon = iconMap[weather[0].icon] || weatherFallback;

				const translatedName = await translateCity(name, lang);
				// добавляем новый город в список
				setCities((prev) => [
					...prev,
					{
						dataName,
						originalName: name,
						name: translatedName,
						country: sys.country,
						temp: Math.round(main.temp),
						icon,
						description: weather[0].description,
						humidity: main.humidity,
						wind: Math.round(wind.speed),
						pressure: main.pressure,
					},
				]);
				// очистка поле ввода
				setCity("");
			})
			.catch(() => {
				setMsg(t.cityNotFound);
			})
			.finally(() => setLoading(false));
	};

	// геолокация
	const handleGeoLocation = () => {
		if (!navigator.geolocation) {
			setMsg(t.geoNotSupported);
			return;
		}
		setMsg(t.geoLoading); // ← было t.geoError
		setLoading(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
				fetch(url)
					.then((response) => response.json())
					.then(async (data) => {
						const { main, name, sys, weather, wind } = data;
						const dataName = `${name},${sys.country}`.toLowerCase();
						const alreadyExists = cities.some(
							(c) => c.dataName === dataName,
						);
						if (alreadyExists) {
							setMsg(t.cityExists);
							setLoading(false);
							return;
						}
						const translatedName = await translateCity(name, lang);
						const icon =
							iconMap[weather[0].icon] || weatherFallback;
						setCities((prev) => [
							...prev,
							{
								dataName,
								originalName: name,
								name: translatedName, // ← убрал дубль
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
					.catch(() => {
						setMsg(t.cityNotFound);
						setLoading(false);
					});
			},
			() => {
				setMsg(t.geoError); // ← было geoLoading, исправил
				setLoading(false);
			},
			{ timeout: 5000 },
		);
	};

	return (
		<div
			className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
		>
			<section className={styles.topBanner}>
				<h1 className={styles.heading}>{t.title}</h1>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder={t.placeholder}
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
							t.submit
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
							t.geo
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
						{darkMode ? t.lightTheme : t.darkTheme}
					</button>
					<button
						className={styles.themeBtn}
						onClick={() =>
							handleLangChange(lang === "ru" ? "en" : "ru")
						}
					>
						{lang === "ru" ? "EN" : "RU"}
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
								<figcaption>
									{" "}
									{lang === "ru"
										? (
												weatherTranslations[
													c.description.toLowerCase()
												] || c.description
											).toUpperCase()
										: c.description.toUpperCase()}
								</figcaption>
							</figure>
							<ul className={styles.cityDetails}>
								<li>
									{t.humidity}: <strong>{c.humidity}%</strong>
								</li>
								<li>
									{t.wind}:{" "}
									<strong>
										{c.wind} {t.windUnit}
									</strong>
								</li>
								<li>
									{t.pressure}:{" "}
									<strong>
										{c.pressure} {t.pressureUnit}
									</strong>
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
