import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { IContractor, useDeleteContractorLicense } from "@gqlOps/contractor";
import Text from "@reusable/Text";
import { iconCircleSX } from "@/styles/sxStyles";
import UserAddLicense from "./UserAddLicense";
import DeleteModal from "@reusable/DeleteModal";

interface Props {
  onClose: () => void;
  contractor: IContractor;
}
export default function UserLicenseEdit({ contractor, onClose }: Props) {
  const theme = useTheme();
  const licenses = contractor?.licenses;
  const { deleteContLicAsync, loading: deleteLoading } =
    useDeleteContractorLicense();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const deleteLicense = () => {
    setOpenDelete(false);
    deleteContLicAsync({
      variables: { licId: selectedId, contId: contractor.id },
      onSuccess: () =>
        toast.success("License deleted successfully!", {
          position: "bottom-right",
        }),
    });
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  return (
    <>
      {!showAdd &&
        licenses.map((li, i) => (
          <Stack key={li.id}>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Text sx={{ mb: 1, fontWeight: 450 }}>{li.name}</Text>
              <IconButton
                size="small"
                onClick={() => handleDelete(li.id)}
                disabled={deleteLoading}
              >
                {selectedId === li.id && deleteLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DeleteIcon sx={iconCircleSX(theme)} />
                )}
              </IconButton>
            </Stack>
            <img
              src={li.url}
              alt={li.name}
              loading="lazy"
              style={{ width: 250, borderRadius: 8 }}
            />
            {licenses?.length !== i + 1 && <Divider sx={{ my: 2 }} />}
          </Stack>
        ))}

      {showAdd ? (
        <UserAddLicense contractor={contractor} onClose={onClose} />
      ) : (
        <Button
          variant="contained"
          onClick={() => setShowAdd(true)}
          fullWidth
          sx={{ mt: 4 }}
        >
          +Add New License
        </Button>
      )}
      <DeleteModal
        open={openDelete}
        onClose={setOpenDelete}
        onDelete={deleteLicense}
      />
    </>
  );
}
