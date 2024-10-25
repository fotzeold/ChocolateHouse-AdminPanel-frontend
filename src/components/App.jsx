import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthPage from "../pages/AuthPage/AuthPage"
import ProtectedRoute from "./ProtectedRoute"
import DashboardPage from "../pages/DashboardPage/DashboardPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"

const App = () => {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AuthPage />} />
				<Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/products" element={<ProtectedRoute element={<ProductsPage />} />} />
				<Route path="/orders" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/clients" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/comments" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/employees" element={<ProtectedRoute element={<DashboardPage />} />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App