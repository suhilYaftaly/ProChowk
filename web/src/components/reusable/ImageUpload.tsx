import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { SxProps, Theme, styled } from "@mui/material/styles";
import { Stack, Grid, Badge, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { formatBytes, processImageFile } from "@/utils/utilFuncs";
import Text from "./Text";

interface IImgUpload {
  onImageUpload: (imgData: IImage[]) => void;
  caption?: string;
  /**error text */
  helperText?: string;
}
export interface IImage {
  id?: string;
  name?: string;
  size: number;
  type?: string;
  url: string;
}

const DropzoneContainer = styled("div")<{
  isDragging: boolean;
  error: boolean;
}>(({ theme, isDragging, error }) => ({
  border: isDragging
    ? `2px dashed ${theme.palette.primary.main}`
    : `2px dashed ${error ? theme.palette.error.main : "grey"}`,
  borderRadius: "4px",
  padding: "5px",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: isDragging
    ? `${theme.palette.primary.main}33`
    : `${theme.palette.background.default}`,
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}33`,
  },
}));

export default function ImageUpload({
  onImageUpload,
  caption,
  helperText,
}: IImgUpload) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImgUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) processFiles(files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) processFiles(files);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>, dragging: boolean) => {
    event.preventDefault();
    setIsDragging(dragging);
  };

  const resetFileInput = () =>
    inputRef.current && (inputRef.current.value = "");

  const processFiles = (files: FileList) => {
    const processedImages: IImage[] = [];
    Array.from(files).forEach((file) => {
      processImageFile({
        file,
        onSuccess: ({ imageUrl, fileSize }) => {
          const img = {
            name: file.name,
            size: fileSize,
            type: file.type,
            url: imageUrl,
          };
          processedImages.push(img);
          if (processedImages.length === files.length) {
            onImageUpload(processedImages);
            resetFileInput();
          }
        },
      });
    });
  };

  return (
    <Stack component="form">
      <label htmlFor="image-upload-input">
        <DropzoneContainer
          onDrop={handleDrop}
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          isDragging={isDragging}
          error={Boolean(helperText)}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImgUpload}
            style={{ display: "none" }}
            id="image-upload-input"
            multiple
          />
          <CloudUploadIcon sx={{ width: 80, height: 80 }} />
          <Text sx={{ fontWeight: 550 }}>
            {isDragging
              ? "Drop the images here"
              : "Drag and drop images or click to select"}
          </Text>
          {caption && (
            <Text sx={{ mt: 1, mb: 2 }} type="caption">
              {caption}
            </Text>
          )}
        </DropzoneContainer>
      </label>
      {helperText && (
        <Text type="caption" cColor="error" sx={{ mt: 1, ml: 2 }}>
          {helperText}
        </Text>
      )}
    </Stack>
  );
}

interface IShowImages {
  images: IImage[];
  setImages: (images: IImage[]) => void;
  setDeletedImgId?: (id: string) => void;
  /**grid container style */
  gridContSX?: SxProps<Theme>;
}
export const ShowImages = ({
  images,
  setImages,
  setDeletedImgId,
  gridContSX,
}: IShowImages) => {
  const onDelete = (index: number) => {
    const imgId = images?.[index]?.id;
    if (imgId && setDeletedImgId) setDeletedImgId(imgId);
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Grid container spacing={1} sx={gridContSX}>
      {images?.map((img, i) => (
        <Grid item key={i}>
          <Stack direction={"column"}>
            <Badge
              badgeContent={
                <IconButton onClick={() => onDelete(i)}>
                  <HighlightOffIcon color="error" />
                </IconButton>
              }
            >
              <img
                src={img.url}
                alt={img.name}
                width="75"
                height="75"
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            </Badge>
            <Text
              variant="caption"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              {formatBytes(img.size)}
            </Text>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};
