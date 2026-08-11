import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        success: {
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        },
      }}
    />
  );
};

export default Toast;