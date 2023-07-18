import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Button, Stack, Grid, Badge, Card } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { formatBytes, processImageFile } from "@/utils/utilFuncs";

interface IImgUpload {
  onImageUpload: (imgData: IImage) => void;
}
export interface IImage {
  id: string;
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
    padding: "5px",
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

export default function ImageUpload({ onImageUpload }: IImgUpload) {
  const [imgData, setImgData] = useState<IImage | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (imgData) {
      onImageUpload(imgData);
      setImgData(undefined);
    }
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        processImageFile({
          file,
          onSuccess: ({ imageUrl, fileSize }) => {
            setImgData({
              id: String(Math.random()),
              name: file.name,
              size: fileSize,
              type: file.type,
              picture: imageUrl,
            });
            resetFileInput();
          },
        });
      }
    }
  };

  const resetFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset the value of the input element
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
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImgUpload}
            style={{ display: "none" }}
            id="image-upload-input"
          />
          {imgData ? (
            <img
              src={imgData.picture}
              alt={imgData.name}
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
      <Button type="submit" fullWidth variant="contained">
        +Add
      </Button>
    </Stack>
  );
}

interface IShowImages {
  images: IImage[];
  setImages: (images: IImage[]) => void;
}
export const ShowImages = ({ images, setImages }: IShowImages) => {
  const onDelete = (id: IImage["id"]) => {
    setImages(images.filter((file) => file.id !== id));
  };

  return (
    <>
      <Grid container spacing={1}>
        {images?.map((img) => (
          <Grid item key={img.id}>
            <Stack direction={"column"}>
              <Badge
                sx={{ boxShadow: 4, borderRadius: 50 }}
                badgeContent={
                  <Card
                    sx={{
                      boxShadow: 4,
                      borderRadius: 50,
                      px: 0.5,
                      cursor: "pointer",
                    }}
                    onClick={() => onDelete(img.id)}
                  >
                    <Typography>✖</Typography>
                  </Card>
                }
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <img
                  src={img.picture}
                  alt={img.id}
                  width="75"
                  height="75"
                  style={{ borderRadius: 50 }}
                />
              </Badge>
              <Typography
                variant="caption"
                sx={{ textAlign: "center", color: "text.secondary" }}
              >
                {formatBytes(img.size)}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
