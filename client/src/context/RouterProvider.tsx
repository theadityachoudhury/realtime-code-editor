import { BrowserRouter } from "react-router-dom";

function RouterProvider({ children }: { children: React.ReactNode }) { 
    return (
        <BrowserRouter>
                {children}
        </BrowserRouter>
        
    )
};

export default RouterProvider;