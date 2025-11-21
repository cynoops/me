import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { HandlerProfile, DogProfile } from "../../types";
import { Modal } from "../shared/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  profile: HandlerProfile;
  dogs: DogProfile[];
  title: string;
  description: string;
};

export const QrModal = ({
  open,
  onClose,
  profile,
  dogs,
  title,
  description,
}: Props) => {
  const [svg, setSvg] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(() => {
    if (typeof window === "undefined") return 256;
    const minSide = Math.min(window.innerWidth, window.innerHeight);
    return Math.max(256, minSide - 64);
  });

  useEffect(() => {
    if (!open) return;
    const updateSize = () => {
      const minSide = Math.min(window.innerWidth, window.innerHeight);
      setQrSize(Math.max(256, minSide - 64));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const payload = JSON.stringify({
      profile,
      dogs,
      generatedAt: new Date().toISOString(),
    });
    QRCode.toString(
      payload,
      { type: "svg", errorCorrectionLevel: "M", width: 256 },
      (error, result) => {
        if (error) {
          console.error("QR generation failed", error);
          return;
        }
        setSvg(result);
      },
    );
  }, [open, profile, dogs]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      fullScreen
      bodyClassName="flex flex-col gap-4 bg-grey-light text-center text-sm text-grey-text"
    >
      <div className="flex flex-1 items-center justify-center">
        <div
          className="mx-auto aspect-square w-full [&>svg]:h-full [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:w-full"
          style={{ maxWidth: qrSize, maxHeight: qrSize }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <p className="px-4 text-xs">{description}</p>
    </Modal>
  );
};
