import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "10MB" } })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload complete
      console.log("Uploadthing backend complete. File URL:", file.url);
      // Whatever is returned here is sent to the client-side onClientUploadComplete callback
      return { fileUrl: file.url };
    }),
};
