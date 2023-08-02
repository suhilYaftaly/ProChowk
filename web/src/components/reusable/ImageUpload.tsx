import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Stack, Grid, Badge, Card } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { formatBytes, processImageFile } from "@/utils/utilFuncs";

interface IImgUpload {
  onImageUpload: (imgData: IImage) => void;
}
export interface IImage {
  id?: string;
  name?: string;
  size: number;
  type?: string;
  url: string;
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

  const processFile = (file: File | undefined) => {
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        processImageFile({
          file,
          onSuccess: ({ imageUrl, fileSize }) => {
            const img = {
              name: file.name,
              size: fileSize,
              type: file.type,
              url: imageUrl,
            };
            onImageUpload(img);
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
    <Stack spacing={2} component={"form"}>
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
          <>
            <CloudUploadIcon sx={{ width: 100, height: 100 }} />
            <Typography variant="body1">
              {isDragging
                ? "Drop the Image here"
                : "Drag and drop Image or click to select"}
            </Typography>
          </>
        </DropzoneContainer>
      </label>
    </Stack>
  );
}

interface IShowImages {
  images: IImage[];
  setImages: (images: IImage[]) => void;
  setDeletedImgId?: (id: string) => void;
}
export const ShowImages = ({
  images,
  setImages,
  setDeletedImgId,
}: IShowImages) => {
  const onDelete = (index: number) => {
    const imgId = images?.[index]?.id;
    if (imgId && setDeletedImgId) setDeletedImgId(imgId);
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <Grid container spacing={1}>
        {images?.map((img, i) => (
          <Grid item key={i}>
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
                    onClick={() => onDelete(i)}
                  >
                    <Typography>✖</Typography>
                  </Card>
                }
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <img
                  src={img.url}
                  alt={img.name}
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
