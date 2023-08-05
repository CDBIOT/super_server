import{Link} from 'react-router-dom'
import styles from './Navbar.module.css'
import logo from '../blue/logo.png';
import logo_toi from '../blue/logo_toi.png';

function Navbar(){

return(
    
<nav className={styles.navbar}>
<ul className={styles.list}>
<li>
   <div>
    <img src={logo} alt="Logo"/>
    <img src={logo_toi} alt="Logo"/>
    </div>
</li>
    <h1> Supermarket </h1>


        <li className={styles.item}>
            <Link to="/">Home</Link>
        </li>
    </ul>
    </nav>
   
)
}
export default Navbar

