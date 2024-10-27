import "./Sidebar.scss"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import HomeIcon from '@mui/icons-material/Home';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatIcon from '@mui/icons-material/Chat';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CategoryIcon from '@mui/icons-material/Category';

const Sidebar = ({ logout }) => {
	const [isShowMenu, setShowMenu] = useState(true);

	return (
		<div className={`sidebar ${isShowMenu ? "show" : ""}`}>
			<header>
				<button onClick={() => setShowMenu(prev => !prev)}>
					<figure></figure>
					<figure></figure>
					<figure></figure>
				</button>
				{isShowMenu && <NavLink className={`nav-link`}>Store panel</NavLink>}
			</header>

			<nav>
				<NavLink
					to="/dashboard"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={HomeIcon} />
					<span>Головна</span>
				</NavLink>
				<NavLink
					to="/products"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={ViewModuleIcon} />
					<span>Товари</span>
				</NavLink>
				<NavLink
					to="/categories"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={CategoryIcon} />
					<span>Категорії</span>
				</NavLink>
				<NavLink
					to="/orders"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={ShoppingBagIcon} />
					<span>Замовлення</span>
				</NavLink>
				<NavLink
					to="/clients"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={PeopleAltIcon} />
					<span>Клієнти</span>
				</NavLink>
				<NavLink
					to="/comments"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={ChatIcon} />
					<span>Коментарі</span>
				</NavLink>
				<NavLink
					to="/employees"
					className={({ isActive }) => `nav-link ${isActive ? 'current' : ''}`}>
					<SvgIcon component={EngineeringIcon} />
					<span>Працівники</span>
				</NavLink>
			</nav>
			<footer>
				<button onClick={logout}>
					<SvgIcon component={LogoutIcon} />
					<span>Вийти</span>
				</button>
			</footer>
		</div>
	)
}

export default Sidebar;
