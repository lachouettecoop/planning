import React from "react";
import { Image } from "@chakra-ui/core";
import src from "./logo.jpg";

const Logo = props => {
  return <Image {...props} src={src} alt="Logo de La Chouette Coop" />;
};

export default Logo;
