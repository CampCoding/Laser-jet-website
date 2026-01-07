import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSocial, deleteSocial, editSocial, fetchSocial } from "../../../features/SocialLinksSlice";
import { Modal, Table } from "antd";
import { toast } from "react-toastify";

const OPTIONS = [
  { id: 1, label: "Facebook", value: "facebook", icon: "mdi-facebook" },
  { id: 2, label: "Twitter", value: "twitter", icon: "mdi-twitter" },
  { id: 3, label: "Instagram", value: "instagram", icon: "mdi-instagram" },
  { id: 4, label: "Linkedin", value: "linkedin", icon: "mdi-linkedin" },
  { id: 5, label: "Youtube", value: "youtube", icon: "mdi-youtube" },
  { id: 6, label: "Snapchat", value: "snapchat", icon: "mdi-snapchat" },
  { id: 7, label: "Pinterest", value: "pinterest", icon: "mdi-pinterest" },
  { id: 8, label: "Reddit", value: "reddit", icon: "mdi-reddit" },
  { id: 9, label: "Tumblr", value: "tumblr", icon: "mdi-tumblr" },
  { id: 10, label: "Medium", value: "medium", icon: "mdi-medium" },
  { id: 11, label: "WhatsApp", value: "whatsapp", icon: "mdi-whatsapp" },
  { id: 12, label: "Telegram", value: "telegram", icon: "mdi-telegram" },
  { id: 13, label: "WeChat", value: "wechat", icon: "mdi-wechat" },
  { id: 14, label: "Slack", value: "slack", icon: "mdi-slack" },
  { id: 15, label: "Discord", value: "discord", icon: "mdi-discord" },
  { id: 16, label: "Skype", value: "skype", icon: "mdi-skype" },
  { id: 17, label: "Signal", value: "signal", icon: "mdi-signal" },
  { id: 18, label: "Messenger", value: "messenger", icon: "mdi-facebook-messenger" },
  { id: 19, label: "Twitch", value: "twitch", icon: "mdi-twitch" },
  { id: 20, label: "Github", value: "github", icon: "mdi-github" },
  { id: 21, label: "GitLab", value: "gitlab", icon: "mdi-gitlab" },
  { id: 22, label: "Bitbucket", value: "bitbucket", icon: "mdi-bitbucket" },
  { id: 23, label: "Stack Overflow", value: "stack-overflow", icon: "mdi-stack-overflow" },
  { id: 24, label: "Dribbble", value: "dribble", icon: "mdi-dribbble" },
  { id: 25, label: "Behance", value: "behance", icon: "mdi-behance" },
  { id: 26, label: "DeviantArt", value: "deviantart", icon: "mdi-deviantart" },
  { id: 27, label: "Flickr", value: "flickr", icon: "mdi-flickr" },
  { id: 28, label: "Quora", value: "quora", icon: "mdi-quora" },
  { id: 29, label: "Spotify", value: "spotify", icon: "mdi-spotify" },
  { id: 30, label: "SoundCloud", value: "soundcloud", icon: "mdi-soundcloud" },
  { id: 31, label: "Patreon", value: "patreon", icon: "mdi-patreon" },
  { id: 32, label: "Kickstarter", value: "kickstarter", icon: "mdi-kickstarter" }
];


