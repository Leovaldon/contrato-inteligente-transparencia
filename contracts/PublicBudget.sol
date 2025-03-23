// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PublicBudget{
    // Estructura para almacenar la informacion de un proyecto
    struct Project{
        string name;        // Nombre del Proyecto
        uint totalBudget;   // Presupuesto total asignado
        uint releasedFunds; // Fondos liberados hasta el momento
        uint milestone;     // Hito actual (ejemplo: 1,2,3...)
        bool completed;     // Indica si el proyecto esta completado
    }

    // Lista de Proyectos
    Project[] public projects;

    // Direccion del Gobierno (quien puede crear proyectos y liberar fondos)
    address public government;

    // Eventos para notificar aaciones importantes
    event ProjectCreated(uint projectId, string name, uint TotalBudget);
    event FundsReleased(uint projectId, uint amount, uint milestone);

    // Constructor: establece la direccion del gobierno
    constructor(){
        government = msg.sender;
    }

    // Funcion para crear un nuevo proyecto
    function createProject(string memory _name, uint _totalBudget) external {
        require(msg.sender == government, "Solo el gobierno puede crear proyectos");
        projects.push(Project(_name, _totalBudget, 0, 0, false));
        emit ProjectCreated(projects.length - 1, _name, _totalBudget);
    }

    // Devuelve el número de proyectos almacenados
    function projectsLength() public view returns (uint) {
        return projects.length;
    }

    // Funcion para liberar fondos por hito
    function releasePayment(uint _projectId, uint _milestone) external {
        require(msg.sender == government, "No autorizado");
        require(!projects[_projectId].completed, "Proyecto ya completado");
        require(_milestone > projects[_projectId].milestone, "Hito no Valido");
    
        // Calcula el monto a liberar (20% del presupuesto por hito)
        uint amountToRelease = projects[_projectId].totalBudget * 20/100;
        projects[_projectId].releasedFunds += amountToRelease;
        projects[_projectId].milestone = _milestone;

        // Si se alcanza el ultimo hito (5), marca el proyecto como completado
        if (_milestone == 5) {
            projects[_projectId].completed = true;
        
        emit FundsReleased(_projectId, amountToRelease, _milestone);
        }
    }

    // Funcion para obtener detalles de un proyecto
    function getProjectDetails(uint _projectId) external view returns (
        string memory name,
        uint totalBudget,
        uint releasedFunds,
        uint milestone,
        bool completed
    ){
        Project memory project = projects[_projectId];
        return (
            project.name,
            project.totalBudget,
            project.releasedFunds,
            project.milestone,
            project.completed
        );
    }
}