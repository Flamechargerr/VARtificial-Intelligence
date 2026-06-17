import { Toaster } from "@/shared/components/ui/toaster";
import Index from "@/shared/pages/Index";
import { ThemeProvider } from "@/shared/components/layout/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <Index />
    </ThemeProvider>
  );
};

export default App;
