import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AlertMessage from "./AlertMessage";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../utils/timestamp";

const url = "wss://6cfeyea75f.execute-api.us-east-1.amazonaws.com/production/";
const LOCAL_STORAGE_KEY = "real-time-alerts";
const IGNORED_PATHS = ["/upgrades", "/faq", "/contact-us", "/settings", "/terms", "/privacy"];

type AlertItem = {
  alert_id: string;
  timestamp: string;
  site_name: string;
  unit_name: string;
  project_id: string;
  site_id: string;
  project_name: string;
  unit_id: string;
};

type AlertData = {
  action: string;
  item: AlertItem;
};

const AlertSocket: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<AlertData[]>(() => {
    const storedAlerts = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  });

  useEffect(() => {
    const socket = new WebSocket(url);

    // const sendMessage = () => {
    //   const randomMessage = {
    //     action: "send_notification",
    //     data: {
    //       type: "active_alerts",
    //       data: {
    //         action: "ADD",
    //         item: {
    //           alert_id: `test-${Math.floor(Math.random() * 1000)}`,
    //           timestamp: new Date().toISOString(),
    //           site_name: "Test Site",
    //           unit_name: "Test Unit",
    //           project_id: "0",
    //           site_id: "0",
    //           project_name: "Test Project",
    //           unit_id: "0",
    //         },
    //       },
    //     },
    //   };

    //   if (socket.readyState === WebSocket.OPEN) {
    //     socket.send(JSON.stringify(randomMessage));
    //     console.log("Message sent to WebSocket:", JSON.stringify(randomMessage));
    //   }
    // };

    // Initial message on mount
    // sendMessage();

    // Set up interval for every 10 minutes
    // const messageInterval = setInterval(() => {
    //   if (socket.readyState === WebSocket.OPEN) {
    //     sendMessage();
    //   } else {
    //     console.log("WebSocket is not open; retrying...");
    //   }
    // }, 10 * 60 * 1000);

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      try {
        const parsedData: { type: string; data: AlertData } = JSON.parse(event.data);
        if (parsedData.type === "active_alerts") {
          const formattedData = {
            ...parsedData.data,
            item: {
              ...parsedData.data.item,
              timestamp: formatDate(parsedData.data.item.timestamp),
            },
          };

          setMessages((prevMessages) => {
            const updatedMessages = [formattedData, ...prevMessages];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.onclose = () => console.log("WebSocket disconnected");

    socket.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      // clearInterval(messageInterval);
      socket.close();
    };
  }, []);

  const handleCloseAlert = (index: number) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((_, i) => i !== index);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const shouldShowAlerts = !IGNORED_PATHS.includes(location.pathname);

  return shouldShowAlerts && messages.length > 0 ? (
    <Box sx={{ paddingX: { xs: "16px", sm: "24px" }, paddingTop: { xs: "16px", sm: "24px" }, paddingBottom: 0 }}>
      {messages.map((message, index) => (
        <Box key={index} sx={{ marginBottom: index < messages.length - 1 ? "8px" : 0 }}>
          <AlertMessage
            title={
              <>
                <strong>{message.item.timestamp}</strong> {message.item.site_name}
              </>
            }
            description={message.item.alert_id}
            show={true}
            setShow={(show) => {
              if (!show) {
                handleCloseAlert(index);
              }
            }}
          />
        </Box>
      ))}
    </Box>
  ) : null;
};

export default AlertSocket;
