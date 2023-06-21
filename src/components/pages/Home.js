import React from "react"
import { useState, useEffect } from 'react'
import Axios from "axios";
import cart from "../../blue/cart.png"
import styles from './Home.module.css'

function Home() {

    
const [bd_Status, setBdStatus] = useState('');
const [status, setStatus] = useState(false);
const [data, setData] = useState('');

async function getStatus(e){
  
  //e.preventDefault()
  
const options = {
  method: 'GET',
  cache: 'default',
  header: { 'Access-Control-Allow-Origin':'*',mode: 'cors',
  'Content-Type': 'application/json' },
  redirect: 'follow'
  };

   Axios.get("https://super-server-eta.vercel.app/",options)
   .then((response) =>{

        setData(response.data.message) 
        setStatus(data.status);
        setBdStatus(data.bd_Status);
   {
    console.log(data)
    console.log(status)
    console.log(bd_Status)  

    }
   });
   
}

useEffect(() => {
  getStatus()
   
}, [])
    return( 
    <div>
    <h1> Home </h1>
    <h1> Bem vindo ao Supermercado Vercel</h1>
    
    <h1>Status{status}</h1>
    <h1>BD_Status{bd_Status}</h1>
    <label value = {status}></label>
{/*     
    {data.map((data, index) => (
    <tr key = {index}>
        <td >{data.status}</td>
    </tr>))} */}

    <img src={cart} alt="cart"/>

    </div>
    )
}
export default Home