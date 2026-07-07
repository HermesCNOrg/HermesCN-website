import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import { GithubLink, MainSiteLink } from "@site/src/components/NavbarLinks";
import NavbarSearch from "@site/src/components/NavbarSearch";

export default {
  ...ComponentTypes,
  "custom-main-site": MainSiteLink,
  "custom-github": GithubLink,
  "custom-search": NavbarSearch,
};
