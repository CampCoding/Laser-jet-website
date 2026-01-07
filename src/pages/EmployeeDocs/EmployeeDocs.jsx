import { Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { FcFile } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  handleCreateDocs,
  handleDeleteDocs,
  handleEditDocs,
  handleGetDocs,
} from "../../features/usersSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const data = [
  {
    id: 1,
    paper_name: "ورقة 1",
    paper_image: "https://laserjet-8405a.web.app/media/logos/logo.png",
  },
];

export default function EmployeeDocs() {
  const { id } = useParams();
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [editOpenModal, setEditOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [docsData, setDocsData] = useState({
    name: "",
    file: null,
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user_docs,
    add_docs_loading,
    edit_docs_loading,
    get_user_docs,
    delete_docs_loading,
  } = useSelector((state) => state?.users);

  const columns = [
    {
      dataIndex: "document_id",
      key: "document_id",
      title: "رقم المستند",
    },
    {
      dataIndex: "document_name",
      key: "document_name",
      title: "اسم المستند",
    },
    {
      dataIndex: "user_id",
      key: "user_id",
      title: "رقم المستخدم",
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: "تاريخ الإنشاء",
      render: (row) => {
        return <p>{new Date(row).toLocaleDateString()}</p>;
      },
    },
    {
      dataIndex: "file_url",
      key: "file_url",
      title: "رابط الملف",
      render: (row, text) => (
        <a href={`${row}`} target="_blank">
          <FcFile className="text-[23px]" />
        </a>
      ),
    },
    {
      title: "الإجراءات",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setEditOpenModal(true);
              setRowData(row);
            }}
            className="bg-blue-700 text-white p-2 rounded-md flex justify-center items-center"
          >
            {t("editText")}
          </button>

          <button
            onClick={() => {
              setDeleteOpenModal(true);
              setRowData(row);
            }}
            className="bg-red-700 text-white p-2 rounded-md flex justify-center items-center"
          >
            {t("deleteText")}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(handleGetDocs({ user_id: id }))
      .unwrap()
      .then((res) => console.log(res));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData?.append("user_id", id);

    const filesArray = Array.from(docsData.file || []);
    console.log(filesArray);
    filesArray.forEach((file) => {
      console.log("اسم الملف:", file.name);
      formData.append("documents", file);
    });

    dispatch(handleCreateDocs({ body: formData }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setDocsData({
            file: "",
          });
          dispatch(handleGetDocs({ user_id: id }));
          setAddOpenModal(false);
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  function handleEdit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("document", rowData?.file);
    dispatch(
      handleEditDocs({
        body: formData,
        user_id: id,
        doc_id: rowData?.document_id,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleGetDocs({ user_id: id }));
          setEditOpenModal(false);
        } else {
          toast.error(res?.message || "حدث خطأ أثناء التعديل");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("فشل التعديل");
      });
  }

  function handleDelete() {
    dispatch(handleDeleteDocs({ doc_id: rowData?.document_id, user_id: id }))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleGetDocs({ user_id: id }));
          setDeleteOpenModal(false);
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          مستندات المستخدم
        </h3>
        <button
          onClick={() => setAddOpenModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          إضافة مستندات
        </button>
      </div>

      <Modal
        open={addOpenModal}
        onClose={() => setAddOpenModal(false)}
        onCancel={() => setAddOpenModal(false)}
        title="إضافة مستندات"
        footer={null}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>اسم المستند</label>
            <input
              type="text"
              onChange={(e) =>
                setDocsData({ ...docsData, file: e.target.files })
              }
            />
          </div>
          <div className="input-group">
            <label>المستند</label>
            <input
              multiple
              type="file"
              onChange={(e) =>
                setDocsData({ ...docsData, file: e.target.files })
              }
            />
          </div>

          <button className="bg-[#0d6efd] mt-3 w-full hover:bg-[#104ba3]  text-white p-2 rounded-sm">
            {add_docs_loading ? t("loadingText") : t("saveBtn")}
          </button>
        </form>
      </Modal>

      <Modal
        open={editOpenModal}
        onClose={() => setEditOpenModal(false)}
        onCancel={() => setEditOpenModal(false)}
        title="تعديل المستندات"
        footer={null}
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>اسم المستندات</label>
            <input
              type="text"
              onChange={(e) =>
                setRowData({ ...rowData, file: e.target.files[0] })
              }
            />
          </div>
          <div className="input-group">
            <label>المستند</label>
            <input
              multiple
              type="file"
              onChange={(e) =>
                setRowData({ ...rowData, file: e.target.files[0] })
              }
            />
          </div>

          <button className="bg-[#0d6efd] mt-3 w-full hover:bg-[#104ba3]  text-white p-2 rounded-sm">
            {add_docs_loading ? t("loadingText") : t("saveBtn")}
          </button>
        </form>
      </Modal>

      <Modal
        footer={null}
        open={deleteOpenModal}
        onCancel={() => setDeleteOpenModal(false)}
        onClose={() => setDeleteOpenModal(false)}
        title="حذف المستندات"
      >
        <h3>هل تريد حذف هذه الملفات ؟</h3>
        <div className="flex gap-2 items-center my-3">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white flex- justify-center items-center p-2 rounded-md"
          >
            {delete_docs_loading ? t("loadingText") : t("deleteText")}
          </button>
          <button
            onClick={() => setEditOpenModal(false)}
            className="border border-blue-500 text-blue-500 flex- justify-center items-center p-2 rounded-md"
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <Table
        loading={get_user_docs}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={user_docs?.data}
      />
    </div>
  );
}
