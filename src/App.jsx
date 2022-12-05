import MainLayout from "./layouts/main";
import AuthProvider from "./contexts/AuthContext";
import { AppsProvider } from "./contexts/AppsContext";
import { MantineProvider } from '@mantine/core';

require('dotenv').config()


export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <AppsProvider>
            <MainLayout />
        </AppsProvider>
      </AuthProvider>
    </MantineProvider>
  );
}