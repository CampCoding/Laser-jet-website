import { Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContact,
  deleteContact,
  editContact,
  fetchContacts,
} from "../../features/callUsSlice";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function CallUs() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [contactData, setContactData] = useState({
    image: null,
    title: "",
    description: "",
    return_url: "",
    imgUrl: "",
  });
  const dispatch = useDispatch();
  const { data, loading,addLoading , editLoading ,deleteLoading, error } = useSelector((state) => state?.contacts);

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "image",
      key: "image",
      title: "الصورة",
      render: (row) => (
        <img
          src={row}
          className="w-[20vh] h-[20vh] rounded-[3vh] object-cover"
        />
      ),
    },
    {
      dataIndex: "title",
      key: "title",
      title: "العنوان",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "الوصف",
    },
    {
      dataIndex: "return_url",
      key: "return_url",
      title: "لينك",
      render: (row) => (
        <a href={row} target="_blank">
          {row}
        </a>
      ),
    },
    {
      dataIndex: "",
      title: "أوامر",
      render: (row) => (
        <div className="flex gap-[1vh] items-center">
          <button
            onClick={() => {
              setOpenEditModal(true);
              setRowData(row);
            }}
            className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
          >
            تعديل
          </button>

          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setRowData(row);
            }}
            className="bg-red-500 text-white rounded-md p-3 flex justify-center items-center"
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  function handlesubmit() {
    const formData = new FormData();
    formData.append("image", contactData.image);
    formData.append("title", contactData.title);
    formData.append("description", contactData.description);
    formData.append("return_url", contactData.return_url);

    try {
      dispatch(addContact(formData))
        .then((res) => {
          if (res?.payload?.success) {
            toast.success(res?.payload?.message);
            dispatch(fetchContacts());
            setContactData({
              image: null,
              title: "",
              description: "",
              return_url: "",
              imgUrl: "",
            });
            setOpenAddModal(false);
          } else {
            toast.error(
              res?.payload || "there's an error while adding contact"
            );
          }
        })
        .catch((error) => console.log("catch call error", error));
    } catch (error) {
      console.log("error", error);
    }
  }

  function handleEdit() {
    const formData = new FormData();
    formData.append("id",rowData?.id);
    if(rowData?.image || rowData?.image instanceof File) {
      formData.append("image", rowData.image);
    }
    formData.append("title", rowData.title);
    formData.append("description", rowData.description);
    formData.append("return_url", rowData.return_url);

    try {
      dispatch(editContact(formData))
        .then((res) => {
          if (res?.payload?.success) {
            toast.success(res?.payload?.message);
            dispatch(fetchContacts());
            setRowData({})
            setOpenEditModal(false);
          } else {
            toast.error(
              res?.payload || "there's an error while editing contact"
            );
          }
        })
        .catch((error) => console.log("catch call error", error));
    } catch (error) {
      console.log("error", error);
    }
  }

  function handleDelete() {
    dispatch(deleteContact({id:rowData?.id}))
    .then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        dispatch(fetchContacts());
        setRowData({})
        setOpenDeleteModal(false);
      } else {
        toast.error(
          res?.payload || "there's an error while Deleting contact"
        );
      }
    })
    .catch((error) => console.log("catch call error", error));
  }

  return (
    <div className="border border-[#ddd] p-[2vh]">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">اتصل بنا</h3>
        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          اضافه
        </button>
      </div>

      <Modal
        title="اضافه"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        onOk={handlesubmit}
        onClose={() => setOpenAddModal(false)}
        okText={addLoading?"Loading...":"اضافه"}
        cancelText="الغاء"
      >
        <div>
          <div className="flex justify-between gap-[1.2vh] items-center">
            <div className="input-group">
              <label>العنوان</label>
              <input
                value={contactData.title}
                onChange={(e) =>
                  setContactData({ ...contactData, title: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>اللينك</label>
              <input
                value={contactData.return_url}
                onChange={(e) =>
                  setContactData({ ...contactData, return_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>الوصف</label>
            <textarea
              value={contactData.description}
              onChange={(e) =>
                setContactData({ ...contactData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="input-group">
            <label>الصوره</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setContactData({
                  ...contactData,
                  image: e.target.files[0],
                  imgUrl: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
          </div>

          {contactData.imgUrl && (
            <div className="flex gap-[2vh] items-center">
              <img
                src={contactData?.imgUrl}
                className="w-[20vh] my-[2vh] h-[20vh] rounded-[2vh]"
              />
              <FaTrash
                onClick={() =>
                  setContactData({ ...contactData, image: null, imgUrl: "" })
                }
                className="text-[2vh] text-red-600"
              />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title="تعديل"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        onOk={handleEdit}
        onClose={() => setOpenEditModal(false)}
        okText={editLoading ? "loading...":"تعديل"}
        cancelText="الغاء"
      >
        <form>
          <div className="flex justify-between gap-[1.2vh] items-center">
            <div className="input-group">
              <label>العنوان</label>
              <input
                value={rowData.title}
                onChange={(e) =>
                  setRowData({ ...rowData, title: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>اللينك</label>
              <input
                value={rowData.return_url}
                onChange={(e) =>
                  setRowData({ ...rowData, return_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>الوصف</label>
            <textarea
              value={rowData.description}
              onChange={(e) =>
                setRowData({ ...rowData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="input-group">
            <label>الصوره</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setRowData({
                  ...rowData,
                  image: e.target.files[0],
                  imgUrl: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
          </div>

          {(rowData?.image || rowData?.imgUrl) && (
            <div className="flex gap-[2vh] items-center">
              <img
                src={rowData?.image || rowData?.imgUrl}
                className="w-[20vh] my-[2vh] h-[20vh] rounded-[2vh]"
              />
              <FaTrash
                onClick={() =>
                  setRowData({ ...rowData, image: null, imgUrl: "" })
                }
                className="text-[2vh] text-red-600"
              />
            </div>
          )}
        </form>
      </Modal>

      <Modal
        title="حذف"
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        okText={deleteLoading ? "Loading...." :"حذف"}
        cancelText="الغاء"
        onOk={handleDelete}
      >
        <h3>هل تريد حذف هذه جهه الاتصال؟</h3>
      </Modal>

      <Table
        className="my-[3vh]"
        dataSource={data?.data?.resData}
        loading={loading}
        columns={columns}
      />
    </div>
  );
}
