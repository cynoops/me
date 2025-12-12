import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../shared/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onScan: (payload: string) => void;
  title: string;
  description: string;
  errorMessage: string;
};

export const QrScannerModal = ({
  open,
  onClose,
  onScan,
  title,
  description,
  errorMessage,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let hasScanned = false;
    const reader = new BrowserQRCodeReader();
    let controls: IScannerControls | undefined;
    const start = async () => {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        const deviceId = devices[0]?.deviceId;
        controls = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current ?? undefined,
          (result, error, controls) => {
            if (cancelled) return;

            if (result && !hasScanned) {
              hasScanned = true;
              controls.stop();
              onScan(result.getText());
            }

            if (error && !(error instanceof NotFoundException)) {
              console.error("QR scan error", error);
              setStatus(errorMessage);
            }
          },
        );
      } catch (error) {
        console.error("Failed to start QR scanner", error);
        if (!cancelled) setStatus(errorMessage);
      }
    };

    setStatus(null);
    start();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [open, onScan, errorMessage]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      fullScreen
      bodyClassName="flex flex-col gap-4 bg-grey-light"
    >
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-sm text-grey-text">{description}</p>
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-grey-dark bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <div className="pointer-events-none absolute inset-0 border-4 border-white/70" aria-hidden />
        </div>
        {status ? (
          <p className="rounded-xl border border-error-light bg-error/10 px-3 py-2 text-sm text-error">
            {status}
          </p>
        ) : null}
      </div>
    </Modal>
  );
};
