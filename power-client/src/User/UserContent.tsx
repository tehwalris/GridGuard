import { createStyles } from "@mantine/core";
import { State } from "power-shared";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import UserDetails from "./UserDetails";
import UserHome from "./UserHome";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();

 

  return (
    <>
      <Routes>
        <Route path="home" element={<UserHome state={state} />} />
        <Route path="details" element={<UserDetails state={state} />} />
      </Routes>
    </>
  );
}

export default UserContent;
