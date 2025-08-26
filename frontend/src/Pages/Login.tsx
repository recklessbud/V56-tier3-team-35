/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from '../api/auth.api'
// import AppTheme from "../shared-theme/AppTheme";
import AppTheme from "../theme/AppTheme";
import { Heart } from "lucide-react";
import { IconButton, Snackbar } from "@mui/material";
import { Close } from "@mui/icons-material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function Login(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [email, setEmail] = React.useState('')
  const [showTestAccounts, setShowTestAccounts] = React.useState(true);
  const [password, setPassword] = React.useState('')
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();


  const loginMutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onSuccess: (data: any) => { 
        toast.success("Login Successful")
        setEmail("");
        setPassword("");
        setIsLoading(false);
        
        if(data && data.token) {
          localStorage.setItem('token', data.token) 
          navigate('/dashboard')
        }
  
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
        const message = error?.response?.data?.message || "Could not Login User.. Invalid Credentials";
        toast.error(message)
        setIsLoading(false);
    }
  })


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);
    loginMutation.mutate()
  };

  const validateInputs = () => {

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showTestAccounts}
        onClose={() => setShowTestAccounts(false)}
        message={
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Test Admin Account
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> bureck400@gmail.com
              <br />
              <strong>Password:</strong> dummyPassword124
            </Typography>
          </Box>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShowTestAccounts(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          mt: 2,
          mr: 2,
          maxWidth: 320,
          "& .MuiSnackbarContent-root": {
            background: "#f5f5f5",
            color: "#222",
            border: "1px solid #1da1f2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          },
        }}
      />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <div className="flex  text-blue-400  gap-3 ">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
            <h4 className="text-2xl sm:text-1xl lg:text-2xl font-medium bg-clip-text">
              SurgeryMs
            </h4>
          </div>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(1rem, 5vw, 1.15rem)",
              color: "#1da1f2",
            }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="contained"
              sx={{ backgroundColor: "#1da1f2 !important", color: "white" }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                  Signing in...
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
