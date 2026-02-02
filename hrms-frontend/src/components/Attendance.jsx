import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('PRESENT');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            const result = await apiFetch('employees/');
            setEmployees(result.data);
        } catch (error) {
            setError(error.message);
        }
    }

    async function loadAttendance(employeeId) {
        try {
            setLoading(true);
            const result = await apiFetch(`attendance/${employeeId}`);
            setRecords(result.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function isDateMarked() {
        return records.some(rec => rec.date === date);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!selectedEmployee || !date) {
            setError('Employee and date are required');
            return;
        }

        if (isDateMarked()) {
            setError('Attendance already marked')
            return;
        }

        try {
            await apiFetch('attendance/', {
                method: 'POST',
                body: JSON.stringify({
                    employee_id: selectedEmployee,
                    date,
                    status
                })
            });
            setDate('');
            setStatus('PRESENT');
            loadAttendance(selectedEmployee);
        } catch (error) {
            setError(error.message);
        }
    }

    function handleEmployeeChange(e) {
        const id = e.target.value;
        setSelectedEmployee(id);
        setRecords([]);
        if (id) {
            loadAttendance(id);
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Attendance</h1>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                    {error}
                </div>
            )}
            <form className="flex gap-4 mb-6" onSubmit={handleSubmit}>
                <select
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                className="border p-2 rounded"
                required
                >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.full_name}
                        </option>
                    ))}
                </select>
                <input type="date" 
                value={date} onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded"
                required
                />
                <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded"
                >
                    <option value="ABSENT">Absent</option>
                    <option value="PRESENT">Present</option>
                </select>
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 rounded"
                >Mark</button>
            </form>

            {loading ? (
                <p>Loading attendance...</p>
            ) : records.length === 0 ? (
                selectedEmployee && <p className="text-gray-500">No records found.</p>
            ) : (
                <table className="w-full border text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((rec, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{rec.date}</td>
                                <td className="border p-2">{rec.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}