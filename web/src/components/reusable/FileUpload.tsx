import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Typography, TextField, Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { processImageFile } from "@/utils/utilFuncs";

interface IFileUpload {
  onFileUpload: (fileData: IFile) => void;
}
export interface IFile {
  name: string;
  size: number;
  type: string;
  desc: string;
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

export default function FileUpload({ onFileUpload }: IFileUpload) {
  const [fileData, setFileData] = useState<IFile | undefined>(undefined);
  const [fileDesc, setFileDesc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the input element

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

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (fileData) {
      onFileUpload({ ...fileData, desc: fileDesc });
      setFileData(undefined);
      setFileDesc("");
    }
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        processImageFile({
          file,
          onSuccess: ({ imageUrl, fileSize }) => {
            setFileData({
              name: file.name,
              size: fileSize,
              type: file.type,
              desc: fileDesc,
              picture: imageUrl,
            });
            resetFileInput();
          },
        });
      }
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the value of the input element
    }
  };

  return (
    <Stack spacing={2} component={"form"} onSubmit={handleFormSubmit}>
      <label htmlFor="image-upload-input">
        <DropzoneContainer
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          isDragging={isDragging}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="image-upload-input"
          />
          {fileData ? (
            <img
              src={fileData.picture}
              alt={fileData.name}
              loading="lazy"
              style={{ maxWidth: 350, maxHeight: 350 }}
            />
          ) : (
            <>
              <CloudUploadIcon sx={{ width: 120, height: 120 }} />
              <Typography variant="body1">
                {isDragging
                  ? "Drop the Image here"
                  : "Drag and drop Image or click to select"}
              </Typography>
            </>
          )}
        </DropzoneContainer>
      </label>
      <TextField
        label="Description (50 chars max)"
        placeholder="...image description"
        value={fileDesc}
        onChange={(e) => setFileDesc(e.target.value)}
        fullWidth
        required
        autoComplete="off"
        inputProps={{ maxLength: 50 }}
      />
      <Button type="submit" fullWidth variant="contained">
        +Add
      </Button>
    </Stack>
  );
}
