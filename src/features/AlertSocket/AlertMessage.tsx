import { Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { Error, Close } from "@mui/icons-material";

interface AlertMessageProps {
  title: React.ReactNode; // Formatted title with timestamp already bolded
  description: string;
  isClose?: boolean;
  variant?: "filled" | "outlined" | "standard";
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function AlertMessage({
  title,
  description,
  isClose = true,
  variant = "filled",
  show,
  setShow,
}: AlertMessageProps) {
  return (
    <Collapse in={show}>
      <Alert
        icon={<Error fontSize="inherit" />}
        variant={variant}
        severity="error"
        action={
          isClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShow(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          )
        }
      >
        <AlertTitle>
          {title}
        </AlertTitle>
        {description}
      </Alert>
    </Collapse>
  );
}
