import { Modal, Switch } from "antd";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/categoriesSlice";
import { addOffer, fetchOffers } from "../../../features/offersSlice";
import { toast } from "react-toastify";
import { TreeSelect } from "antd";
import { useTranslation } from "react-i18next";

export default function AddOfferModal({ open, setOpen }) {
  const [value, setValue] = useState();
  const { t } = useTranslation();
  const onChange = (newValue) => {
    setValue(newValue);
  };
  const onPopupScroll = (e) => {
    console.log("onPopupScroll", e);
  };
  const [offerData, setOfferData] = useState({
    start_date: "",
    end_date: "",

    value: 1,
  });
  const [treeData, setTreeData] = useState({
    label: "",
    value: "",
  });
  const [details, setDetails] = useState([
    {
      id: 1,
      label: "",
      value: "",
    },
  ]);
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });
  const { data } = useSelector((state) => state.categories);
  // const { addLoading } = useSelector((state) => state.offers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, per_page: 700 }));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!offerData.start_date || !offerData.end_date || !offerData.value) {
      alert("Please fill in all required fields");
      return;
    }
   

  
    dispatch(addOffer(offerData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchOffers({ page: 1, per_page: 7 }));
          setOfferData({
           
          });
         
          setOpen(false);
        } else {
          toast.error(res?.payload || "There's an error while adding offer");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {});
  }

  function handleAddDetail() {
    setDetails([...details, { id: details.length + 1, label: "", value: "" }]);
  }

  function handleDeletDetail(id) {
    setDetails(details.filter((item) => item?.id != id));
  }

  useEffect(() => {
    console.log(data?.data?.categories);
  }, [data]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      title={t("addOfferText")}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("start_date")}</label>
            <input
              type="datetime-local"
              value={offerData.start_date}
              onChange={(e) =>
                setOfferData({ ...offerData, start_date: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <label>{t("end_date")}</label>
            <input
              type="datetime-local"
              value={offerData.end_date}
              onChange={(e) =>
                setOfferData({ ...offerData, end_date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("offer_value")}</label>
            <input
              type="number"
              onWheel={(e) => e?.target?.blur()}
              value={offerData.value}
              onChange={(e) =>
                setOfferData({ ...offerData, value: e.target.value })
              }
            />
          </div>

          
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#0d6efd] text-white w-full p-2 rounded-md"
        >
         {t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
