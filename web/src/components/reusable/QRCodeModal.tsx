import { useRef, useState, MutableRefObject } from "react";
import { Stack, Typography, Tooltip, Button } from "@mui/material";
import { Share, FileDownload } from "@mui/icons-material";
import QRCode from "react-qr-code";

import CustomModal from "./CustomModal";
import { isMobileDevice } from "@/utils/utilFuncs";

interface Props {
  /**Link or any other string to create the QR code from*/
  value: string;
  /**@default "QR Code." */
  modalTitle?: string;
  description?: string;
  shareProps: ShareProps;
  /**@default "ProChowk-QRCode" */
  fileName?: string;
  /**@default 40 */
  qrIconSize?: number;
}

export default function QRCodeModal({
  value,
  modalTitle = "QR Code.",
  description,
  shareProps,
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
        <Stack
          sx={{ display: "flex", alignContent: "center", alignItems: "center" }}
        >
          {description && <Typography sx={{ my: 2 }}>{description}</Typography>}
          <Stack
            ref={qrCodeRef}
            sx={{ background: "white", p: 0.5, borderRadius: 1 }}
          >
            <QRCode size={300} value={value} />
          </Stack>
          <Stack direction={"row"} sx={{ mt: 2, gap: 2 }}>
            {isMobileDevice() && (
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={() =>
                  share({ ref: qrCodeRef, name: fileName, sp: shareProps })
                }
              >
                Share
              </Button>
            )}
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
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
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

interface ShareProps {
  title?: string;
  text: string;
}
interface IShare extends ISave {
  sp: ShareProps;
}

const share = async ({ ref, name, sp }: IShare) => {
  createImageFromSVG(ref, async (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], name, { type: "image/png" });
          const filesArray = [file];

          if (navigator.canShare && navigator.canShare({ files: filesArray })) {
            try {
              await navigator.share({
                title: sp.title || "QR Code",
                text: sp.text,
                files: filesArray,
              });
              console.log("Successful share");
            } catch (error) {
              console.log("Error sharing", error);
            }
          } else {
            alert("Sharing files is not supported on this device or browser.");
          }
        } else {
          console.error("Unable to create blob from canvas");
        }
      });
    }
  });
};
