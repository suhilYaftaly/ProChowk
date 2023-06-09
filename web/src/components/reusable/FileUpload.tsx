import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Typography, TextField, Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { processImageFile } from "@/utils/utilFuncs";

interface IFileUpload {
  title?: string;
  onFileUpload: ({
    fileData,
    fileName,
  }: {
    fileData: IFile;
    fileName: string;
  }) => void;
}
export interface IFile {
  name: string;
  size: number;
  type: string;
  picture: string;
}

const DropzoneContainer = styled("div")<{ isDragging: boolean }>(
  ({ theme, isDragging }) => ({
    border: isDragging
      ? `2px dashed ${theme.palette.primary.main}`
      : "2px dashed gray",
    borderRadius: "4px",
    padding: "16px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isDragging
      ? `${theme.palette.primary.main}33`
      : `${theme.palette.primary.main}0D`,
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}33`,
    },
  })
);

export default function FileUpload({ title, onFileUpload }: IFileUpload) {
  const [fileData, setFileData] = useState<IFile | undefined>(undefined);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //limit to 30 chars only
    const inputValue = event.target.value;
    const limitedValue = inputValue.slice(0, 30);
    setFileName(limitedValue);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (fileData) {
      onFileUpload({ fileData: fileData, fileName: fileName });
      setFileData(undefined);
      setFileName("");
    }
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (isImage || isPdf) {
        processImageFile(file, (imageUrl) => {
          setFileData({
            name: file.name,
            size: file.size,
            type: file.type,
            picture: imageUrl,
          });
        });
      }
    }
  };

  return (
    <Stack spacing={2} component={"form"} onSubmit={handleFormSubmit}>
      {title && (
        <Typography variant="h5" textAlign={"center"}>
          {title}
        </Typography>
      )}
      <label htmlFor="image-upload-input">
        <DropzoneContainer
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          isDragging={isDragging}
        >
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="image-upload-input"
          />
          {fileData ? (
            <>
              {fileData.type.startsWith("image/") ? (
                <img
                  src={fileData.picture}
                  alt={fileData.name}
                  loading="lazy"
                  style={{ maxWidth: 350, maxHeight: 350 }}
                />
              ) : (
                <embed
                  src={fileData.picture}
                  width="350"
                  height="350"
                  type={fileData.type}
                />
              )}
            </>
          ) : (
            <>
              <CloudUploadIcon sx={{ width: 120, height: 120 }} />
              <Typography variant="body1">
                {isDragging
                  ? "Drop the Image/PDF here"
                  : "Drag and drop Image/PDF or click to select"}
              </Typography>
            </>
          )}
        </DropzoneContainer>
      </label>
      <TextField
        label="Name (30 chars max)"
        placeholder="...image name"
        value={fileName}
        onChange={handleFileNameChange}
        fullWidth
        required
        autoComplete="off"
      />
      <Button type="submit" fullWidth variant="contained">
        +Add
      </Button>
    </Stack>
  );
}
