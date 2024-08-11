import { useState } from "react";
import CommonStyles from "../../../Components/CommonStyles";

const UploadListFiles = () => {
  //! State
  const [files, setFiles] = useState<File[]>([]);

  //! Function

  //! Render
  return (
    <CommonStyles.FilesUpload
      label="Upload files"
      files={files}
      dropzoneProps={{
        onDrop: (acceptedFiles) => {
          setFiles(acceptedFiles);
        },
      }}
    />
  );
};

export default UploadListFiles;
