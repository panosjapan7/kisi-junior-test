import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignInPage from "./SignInPage";
import GroupsPage from "./GroupsPage";

export default function App() {

  const [loginSecret, setLoginSecret] = useState("")

  return (
    <div className="App container-lg">
      <Routes>
        <Route path="/">
          <Route index element={<SignInPage setLoginSecret={setLoginSecret}/>} />
          <Route path="groups" element={<GroupsPage loginSecret={loginSecret} />} />
        </Route>
      </Routes>
    </div>
  );
}
