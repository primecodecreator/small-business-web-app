import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { StoreComponent } from "./pages/store-component";
import { Aboutcomponent } from "./pages/about-component";
import { HomeComponent } from "./pages/home-component";
import { NavBarComponent } from "./components/navbar-component";
import { ShoppingCartProvider } from "./context/shopping-cart-context";
function App() {
  return (
    <ShoppingCartProvider>
      <NavBarComponent></NavBarComponent>
      <Container className="mb-4">
        <Routes>
          <Route path="/home" element={<HomeComponent />}>
            {" "}
          </Route>
          <Route path="/" element={<StoreComponent />}>
            {" "}
          </Route>
          <Route path="/store" element={<StoreComponent />}>
            {" "}
          </Route>
          <Route path="*" element={<StoreComponent />}>
            {" "}
          </Route>
          <Route path="/about" element={<Aboutcomponent />}>
            {" "}
          </Route>
        </Routes>
      </Container>
    </ShoppingCartProvider>
  );
}

/** componrnt logic */

export default App;
