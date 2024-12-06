import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const UploadZone = ({ onDrop, isDragActive }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}>
      <input {...getInputProps()} />
      <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400" />
      <p className="mt-2 text-gray-600">Kéo & thả tệp dữ liệu kho vào đây, hoặc nhấp để chọn tệp</p>
    </div>
  );
};

export default UploadZone; 