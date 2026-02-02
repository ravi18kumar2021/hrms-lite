import { NavLink } from "react-router";

export default function Navbar() {
    return (
        <nav className="my-4 flex justify-evenly text-white">
            <NavLink to="/" className="italic font-semibold bg-green-600 px-4 py-2 rounded">Home</NavLink>
            <NavLink to="/employees" className="italic font-semibold bg-red-600 px-4 py-2 rounded">Employees</NavLink>
            <NavLink to="/attendance" className="italic font-semibold bg-violet-600 px-4 py-2 rounded">Attendance</NavLink>
        </nav>
    )
}