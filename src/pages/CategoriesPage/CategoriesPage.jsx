import "./CategoriesPage.scss"
import { useState, useEffect } from "react"
import { getData, deleteData } from "../../services/service"
import { icons } from "../../utils/constants"
import Table from "../../components/Table/Table"
import showNotification from "../../utils/notification"

const CategoriesPage = () => {
	const [categories, setCategories] = useState(null)

	const columns = [
		{
			label: "Керування",
			type: "actionField"
		},
		{
			label: "Категорія",
			key: "name"
		}
	]

	const deleteCategory = async (id) => {
		try {
			let data = await deleteData(`categories/${id}`)

			if (data.status) {
				showNotification("Категорію видалено!", "success");
				setCategories((prevCategories) => prevCategories.filter(category => category._id !== id));
			} else {
				showNotification("Щось пішло не так...", "error");
			}
		} catch (error) {
			showNotification("Щось пішло не так...", "error");
		}
	}

	useEffect(() => {
		const getCategories = async () => {
			try {
				const data = await getData("categories");
				if (data.status) {
					setCategories(data.result);
				} else {
					setCategories(false);
				}
			} catch (error) {
				setCategories(false);
			}
		};

		getCategories();
	}, [])

	if (categories === null) return <img src={icons.loaderIcon} alt="Loading..." />
	if (!categories) return null

	return (
		<section className="categories">
			<Table
				title={"Категорії"}
				columns={columns}
				data={categories}
				createLink={{ label: "Нова категорія", path: "/categories/new" }}
				deleteInfo={deleteCategory}
			/>
		</section>
	)
}

export default CategoriesPage