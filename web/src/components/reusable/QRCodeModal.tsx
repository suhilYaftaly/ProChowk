import { useRef, MutableRefObject } from "react";
import { Stack, Button, useTheme } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import ShareIcon from "@mui/icons-material/Share";

import CustomModal from "./CustomModal";
import logoWhiteOutline from "../../assets/logoWhiteOutline.svg";
import Text from "./Text";
import { toast } from "react-toastify";

interface Props {
  /**Link or any other string to create the QR code from*/
  value: string;
  /**@default "QR Code." */
  modalTitle?: string;
  description?: string;
  /**exported file name @default "NexaBind-QRCode" */
  fileName?: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function QRCodeModal({
  value,
  modalTitle = "QR Code.",
  description,
  fileName = "QRCode",
  showModal,
  setShowModal,
}: Props) {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  fileName = "NexaBind-QRCode-" + fileName;
  const theme = useTheme();
  const fgColor = theme.palette.text.dark;

  const imageSettings = {
    src: logoWhiteOutline as any,
    height: 45,
    width: 45,
    excavate: false,
  };

  return (
    <CustomModal title={modalTitle} open={showModal} onClose={setShowModal}>
      <Stack sx={{ display: "flex", alignItems: "center" }}>
        <Stack
          ref={qrCodeRef}
          sx={{ background: "white", p: 1, borderRadius: 1 }}
        >
          <QRCodeSVG
            fgColor={fgColor}
            size={250}
            value={value}
            imageSettings={imageSettings}
          />
        </Stack>
        <Text type="subtitle" sx={{ my: 2 }}>
          Scan this QR code
        </Text>
        {description && <Text>{description}</Text>}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          startIcon={<ShareIcon />}
          onClick={() => handleShare(qrCodeRef, fileName)}
        >
          Share With Others
        </Button>
        <Button
          fullWidth
          startIcon={<FileDownload />}
          sx={{ mt: 2, color: fgColor, fontWeight: 900 }}
          onClick={() => handleSave({ ref: qrCodeRef, name: fileName })}
        >
          Save as image
        </Button>
      </Stack>
    </CustomModal>
  );
}

type RefType = MutableRefObject<HTMLDivElement | null>;
interface ISave {
  ref: RefType;
  name: string;
}
const handleSave = async ({ ref, name }: ISave) => {
  if (ref.current) {
    const svg = ref.current.querySelector("svg");
    if (svg) {
      const blob = await convertSVGToPNG(svg);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name + ".png";
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};

const handleShare = async (qrCodeRef: RefType, fileName: string) => {
  if (!qrCodeRef.current) return;

  const svg = qrCodeRef.current.querySelector("svg");
  if (!svg) return;

  try {
    const blob = await convertSVGToPNG(svg);
    const file = new File([blob], `${fileName}.png`, { type: "image/png" });
    if (navigator.share) {
      await navigator.share({
        files: [file],
        title: "Share QR Code",
        text: "Here is a QR Code image",
      });
    } else toast.error("Web Share API is not available in your browser.");
  } catch (error) {
    toast.error("Error in sharing: " + JSON.stringify(error));
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

const convertSVGToPNG = async (svgElement: SVGSVGElement): Promise<Blob> => {
  await convertImgToBase64InSVG(svgElement);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const borderWidth = 15;
      const scale = 4; // Increase this number for higher quality
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const totalWidth = img.width * scale + 2 * borderWidth;
        const totalHeight = img.height * scale + 2 * borderWidth;

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

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob conversion failed"));
          },
          "image/png",
          1
        );
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgString);
  });
};
