import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import withAuth from "../middleware/withAuth";

const CerrarSesion = () => {
  const client = useApolloClient();
  const router = useRouter();

  const handleCerrarSesion = () => {
    Cookies.remove("token");
    client.clearStore();
    router.push("/login");
  };

  return <button onClick={handleCerrarSesion}>Cerrar sesión</button>;
};

export default withAuth(CerrarSesion);
