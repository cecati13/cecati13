export const vTableUsers = {

    template: `
    <table className="mt-4 bg-gray-700 rounded">
        <thead>
            <tr>
                <th className="min-w-44">Nombre</th>
                <th className="min-w-44">Correo Electrónico</th>
                <th className="min-w-36 px-2">Permisos</th>
                <th className="min-w-20">Cambiar Permisos</th>
            </tr>
        </thead>
        <tbody className="bg-gray-800">            
            <tr key={user.id}>
                <td>{user.nameCompleted}</td>
                <td>{user.email}</td>
                <td>ROLE</td>
                <td className="flex justify-center"><IconEdit/></td>
            </tr>
        </tbody>
    </table>`
}