import FormItem from "../../components/FormItem/FormItem";

const CategoryFormPage = () => {

	const fields = [
		{
			name: "name",
			label: "Назва категорії",
			placeholder: "Введіть назву категорії",
			required: true
		},
		{
			name: "info",
			type: "textarea",
			label: "Опис категорії",
			placeholder: "Введіть опис категорії"
		}
	];

	return <FormItem
		endpoint="categories"
		returnPath="/categories"
		title="категорію"
		fields={fields}
		messages={{
			createSuccess: "Категорію створено!",
			updateSuccess: "Категорію оновлено!",
			error: "Помилка при збереженні категорії",
			loadError: "Помилка завантаження категорії"
		}}
	/>
}

export default CategoryFormPage