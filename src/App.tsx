import React, { useState, useEffect } from "react";
import { Container, Row, Navbar, Nav, NavDropdown, Col, Table, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faSort } from "@fortawesome/free-solid-svg-icons";

interface MyData {
  [key: string]: string;
}

const App = () => {
  const [jsonData, setJsonData] = useState<MyData[] | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string) as MyData[];
          setJsonData(parsedData);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
    setSortColumn(column);
  };

  const filterAndSortData = () => {
    let filteredData = jsonData || [];
    if (globalSearch) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) => {
          const lowerCaseValue = String(value).toLowerCase();
          return lowerCaseValue.includes(globalSearch.toLowerCase());
        })
      );
    }
    if (Object.keys(filters).length > 0) {
      filteredData = filteredData.filter((item) => {
        return Object.keys(filters).every((key) => {
          const value = item[key];
          const lowerCaseValue = String(value).toLowerCase();
          return lowerCaseValue.includes(filters[key].toLowerCase());
        });
      });
    }

    if (sortColumn) {
      const sortOrder = sortDirection === "asc" ? 1 : -1;

      filteredData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const isANumeric = !isNaN(parseFloat(aValue)) && isFinite(parseFloat(aValue));
        const isBNumeric = !isNaN(parseFloat(bValue)) && isFinite(parseFloat(bValue));

        if (isANumeric && isBNumeric) {
          return (parseFloat(aValue) - parseFloat(bValue)) * sortOrder;
        } else {
          return String(aValue).localeCompare(String(bValue)) * sortOrder;
        }
      });
    }

    return filteredData;
  };

  const filteredAndSortedData = filterAndSortData();
  const pageCount = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    const totalPages = Math.min(pageCount, maxVisiblePages);
    const startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    const endPage = Math.min(startPage + totalPages - 1, pageCount);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };
  useEffect(() => {

    setFilters({});
  }, [jsonData]);
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark"></Navbar>
      <Container className="mt-4">
        <Row>
          <Col lg={12}>
            <Form.Group className="my-3">
              <Form.Label>لطفا فایل جیسون خود را آپلود کنید</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control type="text" placeholder="Global Search" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} />
            </Form.Group>

            {jsonData && (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {Object.keys(jsonData[0]).map((key) => (
                        <th key={key}>
                          <Button variant="link" onClick={() => handleSort(key)} style={{ padding: 0, marginLeft: "5px" }}>
                            {sortColumn === key && sortDirection === "asc" ? <FontAwesomeIcon icon={faSort} /> : <FontAwesomeIcon icon={faSort} />}
                          </Button>
                          <Form.Control type="text" placeholder={`Filter ${key}`} value={filters[key] || ""} onChange={(e) => handleFilterChange(key, e.target.value)} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => (
                      <tr key={index} className="fade-in">
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
              <Button variant="secondary" onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}>
                Previous
              </Button>{" "}
              {jsonData &&
                generatePageNumbers().map((pageNumber) => (
                  <Button key={pageNumber} variant={pageNumber === currentPage ? "primary" : "secondary"} onClick={() => setCurrentPage(pageNumber)}>
                    {pageNumber}
                  </Button>
                ))}
              <Button variant="secondary" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
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
