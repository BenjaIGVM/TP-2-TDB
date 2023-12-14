import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { UserProvider } from "../utils/userContext";
import { GroupProvider } from "@/utils/groupContext";
import { useTheme } from "next-themes";
import ConfirmModal from "@/components/ConfirmModal";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export default function App({ Component, pageProps }) {
  const { resolvedTheme } = useTheme();
  const [screenWidth, setWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(null);
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLayout =
    Component.getLayout ||
    ((page) => <div className="absolute left-0 right-0">{page}</div>);

  const showModal = async (handleConfirm, msg) => {
    const auxConfirm = async () => {
      await handleConfirm();
      setModalOpen(false);
    };
    setModalMsg(msg);
    setModalOpen(true);
    setModalConfirm(() => auxConfirm);
  };

  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),      
  });

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <GroupProvider>
          <ThemeProvider>
            <div
              className={`fixed bottom-0 left-0 right-0 top-0 z-[-1] ${
                resolvedTheme === "light" ? "" : " opacity-80 "
              } bg-background bg-cover bg-fixed`}
            />

            {getLayout(
              <Component
                {...pageProps}
                screenWidth={screenWidth}
                showModal={showModal}
              />,
              screenWidth
            )}

            {modalOpen && (
              <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={modalConfirm}
                msg={modalMsg}
              />
            )}
          </ThemeProvider>
        </GroupProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
