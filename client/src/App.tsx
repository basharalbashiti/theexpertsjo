import { LanguageProvider } from "./context/LanguageContext";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Categories from "@/pages/Categories";
import Sustainability from "@/pages/Sustainability";
import Contact from "@/pages/Contact";
import Partners from "@/pages/Partners";
import RoomService from "@/pages/RoomService";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/partners" component={Partners} />
      <Route path="/room-service" component={RoomService} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Toaster />
        <Router />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
