import { useState, useEffect } from "react"
import { icons } from "../utils/constants"
import Sidebar from "./Sidebar/Sidebar"
import { verif } from "../services/service"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ element }) => {
	const [user, setUser] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const verifyUser = async () => {
			try {
				const data = await verif();
				if (data.status) {
					setUser(data.result);
				} else {
					setUser(false);
				}
			} catch (error) {
				setUser(false);
			}
		};

		verifyUser();
	}, [])

	const handleLogout = () => {
		sessionStorage.clear()
		navigate("/", { replace: true })
	}

	if (user === null) return <img src={icons.loaderIcon} alt="Loading..." />

	if (!user) {
		handleLogout()
		return null
	}

	return (
		<div className="app" style={{ display: "flex" }}>
			<Sidebar logout={handleLogout} />
			<main style={{ padding: "10px 20px 6px 20px", width: "100%" }}>
				{element}
			</main>
		</div>
	)
}

export default ProtectedRoute