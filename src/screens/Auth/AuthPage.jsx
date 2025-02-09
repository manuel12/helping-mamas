import { Button } from "flowbite-react";
import "focus-visible/dist/focus-visible.min.js";
import { signIn } from "next-auth/react";
import "normalize.css";
import PropTypes from "prop-types";
import { useContext } from "react";
import Footer from "../../components/Footer";
import Text from "../../components/Text";
import { RequestContext } from "../../providers/RequestProvider";
import AuthForm from "./AuthForm";

const AuthPage = (props) => {
  const login = async (e) => {
    e.preventDefault();
    const signin = signIn("google");
  };

  return (
    <div className="flex-column my-4 flex h-full w-full items-center justify-center">
      <div
        className={
          "flex-column mx-auto mb-8 flex w-5/6 items-center justify-center rounded-xl border p-8 shadow-xl sm:w-[28rem] " +
          (props.createAccount ? "mt-64 md:mt-48" : "mt-16")
        }
      >
        {/* <img
          alt="Bits of Good Logo"
          src="/images/bog_logo.png"
          style={{ width: "100%", marginBottom: "2px" }}
        /> */}
        <Text
          text={props.createAccount ? "Create an Account" : "Sign In"}
          type="header"
          className="mb-4 pt-3"
        />
        <div className="flex w-full flex-wrap items-center gap-2">
          <Button color="light" className="w-full py-1" onClick={login}>
            <img
              alt="Google Logo"
              src="/images/google.svg"
              className="mr-2 h-6 w-6"
            />
            <p className="my-0 text-lg">Continue with Google</p>
          </Button>
        </div>
        <div className="mb-1 mt-4 flex w-full items-center justify-between">
          <hr size="150" width="150" color="#6C757D" />
          <Text text="OR" />
          <hr size="150" width="150" color="#6C757D" />
        </div>
        <br></br>
        <AuthForm
          createAccount={props.createAccount}
          context={useContext(RequestContext)}
        />
        <div className="mt-1 flex items-center">
          {props.createAccount
            ? "Already have an account?"
            : "Don't have an account?"}
          <Text
            text={props.createAccount ? "Sign In" : "Create an account"}
            href={`${window.location.origin}/${
              props.createAccount ? "login" : "create-account"
            }`}
            className="ml-2"
          />
        </div>
        {/*{!props.createAccount && (*/}
        {/*  <div className="mt-1 flex items-center">*/}
        {/*    Forgot Password?*/}
        {/*    <Text*/}
        {/*      text={"Reset Password"}*/}
        {/*      href={`${window.location.origin}/${*/}
        {/*        props.createAccount ? "login" : "create-account"*/}
        {/*      }`}*/}
        {/*      className="ml-2"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      <div className="grow" />
      <Footer />
    </div>
  );
};

export default AuthPage;

AuthPage.propTypes = {
  createAccount: PropTypes.bool,
};
