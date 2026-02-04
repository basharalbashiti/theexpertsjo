import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Categories from "@/pages/Categories";
import NotFound from "@/pages/not-found";

// Placeholder for other pages to keep "Same number of pages" structure working visually
const Sustainability = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
     <div className="text-center">
       <h1 className="text-4xl font-serif mb-4">Sustainability</h1>
       <p className="text-neutral-600 mb-8">Committed to eco-friendly hospitality solutions.</p>
       <a href="/" className="text-primary hover:underline">Return Home</a>
     </div>
  </div>
);

const Contact = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
     <div className="text-center">
       <h1 className="text-4xl font-serif mb-4">Contact Us</h1>
       <p className="text-neutral-600 mb-8">Get in touch with our team.</p>
       <a href="/" className="text-primary hover:underline">Return Home</a>
     </div>
  </div>
);


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={About} />
      <Route path="/categories" component={Categories} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router />
    </QueryClientProvider>
  );
}

export default App;
