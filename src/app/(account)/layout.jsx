import React from "react";
import AccountSidebar from "../_commponent/account/accountSideBar";
import Container from "../_commponent/utils/Container";

const AccountLayout = ({ children }) => {
  return (
    <div>
      <Container className="mx-auto flex gap-6 px-4 py-8">
        <AccountSidebar />
        <section className="flex-1 rounded-2xl border border-blue-600 bg-white p-4 shadow-2xl">
          {children}
        </section>
      </Container>
    </div>
  );
};

export default AccountLayout;
