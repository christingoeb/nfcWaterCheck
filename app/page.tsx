"use client";

import { useState } from "react";

const round = (value: number) => Math.round(value * 100) / 100;
type NdefRecord = {
  recordType: string;
  data: BufferSource;
  encoding?: string;
};
type NdefReadingEvent = {
  message: {
    records: NdefRecord[];
  };
};
type NdefReader = {
  scan: () => Promise<void>;
  onreading: ((event: NdefReadingEvent) => void) | null;
  onreadingerror: (() => void) | null;
};

export default function Home() {
  const [status, setStatus] = useState("Tap start and hold an NFC sticker near your phone.");
  const [totalLiters, setTotalLiters] = useState(0);
  const [lastRead, setLastRead] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const readLiters = (input: string) => {
    const parsed = Number.parseFloat(input.trim().replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };

  const startScanning = async () => {
    const webNfcWindow = window as Window & { NDEFReader?: new () => NdefReader };

    if (!webNfcWindow.NDEFReader) {
      setStatus("Web NFC is not supported in this browser.");
      return;
    }

    try {
      const reader = new webNfcWindow.NDEFReader();
      await reader.scan();
      setIsScanning(true);
      setStatus("Scanning started. Touch an NFC sticker now.");

      reader.onreading = (event: NdefReadingEvent) => {
        for (const record of event.message.records) {
          if (record.recordType !== "text") {
            continue;
          }

          const rawText = new TextDecoder(record.encoding || "utf-8").decode(record.data);
          const liters = readLiters(rawText);

          if (liters === null) {
            setStatus(`Tag value \"${rawText}\" is not a valid liter amount.`);
            return;
          }

          setLastRead(liters);
          setTotalLiters((current) => round(current + liters));
          setStatus(`Logged ${liters} L from NFC sticker.`);
          return;
        }

        setStatus("No text payload found on NFC sticker.");
      };

      reader.onreadingerror = () => {
        setStatus("Could not read this NFC sticker. Try again.");
      };
    } catch {
      setStatus("NFC permission denied or scanning failed.");
    }
  };

  return (
    <main>
      <h1>NFC Water Check</h1>
      <p>{status}</p>
      <button onClick={startScanning} type="button" disabled={isScanning}>
        {isScanning ? "Scanning..." : "Start NFC Scan"}
      </button>
      <p>Total water today: {totalLiters} L</p>
      <p>Last NFC entry: {lastRead === null ? "No tag read yet" : `${lastRead} L`}</p>
    </main>
  );
}
