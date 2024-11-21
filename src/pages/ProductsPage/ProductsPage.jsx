import "./ProductsPage.scss"
import { useState, useEffect } from "react"
import { getData } from "../../services/service"
import { icons } from "../../utils/constants"
import Table from "../../components/Table/Table"

const ProductsPage = () => {
	const [products, setProducts] = useState(null)

	const columns = [
		{
			label: "Керування",
			key: "",
			type: "actionField"
		},
		{
			label: "Назва",
			key: "name"
		},
		{
			label: "Дата створення",
			key: "createAt"
		},
		{
			label: "Ціна",
			key: "price"
		},
		{
			label: "Знижка",
			key: "discount"
		},
		{
			label: "Категорія",
			key: "category"
		}
	]

	useEffect(() => {
		const getProducts = async () => {
			try {
				const data = await getData("products");
				if (data.status) {
					setProducts(data.result);
				} else {
					setProducts(false);
				}
			} catch (error) {
				setProducts(false);
			}
		};

		getProducts();
	}, [])

	if (products === null) return <img className="loader-spinner" src={icons.loaderIcon} alt="Loading..." />
	if (!products) return null

	return (
		<section className="products">
			<Table
				title={"Продукти"}
				columns={columns}
				data={products}
				createLink={{ label: "Додати продукт", path: "/products/new" }}
			/>
		</section>
	)
}

export default ProductsPage