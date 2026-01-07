import { Modal } from "antd";
import React from "react";

export default function ViewEmployeeModal({
  viewModal,
  setViewModal,
  rowData,
  setImgs,
  imgs,
  setRowData,
}) {
  function handleSave() {
    console.log(rowData);
  }
  return (
    <Modal
      open={viewModal}
      onCancel={() => setViewModal(false)}
      onClose={() => setViewModal(false)}
      title="View Account Data"
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={rowData?.name}
              onChange={(e) => setRowData({ ...rowData, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={rowData?.phone}
              onChange={(e) =>
                setRowData({ ...rowData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>National ID / Passport</label>
            <input
              type="text"
              value={rowData?.nationalId}
              onChange={(e) =>
                setRowData({ ...rowData, nationalId: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              className="disabled:bg-gray-200"
              type="text"
              value={rowData?.address}
              onChange={(e) =>
                setRowData({ ...rowData, address: e.target.value })
              }
            />
          </div>
        </div>

        <div className="input-group">
          <label>User Type</label>
          <input value="User" disabled className="disabled:bg-gray-200" />
        </div>

        <div className="input-group">
          <label>Identity Photo </label>
          <input
            onChange={(e) =>
              setImgs({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
              })
            }
            type="file"
            accept="image/*"
          />
        </div>

        {rowData?.imgUrl && (
          <div className="flex gap-3 items-center">
            <img
              src={rowData?.imgUrl}
              className="w-[100px] h-[100px] object-contain rounded-md"
            />
            <FaTrash className="text-red-500" />
          </div>
        )}

        <div className="flex gap-3 items-center mt-3">
          <button
            className="bg-[#0d6efd] hover:bg-[#104ba3]  text-white p-2 rounded-sm"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
