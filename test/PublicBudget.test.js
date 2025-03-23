const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PublicBudget", function() {
    let PublicBudget, publicBudget, government, user;

    this.beforeEach(async function () {
        // Obtener las cuentas de prueba
        [government, user] = await ethers.getSigners();

        // Desplegar el contrato
        PublicBudget = await ethers.getContractFactory("PublicBudget");
        publicBudget = await PublicBudget.deploy();
    });

    it("Should create a project", async function () {
        // Crear un proyecto desde la cuenta del gobierno
        await publicBudget.connect(government).createProject("Escuela Primaria", 1000);

        // Obtener los detalles del proyecto
        const project = await publicBudget.getProjectDetails(0);

        // Verifica que los detalles sean correctos
        expect(project.name).to.equal("Escuela Primaria");
        expect(project.totalBudget).to.equal(1000);
        expect(project.releasedFunds).to.equal(0);
        expect(project.milestone).to.equal(0);
        expect(project.completed).to.equal(false);
    });

    it("Should release funds for a milestone", async function () {
        // Crear un proyecto
        await publicBudget.connect(government).createProject("Hospital", 2000);

        // Liberar fondos para el primer hito
        await publicBudget.connect(government).releasePayment(0, 1);

        // Obtener los detalles del proyecto
        const project = await publicBudget.getProjectDetails(0);

        // Verificar que los fondos se liberaron correctamente
        expect(project.releasedFunds).to.equal(400); // 20% de 2000
        expect(project.milestone).to.equal(1);
    });

    it("Should not allow non-government to create projects", async function () {
        // Intentar crear un proyecto desde una cuenta no autorizada
        await expect(
            publicBudget.connect(user).createProject("Parque", 500)
        ).to.be.revertedWith("Solo el gobierno puede crear proyectos");
    });

    it("Should not allow releasing funds for an invalid milestone", async function () {
        // Crear un proyecto
        await publicBudget.connect(government).createProject("Carretera", 3000);

        // Intentar liberar fondos para un hito no valido
        await expect(
            publicBudget.connect(government).releasePayment(0, 0)
        ).to.be.revertedWith("Hito no Valido");
    });

    it("Should mark project as completed after final milestone", async function () {
        await publicBudget.connect(government).createProject("Puente", 5000);

        // Liberar fondos para los 5 hitos
        for (let i = 1; i <= 5; i++) {
            await publicBudget.connect(government).releasePayment(0, i);
        }

        // Obtener los detalles del proyecto
        const project = await publicBudget.getProjectDetails(0);

        // Verificar que el proyecto esta completado
        expect(project.completed).to.equal(true);
    });
});