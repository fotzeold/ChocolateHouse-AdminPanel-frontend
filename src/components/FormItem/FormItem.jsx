import { Link, useNavigate, useParams } from "react-router-dom";
import { postData, putData, getData } from "../../services/service";
import { useState, useEffect, useRef } from "react";
import { icons } from "../../utils/constants";
import showNotification from "../../utils/notification";
import DeleteIcon from '@mui/icons-material/Delete';
import "./FormItem.scss";

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
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(!!id);
	const fileInputRefs = useRef({});

	const initialState = fields.reduce((acc, field) => {
		if (field.type === 'checkbox') {
			acc[field.name] = field.defaultChecked || false;
		} else if (field.type === 'radio') {
			acc[field.name] = field.defaultValue || '';
		} else if (field.type === 'select') {
			acc[field.name] = field.defaultValue || '';
		} else if (field.type === 'file') {
			acc[field.name] = Array(5).fill(null);
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

				const newFormData = { ...transformedData };
				const newFilePreview = { ...filePreview };

				fields.forEach(field => {
					if (field.type === 'file') {
						const existingImages = Array.isArray(transformedData[field.name])
							? transformedData[field.name]
							: transformedData[field.name]
								? [transformedData[field.name]]
								: [];

						newFormData[field.name] = Array(5).fill(null)
							.map((_, index) => existingImages[index] || null);

						newFilePreview[field.name] = {};
						existingImages.forEach((url, index) => {
							if (url) {
								newFilePreview[field.name][index] = url;
							}
						});
					}
				});

				setFormData(newFormData);
				setFilePreview(newFilePreview);
			}
		} catch (error) {
			showNotification(messages.loadError, "error");
			navigate(returnPath);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (name, file, index) => {
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setFilePreview(prev => ({
				...prev,
				[name]: { ...prev[name], [index]: previewUrl }
			}));

			setFormData(prev => {
				const newFiles = [...prev[name]];
				newFiles[index] = file;
				return { ...prev, [name]: newFiles };
			});
		}
	};

	// const handleFileChange = async (name, file, index) => {
	// 	if (file) {

	// 		console.log(file)

	// 		const previewUrl = URL.createObjectURL(file);
	// 		setFilePreview(prev => ({
	// 			...prev,
	// 			[name]: {
	// 				...prev[name],
	// 				[index]: previewUrl
	// 			}
	// 		}));

	// 		if (onFileUpload) {
	// 			try {
	// 				const fileUrl = await onFileUpload(file);
	// 				handleInputChange(name, formData[name].map((item, i) =>
	// 					i === index ? fileUrl : item
	// 				));
	// 			} catch (error) {
	// 				setFilePreview(prev => {
	// 					const newPreviews = { ...prev };
	// 					if (newPreviews[name]) {
	// 						delete newPreviews[name][index];
	// 					}
	// 					return newPreviews;
	// 				});
	// 				showNotification("Помилка завантаження файлу", "error");
	// 			}
	// 		} else {
	// 			setFormData(prev => {
	// 				const newFiles = [...prev[name]];
	// 				newFiles[index] = file; // или fileUrl в случае onFileUpload
	// 				return {
	// 					...prev,
	// 					[name]: newFiles
	// 				};
	// 			});
	// 		}
	// 	}
	// };

	const handleRemoveFile = (name, index) => {
		if (filePreview[name]?.[index]) {
			URL.revokeObjectURL(filePreview[name][index]);
		}

		setFilePreview(prev => {
			const newPreviews = { ...prev };
			if (newPreviews[name]) {
				delete newPreviews[name][index];
			}
			return newPreviews;
		});

		if (fileInputRefs.current[`${name}-${index}`]) {
			fileInputRefs.current[`${name}-${index}`].value = "";
		}

		handleInputChange(
			name,
			formData[name].map((item, i) => i === index ? null : item)
		);
	};

	const sendData = async () => {
		try {
			const formDataToSend = new FormData();

			// Добавляем в formDataToSend все поля
			Object.keys(formData).forEach((key) => {
				if (Array.isArray(formData[key])) {
					// Если это массив (например, файлы), добавляем каждый файл отдельно
					formData[key].forEach((item) => {
						if (item) formDataToSend.append(key, item); // только если item не null
					});
				} else {
					formDataToSend.append(key, formData[key]);
				}
			});

			// Отправка данных через postData или putData
			let result;
			if (id) {
				result = await putData(`${endpoint}/${id}`, formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
			} else {
				result = await postData(endpoint, formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
			}

			if (result.status) {
				showNotification(id ? messages.updateSuccess : messages.createSuccess, "success");
				navigate(returnPath);
			} else {
				showNotification(messages.error, "error");
			}
		} catch (error) {
			showNotification(messages.error, "error");
		}
	};

	// const sendData = async () => {
	// 	try {
	// 		const preparedData = { ...formData };
	// 		fields.forEach(field => {
	// 			if (field.type === 'file' && Array.isArray(preparedData[field.name])) {
	// 				preparedData[field.name] = preparedData[field.name].filter(item => item !== null);
	// 			}
	// 		});

	// 		const dataToSend = customSaveTransform
	// 			? customSaveTransform(preparedData)
	// 			: preparedData;

	// 		let result;

	// 		console.log(dataToSend)

	// 		if (id) {
	// 			result = await putData(`${endpoint}/${id}`, dataToSend);
	// 		} else {
	// 			result = await postData(endpoint, dataToSend);
	// 		}

	// 		if (result.status) {
	// 			showNotification(
	// 				id ? messages.updateSuccess : messages.createSuccess,
	// 				"success"
	// 			);
	// 			navigate(returnPath);
	// 		} else {
	// 			showNotification(messages.error, "error");
	// 		}
	// 	} catch (error) {
	// 		showNotification(messages.error, "error");
	// 	}
	// };

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
			case 'file':
				return (
					<div className="file-inputs-container">
						{Array(5).fill(null).map((_, index) => (
							<div key={index} className="file-input-wrapper">
								<div className="file-input-container">
									<input
										ref={el => fileInputRefs.current[`${field.name}-${index}`] = el}
										id={`${field.name}-${index}`}
										type="file"
										className="file-input"
										accept={field.accept}
										onChange={(e) => handleFileChange(field.name, e.target.files[0], index)}
										required={field.required && index === 0 && !filePreview[field.name]?.[index]}
									/>
									{filePreview[field.name]?.[index] && field.showPreview && (
										<div className="file-preview">
											{field.accept?.includes('image/') ? (
												<div className="image-preview-container">
													<img
														src={filePreview[field.name][index]}
														alt={`Preview ${index + 1}`}
														className="image-preview"
													/>
													<button
														type="button"
														className="remove-image"
														onClick={() => handleRemoveFile(field.name, index)}
													>
														<DeleteIcon />
													</button>
												</div>
											) : (
												<div className="file-name">
													<button
														type="button"
														className="remove-file"
														onClick={() => handleRemoveFile(field.name, index)}
													>
														<DeleteIcon />
													</button>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				);

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

	if (isLoading) {
		return (
			<section className="form-page">
				<h1>
					<Link to={returnPath}>⬅︎ Назад</Link>
				</h1>
				<img className="loader-spinner" src={icons.loaderIcon} alt="Loading..." />
			</section>
		);
	}

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