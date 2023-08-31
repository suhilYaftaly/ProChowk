import { useRef, useState, MutableRefObject } from "react";
import { Stack, Typography, Button, IconButton } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import CustomModal from "./CustomModal";
import logoWhiteOutline from "../../assets/logoWhiteOutline.svg";

interface Props {
  /**Link or any other string to create the QR code from*/
  value: string;
  /**@default "QR Code." */
  modalTitle?: string;
  description?: string;
  /**exported file name @default "ProChowk-QRCode" */
  fileName?: string;
}

export default function QRCodeModal({
  value,
  modalTitle = "QR Code.",
  description,
  fileName = "QRCode",
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  fileName = "ProChowk-QRCode-" + fileName;

  const imageSettings = {
    src: logoWhiteOutline,
    height: 70,
    width: 70,
    excavate: false,
  };

  return (
    <>
      <IconButton onClick={() => setShowModal(true)}>
        <QrCode2Icon />
      </IconButton>
      <CustomModal title={modalTitle} open={showModal} onClose={setShowModal}>
        <Stack sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
          {description && <Typography>{description}</Typography>}
          <Stack
            ref={qrCodeRef}
            sx={{ background: "white", p: 0.5, borderRadius: 1 }}
          >
            <QRCodeSVG size={300} value={value} imageSettings={imageSettings} />
          </Stack>
          <Stack direction={"row"} sx={{ gap: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() =>
                handleSave({ ref: qrCodeRef, name: fileName, fileType: "png" })
              }
            >
              Image
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() =>
                handleSave({ ref: qrCodeRef, name: fileName, fileType: "svg" })
              }
            >
              SVG
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
}

type RefType = MutableRefObject<HTMLDivElement | null>;
interface ISave {
  ref: RefType;
  name: string;
  fileType: "png" | "svg";
}
const handleSave = async ({ ref, name, fileType }: ISave) => {
  if (ref.current) {
    const svg = ref.current.querySelector("svg");
    if (svg) {
      await convertImgToBase64InSVG(svg);
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      if (fileType === "png") {
        const img = new Image();
        img.onload = () => {
          const borderWidth = 15;
          const scale = 4; // Increase this number for higher quality
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const totalWidth = img.width * scale + 2 * borderWidth;
            const totalHeight = img.height * scale + 2 * borderWidth;

            // Handle high DPI screens
            const dpr = window.devicePixelRatio || 1;
            canvas.width = totalWidth * dpr;
            canvas.height = totalHeight * dpr;
            ctx.scale(dpr, dpr);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, totalWidth, totalHeight);

            ctx.drawImage(
              img,
              borderWidth,
              borderWidth,
              img.width * scale,
              img.height * scale
            );

            const dataURL = canvas.toDataURL("image/png", 1); // The last argument is quality
            const a = document.createElement("a");
            a.href = dataURL;
            a.download = name + ".png";
            a.click();
          }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgString);
      } else if (fileType === "svg") {
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name + ".svg";
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }
};

const convertImgToBase64InSVG = (svgElement: SVGSVGElement) => {
  const images = svgElement.querySelectorAll("image");
  const promises = Array.from(images).map((image) => {
    return new Promise((resolve) => {
      const imgSrc = image.getAttribute("xlink:href")!;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        image.setAttribute("xlink:href", dataURL);
        resolve(true);
      };
      img.src = imgSrc;
    });
  });
  return Promise.all(promises);
};
