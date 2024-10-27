import axios from "axios"
const _BASE_URL = "http://localhost:5000/"
const _API_KEY = process.env.REACT_APP_API_KEY

async function login(data) {
	const url = _BASE_URL + "admin/login";

	try {
		const response = await axios.post(url, { ...data, type: "employee" }, {
			headers: {
				'Content-Type': 'application/json',
				'api-key': _API_KEY
			}
		});

		sessionStorage.setItem('token', response.data.token);

		return response.data
	} catch (error) {
		throw error.response ? error.response.data : new Error(error.message);

	}
}

async function verif() {
	const url = _BASE_URL + "admin/verif";

	try {
		const token = sessionStorage.getItem("token")

		if (!token) throw new Error("Токена немає!");

		console.log(token)

		const response = await axios.post(url, {}, {
			headers: {
				'Content-Type': 'application/json',
				'api-key': _API_KEY,
				"Authorization": `Bearer ${token}`
			}
		});

		return response.data
	} catch (error) {
		console.log(error)
		throw error.response ? error.response.data : new Error(error.message);

	}
}

async function getData(route, isToken = false) {
	const url = _BASE_URL + route;

	try {
		const headers = {
			'Content-Type': 'application/json',
			'api-key': _API_KEY,
		};

		if (isToken) {
			const token = sessionStorage.getItem('token');
			if (!token) throw new Error("Токена немає!");
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await axios.get(url, { headers });

		return response.data
	} catch (error) {
		throw error.response ? error.response.data : new Error(error.message);
	}
}

async function postData(route, data) {
	const url = _BASE_URL + route;

	try {
		const token = sessionStorage.getItem('token');
		if (!token) throw new Error("Токена немає!");

		const headers = {
			'Content-Type': 'application/json',
			'api-key': _API_KEY,
			'Authorization': `Bearer ${token}`
		};

		const response = await axios.post(url, data, { headers });

		return response.data
	} catch (error) {
		throw error.response ? error.response.data : new Error(error.message);
	}
}

async function putData(route, data) {
	const url = _BASE_URL + route;

	try {
		const token = sessionStorage.getItem('token');
		if (!token) throw new Error("Токена немає!");

		const headers = {
			'Content-Type': 'application/json',
			'api-key': _API_KEY,
			'Authorization': `Bearer ${token}`
		};

		const response = await axios.put(url, data, { headers });

		return response.data
	} catch (error) {
		throw error.response ? error.response.data : new Error(error.message);
	}
}

async function deleteData(route) {
	const url = _BASE_URL + route;

	try {
		const token = sessionStorage.getItem('token');
		if (!token) throw new Error("Токена немає!");

		const headers = {
			'Content-Type': 'application/json',
			'api-key': _API_KEY,
			'Authorization': `Bearer ${token}`
		};

		const response = await axios.delete(url, { headers });

		return response.data
	} catch (error) {
		throw error.response ? error.response.data : new Error(error.message);
	}
}

export { login, verif, getData, postData, putData, deleteData }

