import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            setLoading(true);
            const result = await apiFetch('employees/');
            setEmployees(result.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            await apiFetch('employees/create', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            setForm({
                employee_id: '',
                full_name: '',
                email: '',
                department: ''
            });
            loadEmployees();
        } catch (error) {
            setError(error.message)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this employee?')) return;
        try {
            await apiFetch(`employees/delete/${id}`, {
                method: 'DELETE'
            });
            loadEmployees();
        } catch (error) {
            setError(error.message);
        }
    }

    function handleReset() {
        setForm({
            employee_id: '',
            full_name: '',
            email: '',
            department: ''
        });
    }

    if (loading) {
        return <p className="p-6">Loading employees...</p>;
    }
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Employees</h1>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 mb-3 rounded">
                    {error}
                </div>
            )}
            <form className="grid grid-cols-4 gap-4 mb-6" onSubmit={handleSubmit} onReset={handleReset}>
                <input type="text" name="employee_id" placeholder="Employee ID" 
                value={form.employee_id} onChange={handleChange}
                className="border p-2 rounded" required/>
                <input type="text" name="full_name" placeholder="Full Name" 
                value={form.full_name} onChange={handleChange}
                className="border p-2 rounded" required/>
                <input type="text" name="email" placeholder="Email" 
                value={form.email} onChange={handleChange}
                className="border p-2 rounded" required/>
                <input type="text" name="department" placeholder="Department" 
                value={form.department} onChange={handleChange}
                className="border p-2 rounded" required/>
                <button type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded"
                >Add Employee</button>
                <button type="reset"
                className="col-span-2 bg-red-600 text-white py-2 rounded"
                >Clear</button>
            </form>
            {employees.length === 0 ? (
                <p className="text-gray-500">No employees found.</p>
            ) : (
                <table className="w-full border text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Employee ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="border p-2">{emp.employee_id}</td>
                                <td className="border p-2">{emp.full_name}</td>
                                <td className="border p-2">{emp.email}</td>
                                <td className="border p-2">{emp.department}</td>
                                <td className="border p-2">
                                    <button
                                    onClick={() => handleDelete(emp.id)}
                                    className="text-red-400"
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}