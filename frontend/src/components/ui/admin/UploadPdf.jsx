import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../context/AppContextProvider";
import { showToast } from "../../../helper/toastMessage";

function UploadPdf() {
  const [pdfData, setPdfData] = useState({ filename: "", pdf: null });
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { baseUrl } = useApp();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setPdfData({ ...pdfData, pdf: files[0] });
    } else {
      setPdfData({ ...pdfData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/course/${id}/upload-pdf`,
        pdfData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        showToast(res.data.message, "success");
        navigate("/instructor/courses");
      }

      setPdfData({ filename: "", pdf: null });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full p-2 md:p-8 rounded-lg max-w-xl bg-formBackground"
      >
        <p className="text-xl text-white text-center font-semibold">
          Upload Document
        </p>
        <div className="mt-4">
          <label className="block text-white text-sm font-semibold mb-2">
            Filename
          </label>
          <input
            className="bg-transparent text-white focus:outline-none focus:shadow-outline border rounded py-2 px-2 block w-full"
            name="filename"
            value={pdfData.filename}
            onChange={handleChange}
            type="text"
            required
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-white text-sm font-semibold mb-2">
              Upload PDF
            </label>
          </div>
          <input
            className="text-sm text-gray-200 file:mr-5 file:py-2 file:px-3 file:border-[1px] file:text-sm file:rounded file:font-medium file:bg-transparent file:text-white hover:file:cursor-pointer"
            name="pdf"
            onChange={handleChange}
            type="file"
            accept=".pdf"
            required
          />
        </div>
        <div className="mt-8">
          <button
            disabled={isLoading}
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer flex justify-center items-center text-center"
          >
            {isLoading ? (
              <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
            ) : (
              "Upload Document"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadPdf;
