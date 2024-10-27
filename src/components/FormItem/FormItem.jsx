import { Link, useNavigate, useParams } from "react-router-dom";
import { postData, putData, getData } from "../../services/service";
import { useState, useEffect } from "react";
import showNotification from "../../utils/notification";
import "./FormItem.scss"

const FormItem = ({
	endpoint,
	returnPath,
	title,
	fields,
	messages = {
		createSuccess: "Запис створено!",
		updateSuccess: "Запис оновлено!",
		error: "Щось пішло не так...",
		loadError: "Помилка завантаження даних"
	},
	customLoadTransform,
	customSaveTransform,
	onFileUpload
}) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const initialState = fields.reduce((acc, field) => {
		if (field.type === 'checkbox') {
			acc[field.name] = field.defaultChecked || false;
		} else if (field.type === 'radio') {
			acc[field.name] = field.defaultValue || '';
		} else if (field.type === 'select') {
			acc[field.name] = field.defaultValue || '';
		} else if (field.type === 'file') {
			acc[field.name] = null;
		} else {
			acc[field.name] = field.defaultValue || "";
		}
		return acc;
	}, {});

	const [formData, setFormData] = useState(initialState);
	const [filePreview, setFilePreview] = useState({});

	useEffect(() => {
		if (id) {
			loadData();
		}
	}, [id]);

	const loadData = async () => {
		try {
			const data = await getData(`${endpoint}/${id}`);
			if (data.status) {
				const transformedData = customLoadTransform
					? customLoadTransform(data.result)
					: data.result;
				setFormData(transformedData);
			}
		} catch (error) {
			showNotification(messages.loadError, "error");
			navigate(returnPath);
		}
	};

	const handleFileChange = async (name, file) => {
		if (file) {
			setFilePreview(prev => ({
				...prev,
				[name]: URL.createObjectURL(file)
			}));

			if (onFileUpload) {
				try {
					const fileUrl = await onFileUpload(file);
					handleInputChange(name, fileUrl);
				} catch (error) {
					showNotification("Помилка завантаження файлу", "error");
				}
			} else {
				handleInputChange(name, file);
			}
		}
	};

	const sendData = async () => {
		try {
			const dataToSend = customSaveTransform
				? customSaveTransform(formData)
				: formData;

			let result;
			if (id) {
				result = await putData(`${endpoint}/${id}`, dataToSend);
			} else {
				result = await postData(endpoint, dataToSend);
			}

			if (result.status) {
				showNotification(
					id ? messages.updateSuccess : messages.createSuccess,
					"success"
				);
				navigate(returnPath);
			} else {
				showNotification(messages.error, "error");
			}
		} catch (error) {
			showNotification(messages.error, "error");
		}
	};

	const handleFormSend = (event) => {
		event.preventDefault();
		sendData();
	};

	const handleInputChange = (name, value) => {
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const renderField = (field) => {
		switch (field.type) {
			case 'textarea':
				return (
					<textarea
						id={field.name}
						className="txt-area"
						value={formData[field.name]}
						onChange={(e) => handleInputChange(field.name, e.target.value)}
						placeholder={field.placeholder}
						required={field.required}
					/>
				);

			case 'select':
				return (
					<select
						id={field.name}
						className="select"
						value={formData[field.name]}
						onChange={(e) => handleInputChange(field.name, e.target.value)}
						required={field.required}
					>
						{field.placeholder && (
							<option value="" disabled>{field.placeholder}</option>
						)}
						{field.options.map((option) => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				);

			case 'checkbox':
				return (
					<input
						id={field.name}
						type="checkbox"
						className="checkbox"
						checked={formData[field.name]}
						onChange={(e) => handleInputChange(field.name, e.target.checked)}
					/>
				);

			case 'radio':
				return (
					<div className="radio-group">
						{field.options.map((option) => (
							<label key={option.value} className="radio-label">
								<input
									type="radio"
									name={field.name}
									value={option.value}
									checked={formData[field.name] === option.value}
									onChange={(e) => handleInputChange(field.name, e.target.value)}
									className="radio"
								/>
								{option.label}
							</label>
						))}
					</div>
				);

			case 'file':
				return (
					<div className="file-input-container">
						<input
							id={field.name}
							type="file"
							className="file-input"
							accept={field.accept}
							onChange={(e) => handleFileChange(field.name, e.target.files[0])}
							required={field.required}
						/>
						{filePreview[field.name] && field.showPreview && (
							<div className="file-preview">
								{field.accept?.includes('image/') ? (
									<img
										src={filePreview[field.name]}
										alt="Preview"
										className="image-preview"
									/>
								) : (
									<div className="file-name">
										Файл обрано
									</div>
								)}
							</div>
						)}
					</div>
				);

			default:
				return (
					<input
						id={field.name}
						className="inp"
						type={field.type || "text"}
						value={formData[field.name]}
						onChange={(e) => handleInputChange(field.name, e.target.value)}
						placeholder={field.placeholder}
						required={field.required}
					/>
				);
		}
	};

	return (
		<section className="form-page">
			<h1>
				<Link to={returnPath}>⬅︎ Назад</Link>
			</h1>
			<h2>{id ? `Редагувати ${title}` : `Створити ${title}`}</h2>

			<form onSubmit={handleFormSend}>
				{fields.map((field) => (
					<div key={field.name} className="form-group">
						<label className="lbl" htmlFor={field.name}>
							{field.label}
						</label>
						{renderField(field)}
					</div>
				))}

				<button className="btn">
					{id ? "Зберегти зміни" : "Створити"}
				</button>
			</form>
		</section>
	);
};

export default FormItem;