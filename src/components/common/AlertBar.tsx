import { Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { Close, Error } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from "react";

interface AlertBarProps {
  severity: any;
  title?: any;
  description: any;
  isClose?: boolean;
  variant?: any;
  show?: boolean;
  setShow: any;
}
export default function AlertBar({ severity, title, description, isClose = true, variant = "filled", show, setShow }: AlertBarProps) {
  const autoCloseMessages = ["Password successfully reset.", "You were logged out due to inactivity. ", "Password updated."];

  useEffect(() => {
    if (show && isClose && ((description && autoCloseMessages.includes(description)) || (title && autoCloseMessages.includes(title)))) {
      const timer = setTimeout(() => {
        setShow(false);
        clearTimeout(timer);
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [show, description, title]);

  return (
    <Collapse in={show}>
      <Alert
        icon={severity === "error" ? <Error fontSize="inherit" /> :
          severity === "success" ? <CheckCircleIcon fontSize="inherit" /> :
            severity === "info" ? <InfoIcon fontSize="inherit" /> :
              undefined}
        variant={variant}
        severity={severity}
        action={
          isClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShow(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          )
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {description}
      </Alert>
    </Collapse>
  );
}
