const { sequelize, Article, Category, User, Ad } = require('./models');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset database

        // Create Users with Roles
        await User.create({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });

        await User.create({
            username: 'coordenador',
            password: 'password123',
            role: 'coordinator'
        });

        await User.create({
            username: 'escritor',
            password: 'password123',
            role: 'writer'
        });

        // Create Categories
        const categories = await Category.bulkCreate([
            { name: 'Política', slug: 'politica' },
            { name: 'Esportes', slug: 'esportes' },
            { name: 'Tecnologia', slug: 'tecnologia' },
            { name: 'Cultura', slug: 'cultura' },
            { name: 'Aracaju', slug: 'aracaju' }
        ]);

        // Map categories for easy access
        const catMap = {};
        categories.forEach(c => catMap[c.slug] = c.id);

        // Create Articles
        await Article.create({
            title: 'Prefeita de Aracaju comparece à abertura dos trabalhos legislativos de 2026',
            excerpt: 'A prefeita de Aracaju participou nesta terça-feira (3) da solenidade de abertura dos trabalhos legislativos de 2026 na Câmara Municipal...',
            content: '<p>A prefeita de Aracaju participou nesta terça-feira (3) da solenidade de abertura dos trabalhos legislativos de 2026 na Câmara Municipal. Durante seu discurso, destacou as principais realizações de sua gestão nos últimos anos e apresentou as prioridades para o ano que se inicia.</p>',
            image: '', // Use placeholder or icon in frontend if empty
            slug: 'prefeita-aracaju-abertura-legislativo-2026',
            categoryId: catMap['politica'],
            featured: true
        });

        await Article.create({
            title: 'The Strongest vence Deportivo Táchira na Libertadores',
            excerpt: 'Com o resultado, o Tigre precisa de um simples empate no jogo de volta para avançar...',
            content: '<p>Com o resultado, o Tigre precisa de um simples empate no jogo de volta para avançar à próxima fase da competição.</p>',
            slug: 'the-strongest-vence-deportivo-tachira',
            categoryId: catMap['esportes'],
            featured: false
        });

        await Article.create({
            title: 'Combate a deepfakes nas eleições 2026',
            excerpt: 'Gilmar Mendes defende força-tarefa especializada para identificar conteúdos manipulados...',
            content: '<p>Gilmar Mendes defende força-tarefa especializada para identificar conteúdos manipulados por IA durante o período eleitoral.</p>',
            slug: 'combate-deepfakes-eleicoes-2026',
            categoryId: catMap['tecnologia'],
            featured: false
        });

        // Create Ads
        await Ad.bulkCreate([
            {
                title: 'Supermercado Popular',
                content: 'Ofertas especiais toda semana com até 40% de desconto',
                link: '#',
                position: 'sidebar',
                type: 'text',
                icon: 'fas fa-shopping-bag',
                label: 'PATROCINADO'
            },
            {
                title: 'Concessionária Modelo',
                content: 'Financiamento especial com entrada facilitada e taxas especiais',
                link: '#',
                position: 'sidebar', // Should be 'content' or separate section in real app
                type: 'text', // In the original HTML it was in 'ads-section'
                icon: 'fas fa-car',
                label: 'PUBLICIDADE'
            }
        ]);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
