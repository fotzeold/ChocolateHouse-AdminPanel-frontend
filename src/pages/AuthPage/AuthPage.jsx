import "./AuthPage.scss"
import { login } from "../../services/service"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
	const [inpFields, setInpFields] = useState({
		login: "",
		password: ""
	})
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const handleFormSubmit = (event) => {
		event.preventDefault()

		login(inpFields).then(data => {
			if (data.status) {
				navigate("/dashboard", { replace: true })
			}
		}).catch(error => setErrorMessage(error.message))
	}

	return (
		<main className="auth">

			<div className="auth__wrapper">
				<h1>Store panel</h1>

				<form onSubmit={handleFormSubmit}>
					<input
						type="text"
						placeholder="Логін"
						onChange={(event) => setInpFields(prev => ({ ...prev, login: event.target.value }))}
						value={inpFields.login}
						required
					/>
					<input
						type="password"
						placeholder="Пароль"
						onChange={(event) => setInpFields(prev => ({ ...prev, password: event.target.value }))}
						value={inpFields.password}
						required
					/>
					{errorMessage && <p>{errorMessage}</p>}
					<button className="btn">Увійти</button>
				</form>
			</div>

			<a href="#" className="auth__author">developed by Forze Studio</a>
		</main>
	)
}

export default AuthPage