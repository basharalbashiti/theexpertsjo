import { LanguageProvider } from "./context/LanguageContext";
import { Switch, Route, Router } from "wouter";
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
import Spa from "@/pages/Spa";
import Amenities from "@/pages/Amenities";
import BuffetBanqueting from "@/pages/BuffetBanqueting";
import FoodBeverage from "@/pages/FoodBeverage";
import LinensHousekeeping from "@/pages/LinensHousekeeping";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/partners" component={Partners} />
      <Route path="/room-service" component={RoomService} />
      <Route path="/spa" component={Spa} />
      <Route path="/amenities" component={Amenities} />
      <Route path="/buffet-banqueting" component={BuffetBanqueting} />
      <Route path="/food-beverage" component={FoodBeverage} />
      <Route path="/linens" component={LinensHousekeeping} />
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
        <Router>
          <AppRoutes />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
