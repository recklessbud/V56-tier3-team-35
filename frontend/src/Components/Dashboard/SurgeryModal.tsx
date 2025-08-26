import { Add, Close } from "@mui/icons-material";
// Removed react-hook-form and zodResolver, using only formData for state
import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Box,
  DialogActions,
  Button,
  Fab,
} from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createNewPatientSchema } from "../../utils/validateInput";
import { createPatientApi } from "../../api/patient.api";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { toast } from "react-toastify";

export const SurgeryModal = ({
  triggerButtonVariant = "button",
  triggerButtonText = "New Surgery",
}) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    street_address: "",
    phone_number: "",
    procedure: "",
    contact_name: "",
    surgeon: "",
    room: "OR-1",
    duration: "",
    status: "scheduled",
  });

  const createNewPatientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return createPatientApi(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient created successfully");
      setOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        street_address: "",
        phone_number: "",
        procedure: "",
        contact_name: "",
        surgeon: "",
        room: "OR-1",
        duration: "",
        status: "scheduled",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error creating patient");
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validate with zod
    const result = createNewPatientSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      toast.error(`Validation failed: ${errorMessages}`);
      return;
    }
    const phoneRegex =
      // eslint-disable-next-line no-useless-escape
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      toast.error("Invalid phone number format.");
      return;
    }
    const patientNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const newPatient = {
      ...formData,
      patient_number: patientNumber,
    };
    createNewPatientMutation.mutate(newPatient);
  };

  const renderTriggerButton = () => {
    if (triggerButtonVariant === "fab") {
      return (
        <Fab
          color="primary"
          aria-label="add surgery"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
            },
          }}
        >
          <Add />
        </Fab>
      );
    }

    return (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#1da1f2",
          color: "white",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "12px",
          paddingX: 3,
          paddingY: 1.2,
          "&:hover": {
            backgroundColor: "#1a91da",
          },
        }}
      >
        {triggerButtonText}
      </Button>
    );
  };

  return (
    <>
      {renderTriggerButton()}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              maxHeight: "90vh",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "blue",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              background: "linear-gradient(90deg, #3b82f6, #9333ea)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            Schedule New Surgery
          </Typography>
          <Close
            onClick={() => setOpen(false)}
            sx={{
              color: "black",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add a new surgery to the schedule. All fields are required.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  required
                  placeholder="eg; John"
                  variant="outlined"
                  value={formData.first_name}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  required
                  placeholder="eg; Doe"
                  variant="outlined"
                  value={formData.last_name}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth
                  label="Procedure"
                  name="procedure"
                  required
                  variant="outlined"
                  value={formData.procedure}
                  placeholder="eg; Laparoscopic Appendectomy"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("procedure", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Surgeon"
                  name="surgeon"
                  required
                  placeholder="eg; Dr. John Doe"
                  variant="outlined"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  value={formData.surgeon}
                  onChange={(e) => handleInputChange("surgeon", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.room}
                    onChange={(e) => handleInputChange("room", e.target.value)}
                    label="Room"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="OR-1">OR-1</MenuItem>
                    <MenuItem value="OR-2">OR-2</MenuItem>
                    <MenuItem value="OR-3">OR-3</MenuItem>
                    <MenuItem value="OR-4">OR-4</MenuItem>
                    <MenuItem value="OR-5">OR-5</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  required
                  type="number"
                  placeholder="eg; 2"
                  variant="outlined"
                  value={formData.duration}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  name="contact_name"
                  required
                  variant="outlined"
                  placeholder="eg; Jane Doe"
                  value={formData.contact_name}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("contact_name", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  required
                  variant="outlined"
                  placeholder="1234567890"
                  value={formData.phone_number}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="street_address"
                  required
                  variant="outlined"
                  placeholder="eg; 123 Main St, City, State, Zip"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                      },
                    },
                  }}
                  value={formData.street_address}
                  onChange={(e) =>
                    handleInputChange("street_address", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    sx={{
                      border: 0,
                      borderRadius: 2,
                    }}
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{
                backgroundColor: "red",
                color: "white",
                textTransform: "none",
                // fontWeight: 600,
                borderRadius: "12px",
                border: 0,
                paddingX: 3,
                paddingY: 1.2,
                "&:hover": {
                  opacity: 0.7,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1da1f2",
                color: "white",
                textTransform: "none",
                borderRadius: "12px",
                paddingX: 3,
                paddingY: 1.2,
                "&:hover": {
                  backgroundColor: "#1a91da",
                },
              }}
            >
              Schedule Surgery
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
