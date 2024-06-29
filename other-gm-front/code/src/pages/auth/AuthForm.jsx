import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string()
});


export const AuthForm = () => {
  const navigate = useNavigate();
  const [toggleSignUpLogin, setToggle] = useState(1);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(toggleSignUpLogin === 1 ? signupSchema : loginSchema),
  });


  const handleClickSignUp = () => {
    setToggle(1);
  };
  const handleClickLogIn = () => {
    setToggle(-1);
  };


  function handleLogIn(username) {
    localStorage.setItem("user", JSON.stringify({ username }));
    navigate('/games');
  }


  const onSubmit = async (data) => {
    try {
      if (toggleSignUpLogin === -1) {
        submitLogIn(data);
      } else {
        submitSignUp(data);
      }
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  }

  const submitLogIn = (data) => {
    console.log("IN LOGIN WITH DATA: ", data);
    const username = data.username;

    fetch("/api/misc/login", {
      method: "post",
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(errorData);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
        handleLogIn(username);


      })
      .catch((error) => {
        setError("root", {
          message: error.message,
        });
      });
  };

  const submitSignUp = (data) => {
    const username = data.username;


    fetch("/api/misc/signup", {
      method: "post",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {

          throw new Error(errorData);
        });
      }
      return res.json();
    })
      .then((data) => {
        console.log(data);
        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
        handleLogIn(username);
      })
      .catch((error) => {

        setError("root", {
          message: error.message,
        });
      });
  };




  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate('/games');
    }
  }, [navigate]);
  return (
    <div className="login-form">
      {toggleSignUpLogin == -1 ? <h1>Log In</h1> : <h1>Sign Up</h1>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username")} type="username" placeholder="Username" />

        {errors.username && (<div>{errors.username.message}</div>)}

        {toggleSignUpLogin == 1 && (

          <>
            <input {...register("email")} type="email" placeholder="Email" />

            {errors.email && (<div>{errors.email.message}</div>)}
          </>

        )}

        <input {...register("password")} type="password" placeholder="Password" />

        {errors.password && (<div>{errors.password.message}</div>)}

        <button className="button-style-1" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>

        {errors.root && <div>{errors.root.message}</div>}
      </form>
      <div id="login-or-signup-options">
        <button className="button-style-2"
          type="button"
          id="login-button"
          onClick={handleClickLogIn}> Login </button>
        <button className="button-style-2"
          type="button"
          id="signup-button"
          onClick={handleClickSignUp}> Sign up </button>
      </div>
    </div>
  )
}
