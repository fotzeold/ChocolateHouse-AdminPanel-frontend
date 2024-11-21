import FormItem from "../../components/FormItem/FormItem";
import { useState, useEffect } from "react";
import { getData } from "../../services/service";

const ProductFormPage = () => {
	const [categories, setCategories] = useState(null)

	// const handleFileUpload = async (file) => {
	// 	const formData = new FormData();
	// 	formData.append('file', file);
	// 	return uploadedFileUrl;
	// };

	const loadCategories = async () => {
		try {
			const data = await getData("categories")
			if (data.status) {
				setCategories(data.result)
			} else {
				setCategories(false)
			}
		} catch (error) {
			setCategories(false)
		}
	}

	useEffect(() => {
		if (!categories) {
			loadCategories()
		}
	}, [])

	if (!categories) return

	const fields = [
		{
			name: "image",
			type: "file",
			label: "Добавте фото",
			accept: "image/*",
			showPreview: true,
			required: true
		},
		{
			name: "name",
			label: "Назва товару",
			placeholder: "Введіть назву товару",
			required: true
		},
		{
			name: "price",
			label: "Ціна товару",
			placeholder: "Введіть ціну товару",
			required: true
		},
		{
			name: "discount",
			label: "Знижка на товар",
			placeholder: "Введіть знижку на товару",
		},
		{
			name: "category",
			type: "select",
			label: "Категорія",
			placeholder: "Оберіть категорію",
			options: categories.map(el => ({
				value: el._id, label: el.name
			})),
			required: true
		},
		{
			name: "info",
			type: "textarea",
			label: "Опис товару",
			placeholder: "Введіть опис товару"
		}
	];

	return (
		<FormItem
			endpoint="products"
			returnPath="/products"
			title="товар"
			fields={fields}
			// onFileUpload={handleFileUpload}
			messages={{
				createSuccess: "Товар створено!",
				updateSuccess: "Товар оновлено!",
				error: "Помилка при збереженні товару",
				loadError: "Помилка завантаження товару"
			}}
		/>
	);
};

export default ProductFormPage