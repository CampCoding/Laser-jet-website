import { Modal, Select, Space, Button, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { conifgs } from "../../../config";
import { useDispatch } from "react-redux";
import { ChangeStatus } from "../../../features/usersSlice";
import { toast } from "react-toastify";

export default function InstallmentStatusModal({
  toggleStatusOpen,
  openStatusModal,
  type,
  data
}) {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState(data?.status || "");
  const [loading, setLoading] = useState(false);

  // خيارات الحالة بناءً على `type`
  const statusOptions =
    type === "installment"
      ? ["started", "stopped", "paused"]
      : ["paid", "unpaid", "refunded", "pending", "stopped", "paused"];

  // تحديث الحالة في الخادم
  const dispatch = useDispatch();
  const handleUpdateStatus = async () => {
    console.log(data, selectedStatus);
    setLoading(true);
    try {
      const payload =
        type === "installment"
          ? { installment_id: data.installment_id, status: selectedStatus }
          : { part_id: data.part_id, status: selectedStatus };

      dispatch(ChangeStatus(payload)).then((res) => {
        console.log(res);
        if (res?.payload?.success) {
          window.location.reload()
          toast.success(res?.payload?.message);
          toggleStatusOpen([]);
        } else toast.error(res?.payload?.message);
      });

      // إغلاق المودال بعد الحفظ
    } catch (error) {
      message.error(t("Failed to update status"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("change status")}
      footer={null}
      onCancel={() => toggleStatusOpen([])}
      open={openStatusModal?.open}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          value={selectedStatus}
          style={{ width: "100%" }}
          onChange={(value) => setSelectedStatus(value)}
        >
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>
              {t(status)}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleUpdateStatus} loading={loading}>
          {t("Save")}
        </Button>
      </Space>
    </Modal>
  );
}
