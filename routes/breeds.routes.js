import { Router } from "express";
const router = Router();

// Endpoint GET /breeds
router.get("/", async (req, res) => {
    try {
        const DOG_API_KEY = process.env.DOG_API_KEY;
        const CAT_API_KEY = process.env.CAT_API_KEY;

        // Consultar ambas APIs
        const [dogsRes, catsRes] = await Promise.all([
            fetch("https://api.thedogapi.com/v1/breeds", {
                headers: { "x-api-key": DOG_API_KEY }
            }),
            fetch("https://api.thecatapi.com/v1/breeds", {
                headers: { "x-api-key": CAT_API_KEY }
            })
        ]);

        const dogs = await dogsRes.json();
        const cats = await catsRes.json();

        // Unir resultados en un solo array
        const breeds = [
            ...dogs.map(d => ({ name: d.name, type: "dog" })),
            ...cats.map(c => ({ name: c.name, type: "cat" }))
        ];

        res.json(breeds);
    } catch (error) {
        console.error("Error al obtener las razas:", error);
        res.status(500).json({ error: "Error al obtener las razas" });
    }
});

export default router;
