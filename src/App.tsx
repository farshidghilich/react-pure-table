import React, { useState } from 'react';
import { Container, Row, Navbar, Nav, NavDropdown, Col, Table, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
interface MyData {
	[key: string]: string;
}
const App = () => {
	const [jsonData, setJsonData] = useState<MyData[] | null>(null);
	const [filters, setFilters] = useState<{ [key: string]: string }>({});
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [globalSearch, setGlobalSearch] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const parsedData = JSON.parse(e.target?.result as string) as MyData[];
					setJsonData(parsedData);
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			};

			reader.readAsText(file);
		}
	};

	const handleFilterChange = (key: string, value: string) => {
		setFilters({
			...filters,
			[key]: value,
		});
	};

	const handleSort = (column: string) => {
		setSortColumn(column);
	};

	const filterAndSortData = () => {
		let filteredData = jsonData || [];

		if (Object.keys(filters).length > 0) {
			filteredData = filteredData.filter((item) => {
				return Object.keys(filters).every((key) => {
					const value = item[key];
					const lowerCaseValue = String(value).toLowerCase();
					return lowerCaseValue.includes(filters[key].toLowerCase());
				});
			});
		}

		if (globalSearch) {
			filteredData = filteredData.filter((item) =>
				Object.values(item).some((value) => {
					const lowerCaseValue = String(value).toLowerCase();
					return lowerCaseValue.includes(globalSearch.toLowerCase());
				}),
			);
		}

		if (sortColumn) {
			filteredData.sort((a, b) => String(a[sortColumn]).localeCompare(String(b[sortColumn])));
		}

		return filteredData;
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedData = filterAndSortData().slice(startIndex, endIndex);
	const generatePageNumbers = () => {
		const pageCount = Math.ceil(jsonData.length / itemsPerPage);
		return Array.from({ length: pageCount }, (_, index) => index + 1);
	};
	return (
		<>
			<Navbar
				collapseOnSelect
				expand='lg'
				bg='dark'
				data-bs-theme='dark'>
				<Container>
					<Navbar.Brand href='#home'>React-PureTable</Navbar.Brand>
					<Navbar.Toggle aria-controls='responsive-navbar-nav' />
					<Navbar.Collapse id='responsive-navbar-nav'>
						<Nav className='me-auto'>
							<Nav.Link href='#features'>Features</Nav.Link>
							<Nav.Link href='#pricing'>Pricing</Nav.Link>
							<NavDropdown
								title='Dropdown'
								id='collapsible-nav-dropdown'>
								<NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						<Nav>
							<Nav.Link href='#deets'>More deets</Nav.Link>
							<Nav.Link
								eventKey={2}
								href='#memes'>
								Dank memes
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Container className='mt-4'>
				{' '}
				<Row>
					<Col lg={12}>
						<Form.Group className='my-3'>
							<Form.Label>لطفا فایل جیسون خود را آپلود کنید</Form.Label>
							<Form.Control
								type='file'
								onChange={handleFileChange}
							/>
						</Form.Group>
						<Form.Group className='my-3'>
							<Form.Control
								type='text'
								placeholder='Global Search'
								value={globalSearch}
								onChange={(e) => setGlobalSearch(e.target.value)}
							/>
						</Form.Group>

						{jsonData && (
							<>
								<Table
									striped
									bordered
									hover>
									<thead>
										<tr>
											{Object.keys(jsonData[0]).map((key) => (
												<th key={key}>
													<Button
														variant='link'
														onClick={() => handleSort(key)}
														style={{ padding: 0, marginLeft: '5px' }}>
														{sortColumn === key ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
													</Button>
													<Form.Control
														type='text'
														placeholder={`Filter ${key}`}
														value={filters[key] || ''}
														onChange={(e) => handleFilterChange(key, e.target.value)}
													/>
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{paginatedData.map((item, index) => (
											<tr
												key={index}
												className='fade-in'>
												{Object.values(item).map((value, idx) => (
													<td key={idx}>{value}</td>
												))}
											</tr>
										))}
									</tbody>
								</Table>
							</>
						)}
						<Form.Group>
							<Button
								variant='secondary'
								onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}>
								Previous
							</Button>{' '}
							{jsonData &&
								generatePageNumbers().map((pageNumber) => (
									<Button
										key={pageNumber}
										variant={pageNumber === currentPage ? 'primary' : 'secondary'}
										onClick={() => setCurrentPage(pageNumber)}>
										{pageNumber}
									</Button>
								))}
							<Button
								variant='secondary'
								onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
								Next
							</Button>
						</Form.Group>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default App;
