import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./store";
import ShopLayout from "./shop/Layout";
import Home from "./shop/Home";
import Shop from "./shop/Shop";
import ProductPage from "./shop/Product";
import { Article, Journal } from "./shop/Journal";
import { Checkout, OrderSuccess } from "./shop/Checkout";
import Account from "./shop/Account";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import { ProductEdit, Products } from "./admin/Products";
import { Content, ContentEdit } from "./admin/Content";
import { Customers, Orders } from "./admin/Orders";
import Settings from "./admin/Settings";
import "./shop/shop.css";

function NotFound() {
  return <div className="container empty" style={{ padding: "100px 0" }}><h3>Page not found</h3><p>The page you're looking for has moved or no longer exists.</p><Link className="btn" to="/" style={{ marginTop: 16 }}>Back home</Link></div>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:id" element={<Article />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderSuccess />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="content" element={<Content />} />
            <Route path="content/:id" element={<ContentEdit />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
