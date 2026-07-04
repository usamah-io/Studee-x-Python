import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// pdfUploader adalah nama endpoint yang kita daftarkan di core.js sebelumnya
export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
