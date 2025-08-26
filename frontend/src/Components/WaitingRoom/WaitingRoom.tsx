import React from 'react'
import '../../utils/cssFiles/landingPage.css'
import { Badge, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from '@mui/material';
import {Clock, Heart, User} from 'lucide-react';
import { MobileView } from './MobileView';
import { useQuery } from '@tanstack/react-query';
import { getAllPatients } from '../../api/patient.api';
import { Patient } from '../../types/types';




const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "delayed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};



  function useIsMobile() {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    return isMobile;
}

export const WaitingRoom = () => {

    const fetchData = useQuery({
      queryKey: ["patients"],
      queryFn: getAllPatients,
    });

    // Debug logging

    const PatientData = fetchData.data?.data ? fetchData.data.data : [];

    const [currentTime, setCurrentTime] = React.useState(new Date());
    const surgeries = PatientData;
    const [currentPage, setCurrentPage] = React.useState(0);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(surgeries.length / itemsPerPage);


    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 30000);
      return () => clearInterval(timer);
    }, []);


    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 10000);
      return () => clearInterval(timer);
    }, [totalPages]);

    // trigger full page reload
    React.useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 200000);
    return () => clearInterval(interval);
  }, []);


  const activeSurgeries = surgeries.filter(
    (surgery: Patient) => surgery.status !== "cancelled"
  );

  const paginatedSurgeries = activeSurgeries.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const isMobile = useIsMobile();

  if (fetchData.isLoading) {
    return <div>Loading...</div>;
  }

  
  if(fetchData.isError || activeSurgeries.length === 0){ 
    return <div className='flex justify-center items-center min-h-screen bg-gradient-subtle p-4 sm:p-6'>
          <Card className="border-2 ">
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-black">
                     No active surgeries today.
                </p>
            </CardContent>
          </Card>
        </div>
  }
  if (isMobile) {
    return <MobileView />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center font-bold items-center text-blue-400  gap-3 mb-4">
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xlbg-clip-text">
              Surgery Update Board
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg sm:text-xl lg:text-2xl text-gray-600/40">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="transition-all duration-300">
              {currentTime.toLocaleDateString()} •{" "}
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-600/70 mb-8 animate-fade-in">
            Today's Surgery Schedule
          </h2>

          <div className="hidden lg:block bg-card rounded-lg shadow-card border-1 border-gray-300 overflow-hidden animate-scale-in">
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                          p: 3,
                        }}
                      >
                        Patient
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                          p: 3,
                        }}
                      >
                        Procedure
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                          p: 3,
                        }}
                      >
                        Surgeon/Room
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                          p: 3,
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                          p: 3,
                        }}
                      >
                        Time
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 170 }}
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "hsl(215, 25%, 15%)",
                        }}
                      >
                        Family Contact
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedSurgeries.map((surgery: Patient) => (
                      <TableRow
                        key={surgery.patient_number}
                        sx={{
                          borderBottom: "1px solid rgba(0,0,0,0.12)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)",
                            transform: "scale(1.01)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <div className="space-y-1">
                            <div
                              className="text-lg font-bold"
                              style={{ color: "hsl(215, 25%, 15%)" }}
                            >
                              {surgery.patient_number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <div className="space-y-1">
                            <div className="text-lg">{surgery.procedure}</div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <div className="space-y-1">
                            <div
                              className="text-lg"
                              style={{ color: "hsl(215, 25%, 15%)" }}
                            >
                              {surgery.surgeon}
                            </div>
                            <div className="text-sm text-gray-400/70">
                              {surgery.room}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <Badge
                            className={`${getStatusColor(
                              surgery.status
                            )} text-sm px-6  font-semibold transition-all duration-300 hover:scale-105`}
                            sx={{ borderRadius: "50px" }}
                          >
                            <span className="p-3">
                              {surgery.status.charAt(0).toUpperCase() +
                                surgery.status.slice(1)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <div className="space-y-1">
                            {surgery.status !== "completed" && (
                              <>
                                <div className="text-lg font-semibold text-black">
                                  {new Date(
                                    surgery.created_at
                                  ).toLocaleTimeString()}
                                </div>
                                <div className="text-sm text-black">
                                  Est:{" "}
                                  {(() => {
                                    const startTime = new Date(
                                      surgery.created_at
                                    );
                                    const endTime = new Date(
                                      startTime.getTime() +
                                        surgery.duration * 60 * 60 * 1000
                                    );
                                    return endTime.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    });
                                  })()}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Duration: {surgery.duration}h
                                </div>
                              </>
                            )}
                            {surgery.status === "completed" && <div className="text-lg font-semibold text-black">
                              {surgery.status.charAt(0).toUpperCase() +
                                surgery.status.slice(1)}
                            </div>
                            }
                          </div>
                        </TableCell>
                        <TableCell sx={{ padding: "1.5rem" }}>
                          <div className="space-y-1">
                            <div
                              className="text-lg font-semibold"
                              style={{ color: "hsl(215, 25%, 15%)" }}
                            >
                              {surgery.contact_name}
                            </div>
                            <div className="text-sm text-gray-400/70">
                              {surgery.phone_number}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>

        <div className="flex justify-center items-center gap-1 animate-fade-in">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                index === currentPage
                  ? "bg-blue-400 scale-125 shadow-lg"
                  : "bg-blue-950 hover:bg-gray-600/40 scale-100"
              }`}
            />
          ))}
        </div>

        <div className="text-center pt-8 animate-fade-in">
          <p className="text-base sm:text-lg">
            For questions or concerns, please speak with the front desk staff.
          </p>
          <p className="text-xs sm:text-sm mt-2">
            This display updates automatically • Page {currentPage + 1} of{" "}
            {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
}