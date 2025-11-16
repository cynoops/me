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
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-md">
      <div className="space-y-4 text-center text-sm text-grey-text">
        <p>{description}</p>
        <div
          className="mx-auto max-w-[256px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </Modal>
  );
};
