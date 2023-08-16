import { useRef, useState, MutableRefObject } from "react";
import { Stack, Typography, Tooltip, Button } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import QRCode from "react-qr-code";

import CustomModal from "./CustomModal";

interface Props {
  /**Link or any other string to create the QR code from*/
  value: string;
  /**@default "QR Code." */
  modalTitle?: string;
  description?: string;
  /**@default "ProChowk-QRCode" */
  fileName?: string;
  /**@default 40 */
  qrIconSize?: number;
}

export default function QRCodeModal({
  value,
  modalTitle = "QR Code.",
  description,
  fileName = "QRCode",
  qrIconSize = 40,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  fileName = "ProChowk-" + fileName;

  return (
    <>
      <Stack
        sx={{
          background: "white",
          p: 0.2,
          cursor: "pointer",
          borderRadius: 1,
          alignSelf: "center",
        }}
        onClick={() => setShowModal(true)}
      >
        <Tooltip title="Open QR Code">
          <QRCode size={qrIconSize} value={value} />
        </Tooltip>
      </Stack>
      <CustomModal title={modalTitle} open={showModal} onClose={setShowModal}>
        <Stack sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
          {description && <Typography>{description}</Typography>}
          <Stack
            ref={qrCodeRef}
            sx={{ background: "white", p: 0.5, borderRadius: 1 }}
          >
            <QRCode size={300} value={value} />
          </Stack>
          <Stack direction={"row"} sx={{ gap: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() => saveImage({ ref: qrCodeRef, name: fileName })}
            >
              Image
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() => saveSVG({ ref: qrCodeRef, name: fileName })}
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
}
const createImageFromSVG = (
  ref: RefType,
  callback: (img: HTMLImageElement) => void
) => {
  if (ref.current) {
    const svg = ref.current.querySelector("svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => callback(img);
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  }
};

const saveImage = ({ ref, name }: ISave) => {
  createImageFromSVG(ref, (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const borderWidth = 10;
    const totalWidth = img.width + 2 * borderWidth;
    const totalHeight = img.height + 2 * borderWidth;
    if (ctx) {
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, totalWidth, totalHeight);
      ctx.drawImage(img, borderWidth, borderWidth);
      const dataURL = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = name;
      a.click();
    }
  });
};

const saveSVG = ({ ref, name }: ISave) => {
  if (ref.current) {
    const svg = ref.current.querySelector("svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name + ".svg";
      a.click();
    }
  }
};
