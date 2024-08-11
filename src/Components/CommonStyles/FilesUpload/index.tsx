import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "..";
import { isEmpty } from "lodash";
import MuiChip from "../Chip";
interface IFilesUpload {
  label?: string;
  dropzoneProps?: DropzoneOptions;
  files?: File[] | string[];
  handleDeleteFile?: (index: number) => void;
}

const FilesUpload = (props: IFilesUpload) => {
  //! State
  const { label, dropzoneProps, files, handleDeleteFile } = props;
  const { onDrop, onDragEnter, onDragLeave, ...otherDropzoneProps } =
    dropzoneProps || {};
  const [isDragOver, setIsDragOver] = useState(false);
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
          padding: !isEmpty(files) ? "8px" : "20px",
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
        {!isEmpty(files) ? (
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {files?.map((file, index) => {
              return (
                <MuiChip
                  sx={{
                    textTransform: "none !important",
                    svg: {
                      margin: "0 !important",
                      width: "22px !important",
                      height: "22px !important",
                    },
                  }}
                  label={typeof file === 'string' ? file : `${file.name} - ${file.size} bytes`}
                  key={index}
                  onDelete={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDeleteFile && handleDeleteFile(index);
                  }}
                />
              );
            })}
          </Box>
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

export default FilesUpload;
