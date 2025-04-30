import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./Components/utils/PrivateRoute";
import EditForm from "./Components/Form/EditForm";
import UserView from "./Components/Responding/UserView";
import ErrorRadios from "./Components/Responding/RadioCheck";
import { FormProvider } from "./context/FormContext";
import AdminPanel from "./pages/AdminPanel";
import AdminRegister from "./pages/AdminRegister";
import AdminForms from "./pages/Admin/AdminForms";
import AdminTeam from "./pages/Admin/AdminTeam";
import AdminUser from "./pages/Admin/AdminUser";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FormProvider>
        <Router>
          {/* <Navbar /> */}
          <div className="container mt-5 pt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registerAdmin" element={<AdminRegister />} />

              {/* Protected Routes */}
              {/* <Route element={<PrivateRoute />}> */}
              <Route path="/form/:formId" element={<EditForm />} />
              {/* </Route> */}

              {/* Public Form View */}
              <Route path="/s/:formId" element={<UserView />} />
              <Route path="/fuck" element={<ErrorRadios />} />

              <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<AdminPanel />} />

                {/* <Route
                  path="/admin/users"
                  element={<UserTable isTeam={false} />}
                /> */}

                <Route path="/admin/users" element={<AdminUser />} />

                {/* <Route
                  path="/admin/admins"
                  element={<UserTable isTeam={true} />}
                /> */}
                <Route path="/admin/admins" element={<AdminTeam />} />

                {/* <Route path="/admin/forms" element={<FormTable />} /> */}
                <Route path="/admin/forms" element={<AdminForms />} />
              </Route>
            </Routes>
          </div>
          {/* <Footer /> */}
        </Router>
      </FormProvider>
    </AuthProvider>
  );
};

export default App;
