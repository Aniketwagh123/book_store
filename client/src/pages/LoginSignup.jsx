import "./LoginSignup.scss";
import { TextField } from "@mui/material";
import logo from "../assets/images/logo.png";

export default function Login() {

 


  return (
    <>
      <div className="login-container">
        <div className="logo-container">
          <img
            src={logo}
            alt="img"
            style={{
              width: "70%",
              height: "60%",
              marginLeft: "0%",
              borderRadius: "50%",
              marginTop: "7%",
            }}
          />
          <div
            style={{
              marginTop: "7%",
              width: "70%",
            }}
          >
            <h3
              style={{
                marginTop: "7%",
                width: "100%",
                textAlign: "center",
                fontSize: "1.4em",
              }}
            >
              ONLINE BOOK SHOPPING
            </h3>
          </div>
        </div>
        <div className="form-container">
          <div className="form-header">
            <div>
              <h2
                style={{
                  fontSize: "1.8em",
                  cursor: "pointer",
                  height: "1.1em",
                  padding: "0%",
                }}
              >
                LOGIN
                <hr
                  style={{
                    marginTop: "0%",
                    height: "20%",
                    backgroundColor: "maroon",
                    width: "40%",
                    borderRadius: "10px",
                  }}
                />
              </h2>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "1.8em",
                  cursor: "pointer",
                  height: "1.1em",
                  padding: "0%",
                  color: "gray",
                }}
              >
                SIGNUP
              </h2>
            </div>
          </div>
          <div className="login-form-body">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "15%",
              }}
            >
              <label htmlFor="" style={{ textAlign: "left" }}>
                Email Id
              </label>
              <TextField
                sx={{ width: "80%" }}
                size="small"
              />
            </div>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "15%",
              }}
            >
              <label htmlFor="" style={{ textAlign: "left" }}>
                Password
              </label>
              <TextField
                sx={{ width: "80%" }}
                size="small"
              />
              <label
                style={{ marginLeft: "28%", color: "grey", cursor: "pointer" }}
              >
                Forgot Password?
              </label>
            </div>
            <br />
            <div style={{ width: "80%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "86%",
                  height: "2.5em",
                  backgroundColor: "maroon",
                  color: "white",
                  marginLeft: "19%",
                  cursor: "pointer",
                }}
              >
                Login
              </div>
            </div>
          </div>
          <div className="login-form-footer">
            <hr
              style={{
                border: "1px solid lightgray",
                width: "20%",
                marginLeft: "25%",
              }}
            />
            <h3>OR</h3>
            <hr
              style={{
                border: "1px solid lightgray",
                width: "20%",
                marginRight: "25%",
              }}
            />
          </div>
          <div
            className="footer-button"
            style={{
              height: "25%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "33%",
                height: "2.5em",
                textAlign: "center",
                paddingTop: "1.6%",
                marginRight: "2%",
                marginLeft: "1%",
                backgroundColor: "#4266B2",
                color: "white",
                cursor: "pointer",
              }}
            >
              Facebook
            </div>
            <div
              style={{
                width: "33%",
                height: "2.5em",
                textAlign: "center",
                paddingTop: "1.6%",
                backgroundColor: "lightgray",
                cursor: "pointer",
              }}
            >
              Google
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
