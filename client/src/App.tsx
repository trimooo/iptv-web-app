import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Player from "@/pages/player";
import Manage from "@/pages/manage";
import NotFound from "@/pages/not-found";
import { IPTVProvider } from "@/context/IPTVContext";

function Router() {
  return (
    <div className="relative z-0">
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/player/:id" component={Player} />
          <Route path="/manage" component={Manage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IPTVProvider>
        <div className="relative">
          <Router />
          <Toaster />
        </div>
      </IPTVProvider>
    </QueryClientProvider>
  );
}

export default App;