import { useState } from "react";
import { PlayCircle } from "lucide-react";

export default function Modal({ videoUrl }) {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className=" flex flex-col">
      <button
        className="text-primary p-1 w-fit"
        onClick={() => setModalOpen(true)}
      >
        <PlayCircle />
      </button>
      <>
        {isModalOpen ? (
          <div
            className="fixed z-50 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="model"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white dark:bg-black/40 dark:text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-black/80 dark:text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <video
                    src={videoUrl}
                    controls
                    className="rounded-xl w-full mb-4"
                  />
                </div>
                <div className="bg-gray-50 dark:bg-black/80 dark:text-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setModalOpen(!true)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
}
