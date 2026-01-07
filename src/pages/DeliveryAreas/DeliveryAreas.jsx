import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { conifgs } from "../../config";

export default function DeliveryAreas() {
  const { t } = useTranslation();
  const [allData , setAllData] = useState([]);
  // -------------------------
  // State for listing/pagination/searching
  // -------------------------
  const [searchValue , setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // -------------------------
  // State for modals
  // -------------------------
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);


  // -------------------------
  // State for form inputs
  // -------------------------
  const [formData, setFormData] = useState({
    area_id: "",
    area_title: "",
    area_description: "",
    area_price: "",
    area_lang: "",
    area_lat: "",
    is_active: true,
  });

  // -------------------------
  // Retrieve token once (if desired), or inside each call
  // -------------------------
  const token = localStorage.getItem(conifgs.localStorageTokenName);

  // -------------------------
  // Table columns
  // -------------------------
  const columns = [
    {
      dataIndex: "region_id",
      key: "region_id",
      title: "#",
    },
    {
      dataIndex: "region_title",
      key: "region_title",
      title: t("nameText"),
    },
    {
      dataIndex: "region_description",
      key: "region_description",
      title: t("description"),
    },
    {
      dataIndex: "region_price",
      key: "region_price",
      title: t("shippingPriceText"),
    },
    {
      dataIndex: "is_active",
      key: "is_active",
      title: t("StatusText") || "Status",
      render: (value) => (value ? t("activeText") : t("inactiveText")),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEditClick(record)}>
            {t("editText")}
          </Button>
          <Button danger onClick={() => handleDelete(record.region_id)}>
            {t("deleteText")}
          </Button>
        </div>
      ),
    },
  ];

  // -------------------------
  // Fetch data from server
  // -------------------------
  const fetchDeliveryAreas = async (page = 1, perPage = 7) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${conifgs.LIVE_BASE_URL}delivery-areas/list?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      if (result.success) {
        const { deliveryAreas, pagination: pg } = result.data;
        setData(deliveryAreas);
        setPagination((prev) => ({
          ...prev,
          current: parseInt(pg.current_page, 10),
          pageSize: parseInt(pg.per_page, 10),
          total: parseInt(pg.total, 10),
        }));
      } else {
        message.error(result.message || "Failed to fetch delivery areas");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching delivery areas");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // On Table pagination/sort
  // -------------------------
  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    fetchDeliveryAreas(current, pageSize);
  };

  // -------------------------
  // Create a new area
  // -------------------------
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${conifgs.LIVE_BASE_URL}delivery-areas/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area_title: formData.area_title,
          area_description: formData.area_description,
          area_price: formData.area_price,
          area_lang: "-",
          area_lat: "-",
        }),
      });
      const result = await res.json();
      if (result.success) {
        message.success("Delivery area created successfully");
        setAddModal(false);
        setFormData({
          area_id: "",
          area_title: "",
          area_description: "",
          area_price: "",
          area_lang: "-",
          area_lat: "-",
          is_active: true,
        });
        // re-fetch list
        fetchDeliveryAreas(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || "Failed to create delivery area");
      }
    } catch (err) {
      console.error(err);
      message.error("Error creating delivery area");
    }
  };

  // -------------------------
  // Edit an existing area
  // -------------------------
  const handleEditClick = (record) => {
    // Fill form with existing data
    setFormData({
      area_id: record.region_id,
      area_title: record.region_title,
      area_description: record.region_description,
      area_price: record.region_price,
      area_lang: "-",
      area_lat: "-",
      is_active: record.is_active,
    });
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${conifgs.LIVE_BASE_URL}delivery-areas/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area_id: formData.area_id,
          area_title: formData.area_title,
          area_description: formData.area_description,
          area_price: formData.area_price,
          area_lang: "-",
          area_lat: "-",
          is_active: formData.is_active,
        }),
      });
      const result = await res.json();
      if (result.success) {
        message.success("Delivery area updated successfully");
        setEditModal(false);
        setFormData({
          area_id: "",
          area_title: "",
          area_description: "",
          area_price: "",
          area_lang: "",
          area_lat: "",
          is_active: true,
        });
        // re-fetch list
        fetchDeliveryAreas(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || "Failed to update delivery area");
      }
    } catch (err) {
      console.error(err);
      message.error("Error updating delivery area");
    }
  };

  // -------------------------
  // Delete an area
  // -------------------------
  const handleDelete = async (areaId) => {
    try {
      const res = await fetch(`${conifgs.LIVE_BASE_URL}delivery-areas/delete`, {
        // If it should be /delivery-areas/delete, adjust here
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area_id: areaId,
        }),
      });
      const result = await res.json();
      if (result.success) {
        message.success("Delivery area deleted successfully");
        // re-fetch
        fetchDeliveryAreas(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || "Failed to delete delivery area");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting delivery area");
    }
  };

  // -------------------------
  // useEffect to load data initially
  // -------------------------
  useEffect(() => {
    fetchDeliveryAreas(pagination.current, pagination.pageSize );
  }, []);

  const filteredData = useMemo(() => {
    if(!searchValue.length) return data;

    return data?.filter(item => (item?.region_description?.toLowerCase()?.includes(searchValue?.toLowerCase())) || (item?.region_title?.toLowerCase()?.includes(searchValue?.toLowerCase())))
  } , [searchValue , data])

  useEffect(() => {
    setAllData(filteredData)
  } , [filteredData])

  return (
    <div>
      {/* Header row */}
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("deliveryAreaText")}
        </h3>
        <button
          onClick={() => setAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          {t("addText")}
        </button>
      </div>

      {/* Search box (not yet implemented) */}
      <input
        value={searchValue}
        onChange={(e) =>setSearchValue(e.target.value)}
        placeholder={t("searchText")}
        className="border border-gray-200 outline-hidden w-full rounded-md p-3 my-3"
      />

      {/* Main Table */}
      <Table
        columns={columns}
        dataSource={allData}
        rowKey="region_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={handleTableChange}
      />

      {/* Add Modal */}
      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        title={t("deliveryAreaText")}
      >
        <form onSubmit={handleAddSubmit}>
          <div className="input-group mb-2">
            <label>{t("nameText")}</label>
            <input
              type="text"
              value={formData.area_title}
              onChange={(e) =>
                setFormData({ ...formData, area_title: e.target.value })
              }
            />
          </div>

          <div className="input-group mb-2">
            <label>{t("description")}</label>
            <input
              type="text"
              value={formData.area_description}
              onChange={(e) =>
                setFormData({ ...formData, area_description: e.target.value })
              }
            />
          </div>

          <div className="input-group mb-2">
            <label>{t("shippingPriceText")}</label>
            <input
              type="number"
              value={formData.area_price}
              onChange={(e) =>
                setFormData({ ...formData, area_price: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-[#0d6efd] text-white w-full p-2 rounded-md mt-3"
          >
            {t("saveBtn")}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        title={t("editBtn")}
      >
        <form onSubmit={handleEditSubmit}>
          <div className="input-group mb-2">
            <label>{t("nameText")}</label>
            <input
              type="text"
              value={formData.area_title}
              onChange={(e) =>
                setFormData({ ...formData, area_title: e.target.value })
              }
            />
          </div>

          <div className="input-group mb-2">
            <label>{t("description")}</label>
            <input
              type="text"
              value={formData.area_description}
              onChange={(e) =>
                setFormData({ ...formData, area_description: e.target.value })
              }
            />
          </div>

          <div className="input-group mb-2">
            <label>{t("shippingPriceText")}</label>
            <input
              type="number"
              value={formData.area_price}
              onChange={(e) =>
                setFormData({ ...formData, area_price: e.target.value })
              }
            />
          </div>

        

          

          <div className="input-group mb-2">
            <label>{t("activeText")}</label>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-[#0d6efd] text-white w-full p-2 rounded-md mt-3"
          >
            {t("saveBtn")}
          </button>
        </form>
      </Modal>
    </div>
  );
}
