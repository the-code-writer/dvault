/* eslint-disable */
import React from "react";
import { Routes as BrowserRoutes, Route, Navigate } from "react-router-dom";
import { Send, Transactions, TransactionDetails, Http404NotFound } from "../_pages";

const Routes: React.FC = () => {
  return (
    <>
      <BrowserRoutes>
        <Route path="/" element={<Send />} />
        <Route path="/send" element={<Send />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:transactionId" element={<TransactionDetails />} />
        <Route path="/404" element={<Http404NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </BrowserRoutes>
    </>
  );
};

export { Routes };
