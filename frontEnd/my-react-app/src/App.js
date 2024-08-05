import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ProfilePage from './components/ProfilePage/ProfilePage.js';
import RecipeForm from './components/RecipeForm/RecipeForm.js';
import SearchResults from './components/SearchComponent/searchComponent.js';
import UserDetail from './components/ShowRecipe/UserDetail.js';
import ShowRecipe from './components/ShowRecipe/showRecipe.js';
import Admindashboard from './components/admindashboard/admindashboard.js';
import Home from './components/home/home.js';
import Login from './components/login/login.js';
import Register from './components/registration/registration.js';
import Userdashboard from './components/userdashboard/userdashboard.js';
import AuthProvider from './context/authentication.js';
import AdminProtect from './protectedComponents/protectDashboard.js';
import ProtectRecipe from './protectedComponents/protectrecipe.js';
import UserProtect from './protectedComponents/userProtect.js'; 
class App extends React.Component {

  render() {
    return (
      <>
    
      <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' exact element={<Home />}></Route>
          <Route path='/login' exact element={<Login />}></Route>
          <Route element={<ProtectRecipe />}>
          <Route path="/recipe/:id" element={<ShowRecipe />} />
        </Route>
          <Route path='/register' exact element={<Register />}></Route>
          
          <Route element={<AdminProtect/>}> 
          <Route path='/admindashboard' exact element={<Admindashboard/>}></Route>

          <Route path='/addrecipe' exact element={<RecipeForm/>}></Route>
          </Route >
          <Route element={<UserProtect/>}> 
          <Route path='/userdashboard' exact element={<Userdashboard/>}></Route>
          </Route >
          
          <Route path='/search/:criteria/:term' exact element={<SearchResults/>}> </Route>
           <Route path='/user/:id' exact element={<UserDetail/>}></Route>
           <Route path='/profile' exact element={<ProfilePage/>}></Route>
        </Routes>

         </AuthProvider>
      </Router>
   





      </>
    )
  }
}

export default App;
