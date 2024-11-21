import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthPage from "../pages/AuthPage/AuthPage"
import ProtectedRoute from "./ProtectedRoute"
import DashboardPage from "../pages/DashboardPage/DashboardPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import CategoriesPage from "../pages/CategoriesPage/CategoriesPage"
import GalleryPage from "../pages/GalleryPage/GalleryPage"

import CategoryFormPage from "../pages/FormsPage/CategoryFormPage"
import ProductFormPage from "../pages/FormsPage/ProductFormPage"

const App = () => {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AuthPage />} />
				<Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/gallery" element={<ProtectedRoute element={<GalleryPage />} />} />
				<Route path="/products" element={<ProtectedRoute element={<ProductsPage />} />} />
				<Route path="/products/new" element={<ProtectedRoute element={<ProductFormPage />} />} />
				<Route path="/products/:id" element={<ProtectedRoute element={<ProductFormPage />} />} />
				<Route path="/categories" element={<ProtectedRoute element={<CategoriesPage />} />} />
				<Route path="/categories/new" element={<ProtectedRoute element={<CategoryFormPage />} />} />
				<Route path="/categories/:id" element={<ProtectedRoute element={<CategoryFormPage />} />} />
				<Route path="/orders" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/clients" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/comments" element={<ProtectedRoute element={<DashboardPage />} />} />
				<Route path="/employees" element={<ProtectedRoute element={<DashboardPage />} />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App