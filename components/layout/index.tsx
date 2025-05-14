import { NextPage } from "next";
import Navbar from "../navbar";
import Footer from "../footer";

const Layout: NextPage<React.PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            <main> { children } </main>
            <Footer></Footer>
        </div>
    )
}
export default Layout ;