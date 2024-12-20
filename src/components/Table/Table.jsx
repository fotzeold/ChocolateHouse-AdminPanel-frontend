import "./Table.scss";
import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Table = ({ title, data, columns, createLink, deleteInfo }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);
	const location = useLocation()

	const filteredData = data.filter(item => {
		return columns.some(col => {
			const cellValue = item[col.key] ? item[col.key].toString().toLowerCase() : '';
			return cellValue.includes(searchTerm.toLowerCase());
		});
	});

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const totalItems = filteredData.length;

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleInputChange = (e) => {
		const pageNumber = e.target.value;

		if (/^\d*$/.test(pageNumber)) {
			let newPageNumber = pageNumber === '' ? 1 : parseInt(pageNumber, 10);

			if (newPageNumber < 1) {
				newPageNumber = 1;
			}
			if (newPageNumber > totalPages) {
				newPageNumber = totalPages;
			}

			handlePageChange(newPageNumber);
			setCurrentPage(newPageNumber);
		}
	};

	const renderActionField = (id = "") => {
		return (
			<div className="table__action">
				<Link className="action-btn edit-btn" to={`${location.pathname}/${id}`}>
					<EditIcon />
				</Link>
				{
					deleteInfo &&
					<button className="action-btn delete-btn" onClick={() => deleteInfo(id)}>
						<DeleteIcon />
					</button>
				}
			</div>
		)
	}

	useEffect(() => {
		const handleResize = () => {
			const rowHeight = 36;
			const windowHeight = window.innerHeight;
			const maxItems = Math.floor((windowHeight - 130) / rowHeight);
			setItemsPerPage(maxItems > 0 ? maxItems : 1);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);


	return (
		<div className="table">
			<div className="table__top">
				<h1>{title}</h1>
				<input
					type="text"
					placeholder="Пошук..."
					className="inp"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{createLink && <Link to={createLink.path} className="btn create-btn">{createLink.label}</Link>}
			</div>
			<table border="1" cellPadding="10" cellSpacing="0">
				<thead>
					<tr>
						{columns.map((col, index) => (
							<th key={index + "-table-title"}>{col.label}</th>
						))}
					</tr>
				</thead>
				<tbody>

					{
						(!data || data.length === 0) ?
							<tr><td>No data available</td></tr> :
							currentItems.map((item, index) => (
								<tr key={index + "-table-tr"}>
									{
										columns.map((col, index) => {
											return (
												<td key={index + "-table-td"}>
													{col.type === "actionField" ? renderActionField(item._id) : (item[col.key] || '—')}
												</td>
											)
										})
									}
								</tr>
							))
					}
				</tbody>
			</table>
			<div className="table__bottom">
				<div className="table__pagination">
					<div className="table__pagination-info">
						<span>
							{(indexOfFirstItem + 1)} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
						</span>
					</div>
					<div className="table__pagination-pages">
						<button
							className={currentPage === 1 ? 'hide' : ''}
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							<ArrowBackIosNewIcon />
						</button>
						<input
							type="text"
							value={currentPage}
							onChange={handleInputChange}
							min="1"
							max={totalPages}
						/>
						<button
							className={currentPage === totalPages ? 'hide' : ''}
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							<ArrowForwardIosIcon />
						</button>
					</div>
				</div>
			</div>
		</div >
	);
};

export default Table;
