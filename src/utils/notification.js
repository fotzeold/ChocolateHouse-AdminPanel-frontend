import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showNotification = (message, type = "info", time = 3000) => {
	switch (type) {
		case "success":
			toast.success(message, { autoClose: time });
			break;
		case "error":
			toast.error(message, { autoClose: time });
			break;
		case "info":
			toast.info(message, { autoClose: time });
			break;
		case "warning":
			toast.warning(message, { autoClose: time });
			break;
		default:
			toast(message, { autoClose: time });
	}
};

export default showNotification