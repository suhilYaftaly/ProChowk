import { ChangeEvent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TableSortLabel,
  Checkbox,
  CircularProgress,
  TablePagination,
  Button,
  Tooltip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";

import { ILog, useDeleteLogs, useLogs } from "@gqlOps/log";
import CenteredStack from "@reusable/CenteredStack";
import { ppx } from "@config/configConst";
import { useUserStates } from "@redux/reduxStates";
import { isAdmin, isDeveloper } from "@utils/auth";

type OrderBy = { [key in FieldNames]?: "asc" | "desc" };

export default function Logs() {
  const { user } = useUserStates();
  const navigate = useNavigate();
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>({
    timestamp: "desc",
    level: "asc",
    message: "asc",
    "user name": "asc",
    "user email": "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [localSortedData, setLocalSortedData] = useState<ILog[]>([]);

  const { logsAsync, data, loading } = useLogs();
  const { deleteLogsAsync } = useDeleteLogs();
  const logsVars = {
    skip: page * rowsPerPage,
    take: rowsPerPage,
    orderBy: orderBy.timestamp,
  };

  //restrict access to dev & above roles
  useEffect(() => {
    if (user && !isDeveloper(user?.roles)) navigate("/");
  }, [user, navigate]);

  //make initial call
  useEffect(() => {
    if (user && isDeveloper(user?.roles)) {
      logsAsync({ variables: logsVars });
    }
  }, [user, page, rowsPerPage, orderBy]);

  //set sorted data
  useEffect(() => {
    if (data?.logs?.logs) setLocalSortedData([...data.logs.logs]);
  }, [data]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedLogs = localSortedData.map((log) => log.id);
      setSelectedLogs(newSelectedLogs);
    } else setSelectedLogs([]);
  };

  const handleSelect = (log: ILog) => {
    const newSelectedLogs = selectedLogs.includes(log.id)
      ? selectedLogs.filter((id: string) => id !== log.id)
      : [...selectedLogs, log.id];

    setSelectedLogs(newSelectedLogs);
  };

  const deleteSelected = () => {
    const selectedLogObjects = localSortedData.filter((log) =>
      selectedLogs.includes(log.id)
    );
    deleteLogsAsync({
      variables: { logs: selectedLogObjects },
      onSuccess: () => setSelectedLogs([]),
      logsCacheVars: logsVars,
    });
  };

  const handleSort = (field: FieldNames) => {
    const newOrderBy = orderBy[field] === "desc" ? "asc" : "desc";
    setOrderBy((pv) => ({ ...pv, [field]: newOrderBy }));
    if (field === "timestamp") {
      logsAsync({ variables: { ...logsVars, orderBy: newOrderBy } });
    } else {
      const sortedData = [...localSortedData].sort((a, b) => {
        const valA = safeAccessor(a, field);
        const valB = safeAccessor(b, field);
        return newOrderBy === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
      setLocalSortedData(sortedData);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const chipColor = (level: ILog["level"]) => {
    switch (level) {
      case "error":
        return "error";
      case "info":
        return "info";
      case "warn":
        return "warning";
      case "log":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <CenteredStack mx={ppx}>
      {loading ? (
        <CircularProgress size={150} sx={{ p: 2, alignSelf: "center" }} />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {isAdmin(user?.roles) && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedLogs.length > 0 &&
                          selectedLogs.length < localSortedData.length
                        }
                        checked={
                          localSortedData.length > 0 &&
                          selectedLogs.length === localSortedData.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={orderBy.timestamp}
                      onClick={() => handleSort("timestamp")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={orderBy.level}
                      onClick={() => handleSort("level")}
                    >
                      Level
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={orderBy.message}
                      onClick={() => handleSort("message")}
                    >
                      Message
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={orderBy["user name"]}
                      onClick={() => handleSort("user name")}
                    >
                      User Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={true}
                      direction={orderBy["user email"]}
                      onClick={() => handleSort("user email")}
                    >
                      User Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Meta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localSortedData?.map((log) => (
                  <TableRow key={log.id}>
                    {isAdmin(user?.roles) && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => handleSelect(log)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={log.level}
                        color={chipColor(log.level)}
                      />
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log?.meta?.user?.name}</TableCell>
                    <TableCell>{log?.meta?.user?.email}</TableCell>
                    <TableCell>
                      <Accordion sx={{ maxWidth: 70 }}>
                        <AccordionSummary>View Meta...</AccordionSummary>
                        <AccordionDetails>
                          <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={data?.logs?.total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          {isAdmin(user?.roles) && (
            <Tooltip title="Warning, deletion is permanent!" arrow>
              <span style={{ alignSelf: "flex-end" }}>
                <Button
                  disabled={selectedLogs?.length < 1}
                  onClick={deleteSelected}
                  color="error"
                  startIcon={<DeleteForeverIcon sx={{ mb: 0.3 }} />}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Delete Selected Logs
                </Button>
              </span>
            </Tooltip>
          )}
        </>
      )}
    </CenteredStack>
  );
}

type FieldNames =
  | "timestamp"
  | "level"
  | "message"
  | "user name"
  | "user email";
function safeAccessor(log: ILog, field: FieldNames): string {
  if (field === "timestamp") return new Date(log.timestamp).toLocaleString();
  if (field === "level") return log.level;
  if (field === "message") return log.message;
  if (field === "user name") return log?.meta?.user?.name || "";
  if (field === "user email") return log?.meta?.user?.email || "";
  return "";
}