export default function SocialLinks() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [socialData, setSocialData] = useState({
    link: "",
    icon: "",
  });
  const dispatch = useDispatch();
  const { data, loading, addLoading, editLoading , deleteLoading, error } = useSelector(
    (state) => state?.socials
  );
  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "icon",
      key: "icon",
      title: "ايقونه",
      render: (row) =>
         
        {
          console.log(row)
         return (
          <i className={`mdi ${row}`} style={{ fontSize: "30px", marginRight: "5px" }}></i>
         )
        }
      //   (
      //   // <span
      //   //   style={{ width: "5vh", height: "5vh" }}
      //   //   className={`mdi ${row}`}
      //   // ></span>
      
      // )
      ,
    },
    {
      dataIndex: "link",
      key: "link",
      title: "رابط التواصل الاجتماعي",
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
    dispatch(fetchSocial());
  }, [dispatch]);

  function handleSubmit() {
    const data_send = {
      ...socialData,
    };
    dispatch(addSocial(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchSocial());
          setOpenAddModal(false);
          setSocialData({
            link: "",
            icon: "",
          });
        } else {
          toast.error(res?.payload || "There's error while adding social Data");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setOpenAddModal(false);
      });
  }

  function handleEdit() {
    const data_send = {
      social_media_id : rowData?.id , 
      link:rowData?.link,
      icon:rowData?.icon
    };
    dispatch(editSocial(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchSocial());
          setOpenEditModal(false);
          setRowData({});
        } else {
          toast.error(
            res?.payload || "There's error while updating social Data"
          );
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setOpenEditModal(false);
      });
  }

  function handleDelete() {
    const data_send = {
      social_media_id : rowData?.id , 
    };
    dispatch(deleteSocial(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchSocial());
          setOpenDeleteModal(false);
          setRowData({});
        } else {
          toast.error(
            res?.payload || "There's error while deleting social Data"
          );
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setOpenDeleteModal(false);
      });
  }

  

  return (
    <div className="border border-[#ddd] p-[2vh]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-[25px] text-[#0d6efd]">
            روابط التواصل الإجتماعي({data?.data?.socialMediaLinks?.length})
          </h3>
          <p className="font-medium">
            قم بإدارة روابط حسابات التواصل الإجتماعي الخاصة بك
          </p>
        </div>
        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          اضافه
        </button>
      </div>

      <Modal
        open={openAddModal}
        title="إنشاء رابط تواصل إجتماعي"
        onClose={() => setOpenAddModal(false)}
        onCancel={() => setOpenAddModal(false)}
        okText={addLoading ? "Loading..." : "حفظ"}
        cancelText="الغاء"
        onOk={handleSubmit}
      >
        <div>
          <div className="input-group">
            <label>الأيقونه</label>
            <select
              value={socialData.icon}
              onChange={(e) =>
                setSocialData({ ...socialData, icon: e.target.value })
              }
            >
              <option disabled selected>
                الأيقونه
              </option>
              {OPTIONS.map((item) => (
                <option key={item?.id} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>رابط التواصل الاجتماعي</label>
            <input
              type="text"
              value={socialData?.link}
              onChange={(e) =>
                setSocialData({ ...socialData, link: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={openEditModal}
        title="تعديل رابط تواصل إجتماعي"
        onClose={() => setOpenEditModal(false)}
        onCancel={() => setOpenEditModal(false)}
        okText={editLoading ? "Loading..." : "تعديل"}
        cancelText="الغاء"
        onOk={handleEdit}
      >
        <div>
          <div className="input-group">
            <label>الأيقونه</label>
            <select
              value={rowData.icon}
              onChange={(e) => setRowData({ ...rowData, icon: e.target.value })}
            >
              <option disabled selected>
                الأيقونه
              </option>
              {OPTIONS.map((item) => (
                <option key={item?.id} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>رابط التواصل الاجتماعي</label>
            <input
              type="text"
              value={rowData?.link}
              onChange={(e) => setRowData({ ...rowData, link: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal  open={openDeleteModal}
        title="هل أنت متأكد "
        onClose={() => setOpenDeleteModal(false)}
        onCancel={() => setOpenDeleteModal(false)}
        okText={deleteLoading ? "Loading..." : "حذف"}
        cancelText="الغاء"
        onOk={handleDelete}>
            <h3>أنت على وشك حذف هذا اللينك, سيتم حذفه نهائياً ولن تتمكن من إستعادته</h3>
        </Modal>

      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.data?.socialMediaLinks}
      />
    </div>
  );
}
