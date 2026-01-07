import React, { useEffect, useState } from "react";
import { Modal, Spin, message } from "antd";
import { FaCheck, FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  fetchCategories,
  deleteCategories,
  handleResortCategory,
} from "../../features/categoriesSlice";
import { DragSortTable } from "@ant-design/pro-components";
import AddCategoryModal from "../../components/CategoriesPage/AddCategoryModal/AddCategoryModal";
import EditCategoryModal from "../../components/CategoriesPage/EditCategoryModal/EditCategoryModal";
import { toast } from "react-toastify";

export default function ProductSections() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [params, setParams] = useState({ page: 1, per_page: 700 });
  const [searchVal, setSearchVal] = useState("");
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [selectedInputs, setSelectedInputs] = useState([]);

  const { data, loading, deleteLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(
      fetchCategories({
        page: params.page,
        per_page: params.per_page,
        keywords: searchVal,
      })
    ).then((res) => {
      if (res.payload?.success) {
        setTotal(res.payload.data?.pagination?.total || 0);
      }
    });
  }, [dispatch, params.page, searchVal]);

  useEffect(() => {
    if (data?.data?.categories) {
      const formatted = data.data.categories.map((item, index) => ({
        ...item,
        sort: index + 1,
      }));
      setTableData(formatted);
    }
  }, [data]);

  const handleDelete = () => {
    dispatch(deleteCategories({ category_id: rowData?.category_id }))
      .then((res) => {
        if (res?.payload?.success) {
          message.success(res.payload.message);
          dispatch(
            fetchCategories({
              page: params.page,
              per_page: params.per_page,
              keywords: searchVal,
            })
          );
        } else {
          message.error(res.payload);
        }
      })
      .finally(() => setDeleteModal(false));
  };

  const handleDragSortEnd = (beforeIndex, afterIndex, newDataSource) => {
    const movedItem = tableData[beforeIndex];
    const newPosition = afterIndex + 1;

    const finalOrderData = newDataSource.map((item, index) => {
      if (item.category_id === movedItem.category_id) {
        return {
          item_id: item.category_id,
          order_no: newPosition,
        };
      }
      return {
        item_id: item.category_id,
        order_no: item.order_no,
      };
    });

    console.log("Final Order Data:", finalOrderData);

    setTableData(newDataSource);
    dispatch(handleResortCategory({ body: finalOrderData }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(
            fetchCategories({
              page: params.page,
              per_page: params.per_page,
              keywords: searchVal,
            })
          ).then((res) => {
            if (res.payload?.success) {
              setTotal(res.payload.data?.pagination?.total || 0);
            }
          });
        }
      });
  };

  const columns = [
    {
      title: "",
      dataIndex: "sort",
      width: 50,
      className: "drag-visible",
    },
    {
      title: "#",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: t("imageText"),
      dataIndex: "image_url",
      key: "image_url",
      render: (url) => (
        <img
          src={url}
          alt="category"
          className="w-[100px] h-[100px] object-cover rounded-md"
        />
      ),
    },
    {
      title: t("titleText"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("profitPercentage"),
      dataIndex: "gain",
      key: "gain",
      render: (val) => <p>{val}%</p>,
    },
    {
      title: t("createdAtText"),
      dataIndex: "created_at",
      key: "created_at",
      render: (val) => <p>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: t("isActiveText"),
      dataIndex: "is_active",
      key: "is_active",
      render: (val) =>
        val ? (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-green-100 text-green-500">
            <FaCheck />
          </div>
        ) : (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-red-100 text-red-500">
            <FaX />
          </div>
        ),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white p-2 rounded"
            onClick={() => {
              setEditModal(true);
              setRowData(row);
            }}
          >
            {t("editText")}
          </button>
          <button
            className="bg-red-600 text-white p-2 rounded"
            onClick={() => {
              setDeleteModal(true);
              setRowData(row);
            }}
          >
            {t("deleteText")}
          </button>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  };
const [openAddModal, setOpenAddModal] = useState(null)
const [openInstallmentsModal, setOpenInstallmentsModal] = useState(null)
  return (
    <div>
      <div className="flex justify-between items-center w-[100%]">
        <h3 className="text-xl font-bold my-4">{t("categoriesText")}</h3>
        <button className="bg-[#0d6efd] hover:bg-blue-700 text-white p-2 rounded-md flex items-center gap-1" onClick={() => setOpenAddModal(true)}><span>+</span> {t("addCategory")}</button>
      </div>
      <input
        placeholder={t("searchText")}
        onChange={(e) => setSearchVal(e.target.value)}
        className="my-3 border border-gray-200 p-3 rounded-md w-full"
      />

      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        footer={null}
      >
        <h3>{t("deleteCategoryText")}</h3>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white rounded-md p-2"
          >
            {deleteLoading ? <Spin /> : t("deleteText")}
          </button>
          <button
            className="border border-blue-500 text-blue-500 rounded-md p-2"
            onClick={() => setDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <AddCategoryModal openInstallmentsModal={openInstallmentsModal} setOpenInstallmentsModal={setOpenInstallmentsModal} openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
      <EditCategoryModal
        editModal={editModal}
        setEditModal={setEditModal}
        rowData={rowData}
        setRowData={setRowData}
        selectedInputs={selectedInputs}
        setSelectedInputs={setSelectedInputs}
      />

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <DragSortTable
          toolBarRender={false}
          rowKey="category_id"
          columns={columns}
          dataSource={tableData?.sort((a, b) => a?.order_no - b?.order_no)}
          dragSortKey="sort"
          search={false}
          pagination={{
            current: params.page,
            pageSize: params.per_page,
            total: total,
            onChange: handleTableChange,
            showSizeChanger: true,
            showTotal: (total) => `إجمالي ${total} عنصر`,
            pageSizeOptions: ["7", "10", "20", "50"],
            locale: {
              items_per_page: "عنصر في الصفحة",
              jump_to: "انتقل إلى",
              jump_to_confirm: "تأكيد",
              page: "صفحة",
              prev_page: "الصفحة السابقة",
              next_page: "الصفحة التالية",
              prev_5: "خمس صفحات سابقة",
              next_5: "خمس صفحات تالية",
              prev_3: "ثلاث صفحات سابقة",
              next_3: "ثلاث صفحات تالية",
            },
          }}
          onDragSortEnd={handleDragSortEnd}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: "لا توجد بيانات",
            searchPlaceholder: "ابحث هنا",
            filterConfirm: "موافق",
            filterReset: "إعادة تعيين",
            filterEmptyText: "لا توجد فلاتر",
            selectAll: "تحديد الكل",
            selectInvert: "عكس التحديد",
            selectionAll: "تحديد كل البيانات",
            sortTitle: "ترتيب",
            expand: "توسيع",
            collapse: "طي",
            triggerDesc: "ترتيب تنازلي",
            triggerAsc: "ترتيب تصاعدي",
            cancelSort: "إلغاء الترتيب",
          }}
        />
      )}
    </div>
  );
}
