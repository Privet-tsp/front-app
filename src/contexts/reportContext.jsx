import { useContext, createContext, useState } from "react";

const ReportContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
  reportUser: null,
  setReportUser: () => {},
});

const ReportContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportUser, setReportUser] = useState(null);
  return (
    <ReportContext.Provider
      value={{ isOpen, setIsOpen, reportUser, setReportUser }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContextProvider;

export const useReportContext = () => useContext(ReportContext);
