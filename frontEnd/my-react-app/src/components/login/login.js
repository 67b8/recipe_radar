import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authentication';
function Login() {
  const navigate = useNavigate();
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = async (e) => {
        e.preventDefault();
        if (auth.loginAction) {
            try {
                const user = await auth.loginAction({ email, password });
                if (user.usertype === 1) {
                    navigate('/admindashboard');
                } else if ( user.usertype ===0) {
                    navigate('/userdashboard');
                }
            } catch (error) {
                alert('invalid username or password')
                console.error("Login failed", error);
            }
        } 
        else{
            console.error("no loginaction available")
        }
    }
    return (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: 25 }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#FFA500" }}>
                                            LOGIN
                                        </p>
                                        <form className="mx-1 mx-md-4">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw" style={{ color: "#FFA500" }} />
                                                <div data-mdb-input-init="" className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="email"
                                                        id="form3Example3c"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw" style={{ color: "#FFA500" }} />
                                                <div data-mdb-input-init="" className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="password"
                                                        id="form3Example4c"
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <p>Don't have an account? <Link to='/register'>Sign up</Link></p>
                                                <p>Or go to <Link to='/'>Home</Link></p>
                                            </div>
                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button
                                                    type="button"
                                                    data-mdb-button-init=""
                                                    data-mdb-ripple-init=""
                                                    className="btn btn-lg"
                                                    style={{ backgroundColor: "#FFA500", color: "white" }}
                                                    onClick={handleClick}
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2" style={{ width: "50%" }}>
                                        <img
                                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                            src="https://wallpaperaccess.com/full/767054.jpg"
                                            className="img-fluid"
                                            alt="Sample image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
