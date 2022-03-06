import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Exchange from "./views/Exchange/Exchange";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Exchange />
    </QueryClientProvider>
  );
}

export default App;
