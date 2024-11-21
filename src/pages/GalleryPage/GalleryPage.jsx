import "./GalleryPage.scss";
import { useState, useEffect } from "react";
import { getData } from "../../services/service";

const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const GalleryPage = () => {

	// const [currFile, setCurrFile] = useState("")
	const [uploadData, setUploadData] = useState(null);


	useEffect(() => {
		const generateSignature = async () => {
			try {
				const data = await getData("cloudinary/generate-signature")
				setUploadData(data)
			} catch (error) {
				console.log(error)
			}
		}

		generateSignature()
	}, [])

	const handleInputChange = async (event) => {
		const file = event.target.files[0];
		console.log(file);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", uploadData.uploadPreset); // Используйте переменную окружения
		formData.append("api_key", uploadData.apiKey);
		formData.append("signature", uploadData.signature);
		formData.append("timestamp", uploadData.timestamp);

		try {
			let res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
				method: "POST",
				body: formData,
			});

			let data = await res.json();
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section className="gallery">
			<input
				// value={currFile}
				onChange={handleInputChange}
				type="file"
			/>
		</section>
	);
};

export default GalleryPage;
