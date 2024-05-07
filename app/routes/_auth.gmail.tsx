import { useEffect } from "react";
import gmail from "~/lib/gmail";

const Gmail = () => {
  useEffect(() => {
    gmail();
  });
  return <div>Gmail</div>;
};

export default Gmail;
