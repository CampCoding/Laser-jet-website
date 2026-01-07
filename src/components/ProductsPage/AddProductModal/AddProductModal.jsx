import { Dropdown, Menu, Modal, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/categoriesSlice";
import { addProduct, fetchProducts } from "../../../features/productsSlice";
import { toast } from "react-toastify";
import { TreeSelect } from 'antd';
import { useTranslation } from "react-i18next";
import { FaEdit, FaEllipsisV } from "react-icons/fa";

export default function AddProductModal({ open, setOpen , setSelectedInputs , selectedInputs }) {
  const [value, setValue] = useState();
  const {t} = useTranslation();
  const onChange = (newValue) => {
    setValue(newValue);
  };
  const onPopupScroll = (e) => {
    console.log('onPopupScroll', e);
  };
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    is_active: false,
    category_id: "",
    image:[],
    sympol: "",
    quantity:1,
    installmentAvailable:false
  });
  const [treeData , setTreeData] = useState({
    label:"",
    value:""
  })
   const { data: installments, loading: installmentLoading } = useSelector(
      (state) => state?.installments
    );
  const [details, setDetails] = useState([
    {
      id: 1,
      label: "",
      value: "",
    },
  ]);
  const [imgs , setImgs] = useState({
    file:null,
    url:""
  })
  const { data } = useSelector((state) => state.categories);
  const { data: products, addLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, per_page: 1000 }));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!productData.title || !productData.price || !productData.category_id) {
      alert("Please fill in all required fields");
      return;
    }
    if (details.some(detail => !detail.label || !detail.value)) {
      toast.error("Please fill in all product details.");
      return;
    }

    const formData = new FormData();
    formData.append("description", productData.description);
    formData.append("title", productData.title);
    formData.append("price", productData.price);
    formData.append("is_active", productData.is_active);
    formData.append("category_id", productData.category_id);
    // formData.append("image", JSON.stringify(productData.image));
    formData.append("sympol", productData.sympol);
    formData.append("quantity", +productData.quantity);
    
    productData.image.forEach((detail, index) => {
      formData.append(`image`, detail);
    });

    details.forEach((detail, index) => {
      formData.append(`details[${index}][label]`, detail.label);
      formData.append(`details[${index}][value]`, detail.value);
    });

    dispatch(addProduct(formData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchProducts({ page: 1, per_page: 1000 }));
          setProductData({
            title: "",
            description: "",
            price: "",
            is_active: false,
            category_id: null,
            image: "",
            sympol: "",
            quantity:1,
          });
          setDetails([
            {
              id: 1,
              label: "",
              value: "",
            },
          ]);
          setOpen(false);
        } else {
          toast.error(res?.payload || "There's an error while adding product");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {

      });
  }

  function handleAddDetail() {
    setDetails([...details, { id: details.length + 1, label: "", value: "" }]);
  }

  function handleDeletDetail(id) {
    setDetails(details.filter((item) => item?.id != id));
  }

  function handleInputChange(e, key) {
    const value = e.target.value;
    setSelectedInputs((prev) =>
      prev?.map((item) =>
        item?.installment_id == key ? { ...item, value } : item
      )
    );
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      title={t("addProductText")}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("titleText")}</label>
            <input
              type="text"
              value={productData.title}
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("priceText")}</label>
            <input
              type="text"
              value={productData.price}
              onChange={(e) =>
                setProductData({ ...productData, price: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 gap-2">
        <div className="input-group">
          <label>{t("productCodeText")}</label>
          <input
            type="text"
            value={productData.sympol}
            onChange={(e) =>
              setProductData({ ...productData, sympol: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>{t("productQuantity")}</label>
          <input
            type="number"
            value={productData.quantity}
            onChange={(e) =>
              setProductData({ ...productData, quantity: e.target.value })
            }
          />
        </div>
        </div>

        <div className="input-group">
          <label>{t("description")}</label>
          <textarea
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          ></textarea>
        </div>

        <div className="input-group">
          <label>{t("categoryText")}</label>
          <select
           value={productData?.category_id}
            onChange={(e) =>
              setProductData({ ...productData, category_id: +e.target.value })
            }
          >
            <option value="" disabled selected>
              Select category...
            </option>
            {data?.data?.categories?.map((item) => (
              <option key={item?.category_id} value={item?.category_id}>
                {item?.title}
              </option>
            ))}
          </select>
       
        </div>

        <div className="input-group">
          <label>{t("imagesText")}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              setProductData({ ...productData, image: [...e.target.files] });
              setImgs({
                file:[...e.target.files],
                url:URL.createObjectURL(e.target.files[0])
              })
            }}
          />
        </div>

        {productData.image.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3">
          {productData.image.map((item ,idx) => 
          <div className="flex gap-2 items-center" key={idx}>
            <img src={URL.createObjectURL(item)} className="w-[100px] h-[100px] object-cover rounded-md"/>
            <FaTrash className="text-red-500" onClick={() => {
              const updateProduct = productData.image.filter((_  , index) => index != idx)
              setProductData({...productData , image : updateProduct})
              URL.revokeObjectURL(item)
            }}/>
          </div>
        )}
          </div>}

          <div className="flex gap-2 items-center mt-4">
          <Switch
            defaultChecked={productData.installmentAvailable}
            onChange={(e) => setProductData({ ...productData, installmentAvailable: e })}
          />
          <label className="text-[17px]">{t("Installmentavailable")}</label>
        </div>
        
        {productData?.installmentAvailable &&  <Dropdown
                      overlay={
                        <Menu>
                          {installmentLoading ? (
                            <Spin size="md" />
                          ) : (
                            installments?.data?.installmentTitles?.map((item) => (
                              <Menu.Item key={item.installment_id}>
                                <div
                                  // onClick={() =>
                                  //   handleInstallmentChange(item.installment_id)
                                  // }
                                  className="flex justify-between items-center w-full"
                                >
                                  <span>{item.installment_title}</span>
                                  <div className="flex gap-2">
                                    <FaEdit
                                      className="text-blue-500 cursor-pointer"
                                      // onClick={() => {
                                      //   setEditModal(true);
                                      //   setInstallmentData(item);
                                      // }}
                                    />
                                    <FaTrash
                                      className="text-red-500 cursor-pointer"
                                      // onClick={() => {
                                      //   setDeleteModal(true);
                                      //   setInstallmentData(item);
                                      // }}
                                    />
                                  </div>
                                </div>
                              </Menu.Item>
                            ))
                          )}
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <button className="p-2 bg-gray-200 rounded-md w-full flex justify-between">
                        {t("chooseInstallmentText")}
                        <FaEllipsisV />
                      </button>
                    </Dropdown>}

        <div className="">
          <div className="flex gap-2 justify-between items-center">
            <label>{t("propertyText")}</label>
            <FaPlus onClick={handleAddDetail} />
          </div>

          {details.map((item) => (
            <div className="flex gap-2 items-center my-3">
              <input
                className="p-2 border border-gray-200 outline-hidden rounded-md w-full"
                type="text"
                placeholder="label"
                value={item?.label}
                onChange={(e) =>
                  setDetails(
                    details.map((detail) =>
                      detail.id === item?.id
                        ? { ...detail, label: e.target.value }
                        : detail
                    )
                  )
                }
              />
              <input
                className="p-2 border border-gray-200 outline-hidden rounded-md w-full"
                type="text"
                placeholder="Value"
                value={item?.value}
                onChange={(e) =>
                  setDetails(
                    details.map((detail) =>
                      detail.id === item?.id
                        ? { ...detail, value: e.target.value }
                        : detail
                    )
                  )
                }
              />
              <FaTrash
                className="text-red-600 text-[30px]"
                onClick={() => handleDeletDetail(item?.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Switch
            defaultChecked={productData.is_active}
            onChange={(e) => setProductData({ ...productData, is_active: e })}
          />
          <label className="text-[17px]">{t("isActiveText")}</label>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#0d6efd] text-white w-full p-2 rounded-md"
        >
          {addLoading ? t("loadingText") : t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
