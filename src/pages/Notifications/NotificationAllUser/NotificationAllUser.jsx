import React from 'react'

export default function NotificationAllUser() {
  return (
    <div className="my-4">
          <form className="flex flex-col gap-3">
            <div className="input-group">
              <label>{t("titleText")}</label>
              <input type="text" />
            </div>

            <div className="input-group">
              <label>{t("description")}</label>
              <textarea></textarea>
            </div>

            <div className="input-group">
              <label>{t("imageText")} ({t("optionalText")})</label>
              <input type="file" />
            </div>

            <button className="bg-[#0d6efd] text-white p-4 rounded-lg w-fit">
              {t("sendText")}
            </button>
          </form>
        </div>
  )
}
