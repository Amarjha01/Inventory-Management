import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/ui/Button";
import Card from "../../components/shared/ui/Card";
import Input from "../../components/shared/ui/Input";
import { login } from "../../services/auth.service";

const Login = () => {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        try{

            setLoading(true);

            const response = await login(phone,password);
            
            localStorage.setItem("user",JSON.stringify(response));

            switch (response.role) {

    case "Kitchen Incharge":
        case "Store Incharge":
        navigate("/new-requirement");
        break;

    case "Store Supervisor":
    
    case "Admin":

        navigate("/store");
        break;

    default:

        navigate("/login");

}

        }

        catch(err){

            setError(err.message);

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

            <Card className="w-full max-w-md">

                <h1 className="text-3xl font-bold text-center">

                    Welcome Back

                </h1>

                <p className="text-center text-gray-500 mt-2">

                    Login to continue

                </p>

                <div className="space-y-5 mt-8">

                    <Input
  type="tel"
  value={phone}
  maxLength={10}
  placeholder="Type Phone Number"
  onKeyDown={(e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
  onChange={(e) =>
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
  }
/>

                    <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="******"
                    />

                </div>

                {

                    error &&

                    <p className="text-red-500 mt-4">

                        {error}

                    </p>

                }

                <Button
                className="mt-8"
                onClick={handleLogin}
                >

                    {loading ? "Logging in..." : "Login"}

                </Button>

            </Card>

        </div>

    )

}

export default Login;