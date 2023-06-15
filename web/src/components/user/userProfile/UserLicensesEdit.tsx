import { Divider, Stack, Badge, Typography, Card } from "@mui/material";
import { useState } from "react";

import FileUpload, { IFile } from "@reusable/FileUpload";

interface IAllFiles extends IFile {
  id: string;
  fileName: string;
}
interface IFileUpload {
  fileData: IFile;
  fileName: string;
}

export default function UserLicensesEdit() {
  const [allFiles, setAllFiles] = useState<IAllFiles[]>([]);

  const onFile = ({ fileData, fileName }: IFileUpload) => {
    const id = Math.random().toString(36);
    setAllFiles((pv) => [...pv, { ...fileData, id, fileName: fileName }]);
    console.log({ ...fileData, id, fileName: fileName });
  };

  const onDeleteLicence = (id: string) => {
    setAllFiles((pv) => pv.filter((file) => file.id !== id));
  };

  return (
    <div>
      <FileUpload
        onFileUpload={onFile}
        title="Add Your Licenses and Certificates"
      />
      {allFiles?.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <div style={{ overflowX: "auto" }}>
            <Stack direction={"row"} spacing={1} sx={{ minWidth: "100%" }}>
              {allFiles.map((file) => (
                <Stack key={file.id}>
                  <Badge
                    badgeContent={
                      <Card
                        sx={{
                          boxShadow: 4,
                          borderRadius: 50,
                          px: 0.5,
                          cursor: "pointer",
                        }}
                        onClick={() => onDeleteLicence(file.id)}
                      >
                        <Typography>✖</Typography>
                      </Card>
                    }
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <embed
                      src={file.picture}
                      type={file.type}
                      width="75"
                      height="75"
                      style={{ borderRadius: 50 }}
                    />
                  </Badge>
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  >
                    {file.fileName.length > 6
                      ? `${file.fileName.slice(0, 6)}...`
                      : file.fileName}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </div>
        </>
      )}
    </div>
  );
}
