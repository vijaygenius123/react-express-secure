import {Suspense, useContext} from "react";
import {Switch, Route} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

const AuthenticatedRoute = ({children, ...rest}) => {
    const auth = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={() =>
                auth.isAuthenticated() ? (
                    <AppShell>{children}</AppShell>
                ) : (
                    <Redirect to="/"/>
                )
            }
        ></Route>
    );
};

const AdminRoute = ({children, ...rest}) => {
    const auth = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={() =>
                auth.isAuthenticated() && auth.isAdmin() ? (
                    <AppShell>{children}</AppShell>
                ) : (
                    <Redirect to="/"/>
                )
            }
        ></Route>
    );
};

const UnauthenticatedRoutes = () => (
    <Switch>
        <Route path="/login">
            <Login />
        </Route>
        <Route path="/signup">
            <Signup />
        </Route>
        <Route exact path="/">
            <Home />
        </Route>
        <Route path="*">
            <FourOFour />
        </Route>
    </Switch>
);


const AppRoutes = () => {
    return (
        <>
            <Suspense fallback={<LoadingFallback/>}>
                <Switch>
                    <AuthenticatedRoute path="/dashboard">
                        <Dashboard/>
                    </AuthenticatedRoute>
                    <AdminRoute path="/inventory">
                        <Inventory/>
                    </AdminRoute>
                    <AuthenticatedRoute path="/account">
                        <Account/>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path="/settings">
                        <Settings/>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path="/users">
                        <Users/>
                    </AuthenticatedRoute>
                    <UnauthenticatedRoutes/>
                </Switch>
            </Suspense>
        </>
    );
};

export default AppRoutes
