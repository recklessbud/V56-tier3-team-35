import {FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Box,
  // Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { SurgeryModal } from "./SurgeryModal";
import { SideBar } from "./SideBar";
import '../../utils/cssFiles/landingPage.css'
import { SurgeryCard } from "./SugeryCard";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "../../api/patient.api";
import { Patient } from "../../types/types";


export const SurgeryDashboard = () => {
   const [currentPage, setCurrentPage] = React.useState(1);
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  // const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);


  const fetchData = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  })


  const PatientData = fetchData.data?.data ? fetchData.data.data : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredSurgeries = PatientData.filter((surgery: any) => {
    const matchesSearch =
      (surgery.first_name + " " + surgery.last_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      surgery.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.patient_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || surgery.status === statusFilter;
 
    return matchesSearch && matchesStatus;
  });
  
    const itemsPerPage = 6;
    const paginatedSurgeries = filteredSurgeries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredSurgeries.length / itemsPerPage);

    
    React.useEffect(() => {
      if (currentPage > totalPages) setCurrentPage(1);
    }, [filteredSurgeries, totalPages, currentPage]);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)", // equivalent of bg-gradient-subtle
        padding: 6,
      }}
    >
      <SideBar />
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Header */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: { lg: "space-between" },
            alignItems: { lg: "center" },
            gap: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg, #3b82f6, #4a90e2)", // mimicking bg-gradient-primary
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Surgery Status Dashboard
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", marginTop: 1 }}
            >
              {currentTime.toLocaleDateString()} •{" "}
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <SurgeryModal />
          </Box>
        </Box>
        {/*"filters and selects"*/}
        <Card
          sx={{
            boxShadow: "gray",
            borderRadius: 3,
            border: "1px solid gray",
            width: "100%",
          }}
        >
          <CardHeader
            title={
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <FilterAltOutlined color="primary" fontSize="medium" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Filters & Search
                </Typography>
              </Box>
            }
          />

          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* search input */}
              <Box
                sx={{
                  flex: 1,
                  border: "none",
                  position: "relative",
                  width: { xs: "100%" },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search patients, procedures, or surgeons......"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    // pl: 5, // pl-10 = spacing(5) = 40px
                    height: "3rem", // h-12
                    fontSize: "1rem", // text-base
                    "& .MuiOutlinedInput-root": {
                      border: "1px solid",
                      borderRadius: "15px",
                      borderColor: "#60a5fa",

                      "&:hover fieldset": {
                        borderColor: "green",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#60a5fa", // focus:border-primary
                      },
                    },
                  }}
                />
              </Box>
              {/* status filter */}
              <FormControl fullWidth sx={{ width: { xs: "100%", lg: 150 } }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* cards and grid*/}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Active Surgeries({filteredSurgeries.length})
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedSurgeries.map((surgery: Patient) => (
              <SurgeryCard
                key={surgery.patient_number}
                surgery={surgery}
                showMenu
                showName
                showContact
              />
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
