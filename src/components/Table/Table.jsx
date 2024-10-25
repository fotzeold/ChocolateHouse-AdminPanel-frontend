import "./Table.scss";
import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Table = ({ title, data, columns }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);

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



	if (!data || data.length === 0) {
		return <p>No data available</p>;
	}

	return (
		<div className="table">
			<div className="table__top">
				<h1>{title}</h1>
				<input
					type="text"
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
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
					{currentItems.map((item, index) => (
						<tr key={index + "-table-tr"}>
							{columns.map((col, index) => (
								<td key={index + "-table-td"}>{item[col.key] || '—'}</td>
							))}
						</tr>
					))}
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
		</div>
	);
};

export default Table;
