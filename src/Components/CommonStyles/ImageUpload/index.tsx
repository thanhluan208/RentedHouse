import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "..";
interface IUploadFile {
  label?: string;
  dropzoneProps?: DropzoneOptions;
  initImage?: string;
}

const UploadFile = (props: IUploadFile) => {
  //! State
  const { label, dropzoneProps, initImage } = props;
  const { onDrop, onDragEnter, onDragLeave, ...otherDropzoneProps } =
    dropzoneProps || {};
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageUrls, setImageUrls] = useState<string | ArrayBuffer | undefined>(initImage);
  const { getRootProps, getInputProps } = useDropzone({
    onDragEnter: (event) => {
      onDragEnter && onDragEnter(event);
      setIsDragOver(true);
    },
    onDragLeave: (event) => {
      onDragLeave && onDragLeave(event);
      setIsDragOver(false);
    },
    onDrop: (acceptedFiles, fileReject, event) => {
      onDrop && onDrop(acceptedFiles, fileReject, event);
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e?.target?.result) {
            setImageUrls(e?.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
      setIsDragOver(false);
    },
    maxFiles: 1,
    ...otherDropzoneProps,
  });

  //! Function

  //! Render
  return (
    <div
      style={{
        width: "100%",
      }}
      {...getRootProps({ className: "dropzone" })}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: "20px",
          border: `1px dashed ${isDragOver ? "#4e40e5" : "#ccc"}`,
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: isDragOver ? "#4e40e50f" : "#fff",
          transition: "all 0.3s",
          svg: {
            width: "150px",
            height: "150px",
          },
          "&:hover": {
            border: "1px dashed #4e40e5",
            backgroundColor: "#4e40e50f",
          },
        }}
      >
        {imageUrls ? (
          <img
            src={imageUrls as any}
            alt="uploaded"
            style={{ width: "100%" }}
          />
        ) : (
          <Fragment>
            <CommonIcons.UploadUnDraw />
            <CommonStyles.Typography type="normal14">
              {label || "Click to upload or drag and drop files here"}
            </CommonStyles.Typography>
          </Fragment>
        )}
        {isDragOver && (
          <CommonStyles.Typography type="bold14" color={"#4e40e5"}>
            Release and start uploading
          </CommonStyles.Typography>
        )}
      </Box>
    </div>
  );
};

export default UploadFile;
